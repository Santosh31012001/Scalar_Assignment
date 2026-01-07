const express = require('express');
const router = express.Router();
const {
    createEventType,
    getAllEventTypes,
    getEventTypeById,
    getEventTypeBySlug,
    updateEventType,
    deleteEventType
} = require('../controllers/eventTypesController');

// Event Types routes
router.post('/', createEventType);
router.get('/', getAllEventTypes);
router.get('/:id', getEventTypeById);
router.get('/slug/:slug', getEventTypeBySlug);
router.put('/:id', updateEventType);
router.delete('/:id', deleteEventType);

module.exports = router;
