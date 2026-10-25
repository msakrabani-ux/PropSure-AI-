import { Router } from 'express';
import { query, param } from 'express-validator';
import Property from '../models/Property.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, escapeRegex } from '../utils/helpers.js';

const router = Router();

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  area_desc: { area: -1 }
};

router.get('/',
  query('listing').optional().isIn(['sale', 'rent']),
  query('type').optional().isIn(['apartment', 'house', 'villa', 'plot']),
  query('furnished').optional().isIn(['furnished', 'semi-furnished', 'unfurnished']),
  query('sort').optional().isIn(Object.keys(SORTS)),
  query(['minPrice', 'maxPrice', 'bhk', 'page', 'limit']).optional().isInt({ min: 0 }).toInt(),
  query('parking').optional().isBoolean().toBoolean(),
  query('q').optional().isString().isLength({ max: 80 }),
  validate,
  asyncHandler(async (req, res) => {
    const { q, listing, type, furnished, minPrice, maxPrice, bhk, parking, sort = 'newest' } = req.query;
    const page = Math.max(req.query.page || 1, 1);
    const limit = Math.min(req.query.limit || 12, 50);

    const filter = { status: 'active' };
    if (listing) filter.listing = listing;
    if (type) filter.type = type;
    if (furnished) filter.furnished = furnished;
    if (parking !== undefined) filter.parking = parking;
    if (bhk) filter.bedrooms = { $gte: bhk };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (q) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ title: rx }, { 'address.city': rx }, { 'address.locality': rx }];
    }

    const [data, total] = await Promise.all([
      Property.find(filter).sort(SORTS[sort]).skip((page - 1) * limit).limit(limit).select('-contact').lean(),
      Property.countDocuments(filter)
    ]);
    res.json({ data, page, limit, total, pages: Math.ceil(total / limit) });
  })
);

router.get('/:id', param('id').isMongoId(), validate,
  asyncHandler(async (req, res) => {
    const property = await Property.findOne({ _id: req.params.id, status: 'active' }).lean();
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  })
);

export default router;