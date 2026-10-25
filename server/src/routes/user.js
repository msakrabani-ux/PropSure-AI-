import { Router } from 'express';
import { body, param } from 'express-validator';
import { Favorite, Inquiry, Report } from '../models/Others.js';
import Property from '../models/Property.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, pick } from '../utils/helpers.js';

export const users = Router();
export const favorites = Router();
export const inquiries = Router();
export const reports = Router();

users.get('/me', protect, (req, res) => {
  const { _id, name, email, role, preferences, searchHistory } = req.user;
  res.json({ id: _id, name, email, role, preferences, searchHistory });
});

const PREF_KEYS = ['listing', 'budgetMin', 'budgetMax', 'locations', 'familyMembers', 'needsSchool', 'schoolDistanceKm',
  'parkingRequired', 'accessibilityNeeds', 'transportMode', 'workingDaysPerMonth', 'dailyTravelBudget', 'workplace'];

users.put('/me/preferences', protect,
  body('listing').optional().isIn(['sale', 'rent']),
  body('transportMode').optional().isIn(['car', 'bike', 'public', 'walk']),
  body(['budgetMin', 'budgetMax', 'familyMembers', 'schoolDistanceKm', 'workingDaysPerMonth', 'dailyTravelBudget']).optional().isFloat({ min: 0 }),
  body('locations').optional().isArray({ max: 10 }),
  body('locations.*').optional().isString().isLength({ max: 80 }),
  validate,
  asyncHandler(async (req, res) => {
    const picked = pick(req.body, PREF_KEYS);
    for (const [k, v] of Object.entries(picked)) req.user.set(`preferences.${k}`, v);
    await req.user.save();
    res.json(req.user.preferences);
  })
);

users.post('/me/searches', protect, body('query').isString().isLength({ min: 1, max: 300 }), validate,
  asyncHandler(async (req, res) => {
    req.user.searchHistory = [{ query: req.body.query }, ...req.user.searchHistory].slice(0, 10);
    await req.user.save();
    res.status(201).json(req.user.searchHistory);
  })
);

favorites.use(protect);
favorites.get('/', asyncHandler(async (req, res) => {
  const items = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('property').lean();
  res.json(items.filter((f) => f.property).map((f) => f.property));
}));
favorites.post('/:propertyId', param('propertyId').isMongoId(), validate, asyncHandler(async (req, res) => {
  if (!(await Property.exists({ _id: req.params.propertyId, status: 'active' }))) return res.status(404).json({ message: 'Property not found' });
  await Favorite.updateOne({ user: req.user._id, property: req.params.propertyId }, {}, { upsert: true });
  res.status(201).json({ saved: true });
}));
favorites.delete('/:propertyId', param('propertyId').isMongoId(), validate, asyncHandler(async (req, res) => {
  await Favorite.deleteOne({ user: req.user._id, property: req.params.propertyId });
  res.json({ saved: false });
}));

inquiries.post('/', optionalAuth,
  body('property').isMongoId(),
  body('name').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail(),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('message').trim().isLength({ min: 5, max: 1000 }),
  validate,
  asyncHandler(async (req, res) => {
    if (!(await Property.exists({ _id: req.body.property }))) return res.status(404).json({ message: 'Property not found' });
    const doc = await Inquiry.create({ ...pick(req.body, ['property', 'name', 'email', 'phone', 'message']), user: req.user?._id });
    res.status(201).json({ id: doc._id, message: 'Inquiry sent' });
  })
);

reports.post('/', protect,
  body('property').isMongoId(),
  body('reason').isIn(['incorrect_info', 'fraud', 'duplicate', 'unavailable', 'other']),
  body('details').optional().trim().isLength({ max: 1000 }),
  validate,
  asyncHandler(async (req, res) => {
    if (!(await Property.exists({ _id: req.body.property }))) return res.status(404).json({ message: 'Property not found' });
    const doc = await Report.create({ ...pick(req.body, ['property', 'reason', 'details']), user: req.user._id });
    res.status(201).json({ id: doc._id, message: 'Report submitted' });
  })
);