const express = require('express');
const router = express.Router();
const {
    getTimezones,
    getAvailability,
    upsertAvailability
} = require('../controllers/availabilityController');

// Availability routes
router.get('/timezones', getTimezones);
router.get('/', getAvailability);
router.post('/', upsertAvailability);

module.exports = router;
