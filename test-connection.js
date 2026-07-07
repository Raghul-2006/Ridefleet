import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ridefleet';

console.log(`Connecting to: ${MONGO_URI}`);

try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB Connected!');
  await mongoose.connection.close();
  console.log('Closed connection.');
  process.exit(0);
} catch (error) {
  console.error('❌ MongoDB Connection Failed!');
  console.error('Error message:', error.message);
  process.exit(1);
}
