import { Router } from 'express';
import { body, param, query } from 'express-validator';
import Property from '../models/Property.js';
import { Inquiry, Report } from '../models/Others.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, pick } from '../utils/helpers.js';

const router = Router();
router.use(protect, adminOnly);

const FIELDS = ['title', 'listing', 'type', 'price', 'area', 'plotArea', 'bedrooms', 'bathrooms', 'floors', 'parking', 'furnished',
  'ageYears', 'condition', 'waterSupply', 'electricity', 'amenities', 'description', 'images', 'address', 'location', 'contact', 'status'];

const rules = (required) => {
  const opt = (c) => (required ? c : c.optional());
  return [
    opt(body('title').trim().isLength({ min: 3, max: 150 })),
    opt(body('listing').isIn(['sale', 'rent'])),
    opt(body('type').isIn(['apartment', 'house', 'villa', 'plot'])),
    opt(body('price').isFloat({ min: 0 })),
    opt(body('area').isFloat({ min: 0 })),
    opt(body('address.city').trim().notEmpty()),
    body('status').optional().isIn(['active', 'inactive', 'sold']),
    body('location.coordinates').optional().isArray({ min: 2, max: 2 }),
    body('images').optional().isArray({ max: 20 }),
    validate
  ];
};

router.get('/properties', query(['page', 'limit']).optional().isInt({ min: 1 }).toInt(), validate,
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1, limit = Math.min(req.query.limit || 20, 100);
    const [data, total] = await Promise.all([
      Property.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Property.countDocuments()
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  })
);

router.post('/properties', rules(true), asyncHandler(async (req, res) => {
  const doc = await Property.create({ ...pick(req.body, FIELDS), createdBy: req.user._id });
  res.status(201).json(doc);
}));

router.put('/properties/:id', param('id').isMongoId(), rules(false), asyncHandler(async (req, res) => {
  const doc = await Property.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ message: 'Property not found' });
  res.json(doc);
}));

router.delete('/properties/:id', param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const doc = await Property.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Property not found' });
  res.json({ deleted: true });
}));

router.patch('/properties/:id/verification', param('id').isMongoId(),
  body('verificationStatus').isIn(['unverified', 'pending', 'verified']), validate,
  asyncHandler(async (req, res) => {
    const doc = await Property.findByIdAndUpdate(req.params.id, { verificationStatus: req.body.verificationStatus }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Property not found' });
    res.json(doc);
  })
);

router.get('/reports', asyncHandler(async (_req, res) =>
  res.json(await Report.find().sort({ createdAt: -1 }).limit(200).populate('property', 'title').populate('user', 'name email').lean())));

router.patch('/reports/:id', param('id').isMongoId(), body('status').isIn(['open', 'reviewing', 'resolved', 'dismissed']), validate,
  asyncHandler(async (req, res) => {
    const doc = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Report not found' });
    res.json(doc);
  })
);

router.get('/inquiries', asyncHandler(async (_req, res) =>
  res.json(await Inquiry.find().sort({ createdAt: -1 }).limit(200).populate('property', 'title').lean())));

export default router;