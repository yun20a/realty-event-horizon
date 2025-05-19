
const events = require('../models/eventModel');

// Controllers for event operations
exports.getAllEvents = (req, res) => {
  try {
    const allEvents = events.getAllEvents();
    res.status(200).json(allEvents);
  } catch (error) {
    console.error('Error getting all events:', error);
    res.status(500).json({ message: 'Failed to get events', error: error.message });
  }
};

exports.getEventById = (req, res) => {
  try {
    const event = events.getEventById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error getting event by ID:', error);
    res.status(500).json({ message: 'Failed to get event', error: error.message });
  }
};

exports.createEvent = (req, res) => {
  try {
    const newEvent = events.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

exports.updateEvent = (req, res) => {
  try {
    const updatedEvent = events.updateEvent(req.params.id, req.body);
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

exports.deleteEvent = (req, res) => {
  try {
    const deleted = events.deleteEvent(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

exports.getEventsByDateRange = (req, res) => {
  try {
    const { start, end } = req.params;
    const filteredEvents = events.getEventsByDateRange(new Date(start), new Date(end));
    res.status(200).json(filteredEvents);
  } catch (error) {
    console.error('Error getting events by date range:', error);
    res.status(500).json({ message: 'Failed to get events', error: error.message });
  }
};

exports.checkInParticipant = (req, res) => {
  try {
    const { eventId } = req.params;
    const { participantId, locationData } = req.body;
    
    const result = events.checkInParticipantWithLocation(eventId, participantId, locationData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error checking in participant:', error);
    res.status(500).json({ message: 'Failed to check in participant', error: error.message });
  }
};
