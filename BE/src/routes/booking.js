const express = require('express');
const router = express.Router();
const {
    getAvailableSlots,
    createBooking,
    getBookingById,
    getAllBookings,
    cancelBooking
} = require('../controllers/bookingController');

// Get available time slots for a specific event type and date
router.get('/available-slots/:slug', getAvailableSlots);

// Get all bookings with optional filter
router.get('/', getAllBookings);

// Create a new booking
router.post('/', createBooking);

// Get booking by ID
router.get('/:id', getBookingById);

// Cancel a booking
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
