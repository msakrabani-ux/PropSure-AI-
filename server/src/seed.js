import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Property from './models/Property.js';
import User from './models/User.js';

// SAMPLE DATA ONLY. Not real listings. Coordinates are rough locality-area points for map testing.
const p = (title, listing, type, price, area, bedrooms, bathrooms, parking, furnished, ageYears, locality, city, lng, lat) => ({
  title, listing, type, price, area, bedrooms, bathrooms, parking, furnished, ageYears,
  address: { locality, city, state: 'Tamil Nadu' },
  location: { type: 'Point', coordinates: [lng, lat] },
  description: 'Sample listing for demonstration. Not a real property.',
  verificationStatus: 'unverified', isSample: true
});

const samples = [
  p('Sample 2 BHK Apartment', 'sale', 'apartment', 5800000, 980, 2, 2, true, 'unfurnished', 4, 'Velachery', 'Chennai', 80.218, 12.9815),
  p('Sample 3 BHK Apartment', 'sale', 'apartment', 8900000, 1450, 3, 3, true, 'semi-furnished', 2, 'RS Puram', 'Coimbatore', 76.95, 11.007),
  p('Sample Independent House', 'sale', 'house', 12500000, 2100, 4, 3, true, 'unfurnished', 8, 'Fairlands', 'Salem', 78.146, 11.6643),
  p('Sample 4 BHK Villa', 'sale', 'villa', 32000000, 3200, 4, 4, true, 'furnished', 1, 'ECR', 'Chennai', 80.25, 12.82),
  p('Sample Residential Plot', 'sale', 'plot', 3500000, 1200, 0, 0, false, 'n/a', 0, 'Alagapuram', 'Salem', 78.12, 11.65),
  p('Sample 2 BHK Apartment (Rent)', 'rent', 'apartment', 16000, 900, 2, 2, true, 'semi-furnished', 6, 'Anna Nagar', 'Madurai', 78.14, 9.925),
  p('Sample 1 BHK Apartment (Rent)', 'rent', 'apartment', 18000, 650, 1, 1, false, 'furnished', 10, 'Adyar', 'Chennai', 80.257, 13.0067),
  p('Sample 3 BHK House (Rent)', 'rent', 'house', 35000, 1800, 3, 3, true, 'unfurnished', 12, 'Saibaba Colony', 'Coimbatore', 76.94, 11.025)
];

await connectDB();
await Property.deleteMany({ isSample: true });
await Property.insertMany(samples);
console.log(`Seeded ${samples.length} sample properties`);

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  const email = ADMIN_EMAIL.toLowerCase();
  if (!(await User.exists({ email }))) {
    await User.create({ name: 'Admin', email, role: 'admin', passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) });
    console.log(`Admin created: ${email}`);
  } else console.log('Admin already exists');
}
await mongoose.disconnect();