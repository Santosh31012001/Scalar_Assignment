const express = require('express');
const router = express.Router();
const {
    getAvailableSlots,
    createBooking,
    getBookingById
} = require('../controllers/bookingController');

// Get available time slots for a specific event type and date
router.get('/available-slots/:slug', getAvailableSlots);

// Create a new booking
router.post('/', createBooking);

// Get booking by ID
router.get('/:id', getBookingById);

module.exports = router;
