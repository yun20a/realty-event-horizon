
const express = require('express');
const participantController = require('../controllers/participantController');

const router = express.Router();

// Participant routes
router.get('/', participantController.getAllParticipants);
router.post('/', participantController.createParticipant);

module.exports = router;
