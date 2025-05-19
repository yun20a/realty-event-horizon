
const participants = require('../models/participantModel');

exports.getAllParticipants = (req, res) => {
  try {
    const allParticipants = participants.getAllParticipants();
    res.status(200).json(allParticipants);
  } catch (error) {
    console.error('Error getting all participants:', error);
    res.status(500).json({ message: 'Failed to get participants', error: error.message });
  }
};

exports.createParticipant = (req, res) => {
  try {
    const newParticipant = participants.createParticipant(req.body);
    res.status(201).json(newParticipant);
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ message: 'Failed to create participant', error: error.message });
  }
};
