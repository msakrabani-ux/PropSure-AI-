import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    listing: { type: String, enum: ['sale', 'rent'], required: true },
    type: { type: String, enum: ['apartment', 'house', 'villa', 'plot'], required: true },
    price: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    plotArea: Number,
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    floors: { type: Number, default: 1, min: 0 },
    parking: { type: Boolean, default: false },
    furnished: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished', 'n/a'], default: 'n/a' },
    ageYears: { type: Number, min: 0 },
    condition: { type: String, enum: ['new', 'good', 'needs-repair'] },
    waterSupply: String,
    electricity: String,
    amenities: [String],
    description: { type: String, maxlength: 3000 },
    images: [String],
    address: {
      line: String,
      locality: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: String
    },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number], default: undefined }
    },
    contact: { name: String, phone: String, email: String },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'unverified' },
    status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
    isSample: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

propertySchema.index({ location: '2dsphere' });
propertySchema.index({ listing: 1, type: 1, price: 1 });
propertySchema.index({ 'address.city': 1, 'address.locality': 1 });

export default mongoose.model('Property', propertySchema);