import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const { vehicle, vehicleName, image, startDate, endDate, rentalDays, totalAmount, paymentMethod, addOns } = req.body;
    
    const booking = new Booking({
      user: req.user._id,
      vehicle,
      vehicleName,
      image,
      startDate,
      endDate,
      rentalDays,
      totalAmount,
      paymentMethod,
      addOns
    });

    const createdBooking = await booking.save();

    // Award reward points (10 per booking)
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { rewardPoints: 10 }
    });

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bookings/:id/feedback (Submit User Feedback)
router.patch('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Feedback can only be provided for completed trips.' });
    }

    // Update Vehicle's average rating and review count
    const Vehicle = (await import('../models/Vehicle.js')).default;
    const vehicle = await Vehicle.findById(booking.vehicle);
    
    if (vehicle) {
      const currentReviews = vehicle.reviews || 0;
      const currentRating = vehicle.rating || 0;
      
      // Only increment study count and update rating if this is the first feedback for this booking
      if (!booking.rating) {
        const newRating = ((currentRating * currentReviews) + rating) / (currentReviews + 1);
        vehicle.rating = Number(newRating.toFixed(1));
        vehicle.reviews = currentReviews + 1;
      } else {
        // If updating an existing rating:
        // Adjusted Rating = ((old_avg * old_count) - old_val + new_val) / old_count
        const oldRatingValue = booking.rating;
        const adjustedRating = ((currentRating * currentReviews) - oldRatingValue + rating) / currentReviews;
        vehicle.rating = Number(adjustedRating.toFixed(1));
      }
      
      await vehicle.save();
    }

    booking.rating = rating;
    booking.feedback = feedback;
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bookings/:id/status (Admin status update)
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
