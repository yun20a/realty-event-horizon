
// Initially using in-memory storage for simplicity
// In a production app, this would connect to a real database

const { generateId } = require('../utils/helpers');

// Copy over the mock event service logic for now
let mockEvents = [];

const generateEventQRCode = (eventId) => {
  // Generate a URL that points to the event check-in page
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${baseUrl}/event/${eventId}/check-in`;
};

// Initialize with some sample events
const initializeMockEvents = () => {
  // Sample implementation similar to the mockEventService
  // This would be replaced with actual database logic in production
  const today = new Date();
  
  // Generate a few basic events for testing
  const sampleEvent = {
    id: generateId(),
    title: "Sample Property Viewing",
    type: "property",
    start: new Date(today.setHours(10, 0, 0, 0)),
    end: new Date(today.setHours(11, 0, 0, 0)),
    allDay: false,
    participants: [
      {
        id: "user-1",
        name: "John Smith",
        email: "john.smith@example.com",
        role: "agent"
      }
    ],
    status: "scheduled",
    location: "123 Main Street, Los Angeles, CA",
    description: "Property viewing details.",
    reminders: {
      email: true,
      sms: false,
      push: true
    },
    createdBy: "user-1",
    createdAt: new Date(),
    qrCode: "",
  };
  
  // Add QR code
  sampleEvent.qrCode = generateEventQRCode(sampleEvent.id);
  
  // Add check-in time window
  sampleEvent.checkInTimeWindow = {
    start: new Date(sampleEvent.start.getTime() - 60 * 60 * 1000), // 1 hour before
    end: new Date(sampleEvent.end.getTime() + 60 * 60 * 1000) // 1 hour after
  };
  
  // Initialize attendance log
  sampleEvent.attendanceLog = [];
  
  mockEvents.push(sampleEvent);
};

// Initialize data
initializeMockEvents();

// Get all events
const getAllEvents = () => {
  return [...mockEvents];
};

// Get events for a specific date range
const getEventsByDateRange = (start, end) => {
  const filteredEvents = mockEvents.filter(
    (event) => event.start >= start && event.start <= end
  );
  return filteredEvents;
};

// Get a specific event
const getEventById = (id) => {
  return mockEvents.find((event) => event.id === id);
};

// Create a new event
const createEvent = (event) => {
  const newId = generateId();
  const newEvent = {
    ...event,
    id: newId,
    createdAt: new Date(),
    qrCode: generateEventQRCode(newId),
    checkInTimeWindow: {
      start: new Date(event.start.getTime() - 60 * 60 * 1000), // 1 hour before
      end: new Date(event.end.getTime() + 60 * 60 * 1000), // 1 hour after
    },
    attendanceLog: [],
  };
  mockEvents.push(newEvent);
  return newEvent;
};

// Update an existing event
const updateEvent = (id, updates) => {
  const index = mockEvents.findIndex((event) => event.id === id);
  if (index >= 0) {
    // Generate QR code if it doesn't exist
    if (!mockEvents[index].qrCode) {
      updates.qrCode = generateEventQRCode(id);
    }
    
    // Update check-in time window if start/end times changed
    if (updates.start || updates.end) {
      const start = updates.start || mockEvents[index].start;
      const end = updates.end || mockEvents[index].end;
      updates.checkInTimeWindow = {
        start: new Date(start.getTime() - 60 * 60 * 1000), // 1 hour before
        end: new Date(end.getTime() + 60 * 60 * 1000), // 1 hour after
      };
    }
    
    const updatedEvent = { ...mockEvents[index], ...updates, updatedAt: new Date() };
    mockEvents[index] = updatedEvent;
    return updatedEvent;
  }
  throw new Error("Event not found");
};

// Delete an event
const deleteEvent = (id) => {
  const index = mockEvents.findIndex((event) => event.id === id);
  if (index >= 0) {
    mockEvents.splice(index, 1);
    return true;
  }
  throw new Error("Event not found");
};

// Check-in via QR code with location tracking
const checkInParticipantWithLocation = (eventId, participantId, locationData) => {
  const eventIndex = mockEvents.findIndex((event) => event.id === eventId);
  if (eventIndex < 0) {
    throw new Error("Event not found");
  }
  
  const participantIndex = mockEvents[eventIndex].participants.findIndex(
    (p) => p.id === participantId
  );
  if (participantIndex < 0) {
    throw new Error("Participant not found");
  }
  
  // Process check-in based on location data
  let status = 'success';
  let errorMessage = undefined;
  
  if (!locationData) {
    status = 'failed';
    errorMessage = 'Location access denied or unavailable';
  }
  
  // Update participant
  const updatedParticipant = {
    ...mockEvents[eventIndex].participants[participantIndex],
    checkInStatus: status,
    checkInTime: new Date(),
    checkInLocation: locationData 
      ? { 
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy
        } 
      : undefined,
    checkInError: errorMessage
  };
  
  mockEvents[eventIndex].participants[participantIndex] = updatedParticipant;
  
  // Add to attendance log
  if (!mockEvents[eventIndex].attendanceLog) {
    mockEvents[eventIndex].attendanceLog = [];
  }
  
  mockEvents[eventIndex].attendanceLog.push({
    id: generateId(),
    participantId,
    timestamp: new Date(),
    status,
    location: updatedParticipant.checkInLocation,
    errorMessage
  });
  
  return { participant: updatedParticipant, status };
};

module.exports = {
  getAllEvents,
  getEventsByDateRange,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  checkInParticipantWithLocation
};
