import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    preferences: {
      listing: { type: String, enum: ['sale', 'rent'] },
      budgetMin: Number,
      budgetMax: Number,
      locations: [String],
      familyMembers: Number,
      needsSchool: Boolean,
      schoolDistanceKm: Number,
      parkingRequired: Boolean,
      accessibilityNeeds: Boolean,
      transportMode: { type: String, enum: ['car', 'bike', 'public', 'walk'] },
      workingDaysPerMonth: Number,
      dailyTravelBudget: Number,
      workplace: { address: String, lat: Number, lng: Number }
    },
    searchHistory: [{ query: { type: String, maxlength: 300 }, at: { type: Date, default: Date.now } }]
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model('User', userSchema);