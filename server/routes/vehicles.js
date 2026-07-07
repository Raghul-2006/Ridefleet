import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/vehicles (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { name, brand, type, pricePerDay, seats, transmission, fuelType, image, specs } = req.body;

  try {
    const vehicle = await Vehicle.create({
      name,
      brand,
      type,
      pricePerDay,
      seats,
      transmission,
      fuelType,
      image,
      images: [image], // Use main image as first thumbnail
      specs: specs || { maxSpeed: '220 km/h', acceleration: '6.5s', engine: 'Standard' }
    });

    if (vehicle) {
      res.status(201).json(vehicle);
    } else {
      res.status(400).json({ message: 'Invalid vehicle data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/vehicles/:id (Admin only)
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      Object.assign(vehicle, req.body);
      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/vehicles/:id (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/vehicles/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const Booking = (await import('../models/Booking.js')).default;
    const reviews = await Booking.find({
      vehicle: req.params.id,
      rating: { $exists: true },
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .populate('user', 'name');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
