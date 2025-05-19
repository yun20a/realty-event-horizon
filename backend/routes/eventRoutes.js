
const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Event routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/range/:start/:end', eventController.getEventsByDateRange);
router.post('/:id/check-in', eventController.checkInParticipant);

module.exports = router;
