import mongoose from 'mongoose';
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true }
}, { timestamps: true });
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const inquirySchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, maxlength: 20 },
  message: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true });

const reportSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, enum: ['incorrect_info', 'fraud', 'duplicate', 'unavailable', 'other'], required: true },
  details: { type: String, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['open', 'reviewing', 'resolved', 'dismissed'], default: 'open' }
}, { timestamps: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export const Report = mongoose.model('Report', reportSchema);