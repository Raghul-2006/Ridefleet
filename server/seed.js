import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import User from './models/User.js';

dotenv.config();

const vehicles = [
  {
    name: 'BMW X7 M50i',
    brand: 'BMW',
    type: 'Premium SUV',
    pricePerDay: 5499,
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'
    ],
    rating: 4.9,
    reviews: 124,
    specs: { maxSpeed: '250 km/h', acceleration: '4.7s', engine: '4.4L V8' }
  },
  {
    name: 'Tesla Model Y Performance',
    brand: 'Tesla',
    type: 'Electric SUV',
    pricePerDay: 2899,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
      'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=800&q=80'
    ],
    rating: 4.8,
    reviews: 412,
    specs: { maxSpeed: '250 km/h', acceleration: '3.5s', engine: 'Dual Motor AWD' }
  },
  {
    name: 'Audi RS e-tron GT',
    brand: 'Audi',
    type: 'Luxury Sedan',
    pricePerDay: 8999,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23bb59b710?w=800&q=80'
    ],
    rating: 5.0,
    reviews: 45,
    specs: { maxSpeed: '250 km/h', acceleration: '3.3s', engine: '93.4 kWh Battery' }
  },
  {
    name: 'Mercedes-Benz G-Wagon',
    brand: 'Mercedes-Benz',
    type: 'Rugged SUV',
    pricePerDay: 12999,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
    ],
    rating: 4.9,
    reviews: 89,
    specs: { maxSpeed: '220 km/h', acceleration: '4.5s', engine: '4.0L V8 Biturbo' }
  },
  {
    name: 'Porsche 911 Carrera',
    brand: 'Porsche',
    type: 'Sports Coupe',
    pricePerDay: 15499,
    seats: 2,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80'
    ],
    rating: 5.0,
    reviews: 72,
    specs: { maxSpeed: '293 km/h', acceleration: '4.2s', engine: '3.0L Twin-Turbo Flat-6' }
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ridefleet');
    console.log('Connected to MongoDB...');

    // Clear existing data
    await Vehicle.deleteMany({});
    console.log('Old vehicles removed.');

    // Seed vehicles
    await Vehicle.insertMany(vehicles);
    console.log(`${vehicles.length} high-quality vehicles seeded successfully!`);

    // Ensure a standard admin exists
    const adminEmail = 'admin@ridefleet.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
        // We use .create() to ensure the pre-save password hashing hook in User.js is triggered
        const adminUser = new User({
            name: 'System Administrator',
            email: adminEmail,
            password: 'admin', 
            role: 'admin'
        });
        await adminUser.save();
        console.log(`Admin account (${adminEmail}/admin) created successfully.`);
    } else {
        console.log('Admin account already exists.');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
