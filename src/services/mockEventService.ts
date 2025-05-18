import { CalendarEvent, EventType, EventStatus, Participant, Property, CheckInStatus } from "@/types/events";
import { addDays, addHours, subDays, startOfDay, endOfDay } from "date-fns";
import { LocationData } from "./locationService";

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate a QR code URL for an event - Move this function definition earlier in the file
const generateEventQRCode = (eventId: string): string => {
  // Generate a URL that points to the event check-in page
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/${eventId}/check-in`;
};

// Sample properties
const sampleProperties: Property[] = [
  {
    id: "prop-1",
    address: "123 Main Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    price: 1250000,
    type: "Single Family Home",
    coordinates: { lat: 34.052235, lng: -118.243683 },
  },
  {
    id: "prop-2",
    address: "456 Ocean Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    price: 1875000,
    type: "Condo",
    coordinates: { lat: 37.774929, lng: -122.419416 },
  },
  {
    id: "prop-3",
    address: "789 Desert Road",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001",
    price: 750000,
    type: "Single Family Home",
    coordinates: { lat: 33.448376, lng: -112.074036 },
  },
  {
    id: "prop-4",
    address: "321 Lake View",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    price: 950000,
    type: "Apartment",
    coordinates: { lat: 41.878113, lng: -87.629799 },
  },
  {
    id: "prop-5",
    address: "555 Park Lane",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    price: 2500000,
    type: "Condo",
    coordinates: { lat: 40.712776, lng: -74.005974 },
  },
];

// Sample participants
const sampleParticipants: Participant[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "agent",
  },
  {
    id: "user-2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "agent",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "client",
  },
  {
    id: "user-4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    role: "client",
  },
  {
    id: "user-5",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "admin",
  },
];

// Generate sample events
const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];

  // Event types
  const eventTypes: EventType[] = ["property", "client", "contract", "internal", "followup"];
  const statuses: EventStatus[] = ["scheduled", "completed", "cancelled", "pending"];

  // Generate events for the past week and next 3 weeks (total 4 weeks)
  for (let i = -7; i < 21; i++) {
    const numEventsForDay = Math.floor(Math.random() * 3) + 1; // 1-3 events per day
    
    for (let j = 0; j < numEventsForDay; j++) {
      const eventDate = addDays(today, i);
      const startHour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
      const durationHours = Math.floor(Math.random() * 2) + 1; // 1-2 hours
      
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const eventProperty = eventType === 'property' || Math.random() > 0.5 
        ? sampleProperties[Math.floor(Math.random() * sampleProperties.length)] 
        : undefined;
      
      const start = new Date(eventDate);
      start.setHours(startHour, 0, 0, 0);
      
      const end = new Date(start);
      end.setHours(start.getHours() + durationHours);
      
      // Pick 1-3 random participants
      const numParticipants = Math.floor(Math.random() * 3) + 1;
      const eventParticipants: Participant[] = [];
      const usedIndices = new Set<number>();
      
      for (let k = 0; k < numParticipants; k++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * sampleParticipants.length);
        } while (usedIndices.has(randomIndex));
        
        usedIndices.add(randomIndex);
        const participant = { ...sampleParticipants[randomIndex] };
        
        // Add check-in status for past events
        if (start < today) {
          participant.checkInStatus = Math.random() > 0.3; // 70% checked in
          if (participant.checkInStatus) {
            participant.checkInTime = start;
          }
        }
        
        eventParticipants.push(participant);
      }
      
      // Event title based on type
      let title = "";
      switch (eventType) {
        case "property":
          title = `Viewing: ${eventProperty?.address || "Property"}`;
          break;
        case "client":
          title = `Meeting with ${eventParticipants.find(p => p.role === 'client')?.name || 'Client'}`;
          break;
        case "contract":
          title = `Contract Signing for ${eventProperty?.address || 'Property'}`;
          break;
        case "internal":
          title = "Team Meeting";
          break;
        case "followup":
          title = `Follow-up on ${eventProperty?.address || 'Lead'}`;
          break;
      }
      
      // Generate status based on date
      let status: EventStatus;
      if (end < today) {
        status = Math.random() > 0.2 ? "completed" : "cancelled"; // 80% completed, 20% cancelled
      } else if (start < today) {
        status = "scheduled"; // Current events are always scheduled
      } else {
        status = Math.random() > 0.8 ? "pending" : "scheduled"; // 80% scheduled, 20% pending
      }
      
      events.push({
        id: generateId(),
        title,
        type: eventType,
        start,
        end,
        allDay: Math.random() > 0.9, // 10% all-day events
        propertyId: eventProperty?.id,
        property: eventProperty,
        coordinates: eventProperty?.coordinates || null,
        participants: eventParticipants,
        status,
        location: eventProperty 
          ? `${eventProperty.address}, ${eventProperty.city}, ${eventProperty.state} ${eventProperty.zipCode}`
          : "Office",
        description: `${title} - ${eventType} event details go here.`,
        reminders: {
          email: Math.random() > 0.3,
          sms: Math.random() > 0.5,
          push: Math.random() > 0.4,
        },
        createdBy: "user-1",
        createdAt: subDays(start, Math.floor(Math.random() * 7) + 1),
      });
    }
  }

  // Ensure all events have QR codes and check-in time windows
  return events.map(event => {
    // Add QR code if not exists
    if (!event.qrCode) {
      event.qrCode = generateEventQRCode(event.id);
    }
    
    // Add check-in time window if not exists
    if (!event.checkInTimeWindow) {
      event.checkInTimeWindow = {
        start: new Date(event.start.getTime() - 60 * 60 * 1000), // 1 hour before
        end: new Date(event.end.getTime() + 60 * 60 * 1000), // 1 hour after
      };
    }
    
    // Initialize attendance log if not exists
    if (!event.attendanceLog) {
      event.attendanceLog = [];
    }
    
    return event;
  });
};

let mockEvents = generateMockEvents();

// Get all events
export const getAllEvents = (): Promise<CalendarEvent[]> => {
  return Promise.resolve([...mockEvents]);
};

// Get events for a specific date range
export const getEventsByDateRange = (start: Date, end: Date): Promise<CalendarEvent[]> => {
  const filteredEvents = mockEvents.filter(
    (event) => event.start >= start && event.start <= end
  );
  return Promise.resolve(filteredEvents);
};

// Get a specific event
export const getEventById = (id: string): Promise<CalendarEvent | undefined> => {
  const event = mockEvents.find((event) => event.id === id);
  return Promise.resolve(event);
};

// Create a new event
export const createEvent = (event: Omit<CalendarEvent, "id" | "createdAt">): Promise<CalendarEvent> => {
  const newEvent: CalendarEvent = {
    ...event,
    id: generateId(),
    createdAt: new Date(),
    qrCode: generateEventQRCode(`${event.title}-${generateId()}`),
    checkInTimeWindow: {
      start: new Date(event.start.getTime() - 60 * 60 * 1000), // 1 hour before
      end: new Date(event.end.getTime() + 60 * 60 * 1000), // 1 hour after
    },
    attendanceLog: [],
  };
  mockEvents.push(newEvent);
  return Promise.resolve(newEvent);
};

// Update an existing event
export const updateEvent = (
  id: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
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
    return Promise.resolve(updatedEvent);
  }
  return Promise.reject(new Error("Event not found"));
};

// Delete an event
export const deleteEvent = (id: string): Promise<boolean> => {
  const index = mockEvents.findIndex((event) => event.id === id);
  if (index >= 0) {
    mockEvents.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.reject(new Error("Event not found"));
};

// Get sample properties
export const getProperties = (): Promise<Property[]> => {
  return Promise.resolve([...sampleProperties]);
};

// Get sample participants
export const getParticipants = (): Promise<Participant[]> => {
  return Promise.resolve([...sampleParticipants]);
};

// Mock check-in with QR code
export const checkInParticipant = (
  eventId: string,
  participantId: string
): Promise<Participant> => {
  const eventIndex = mockEvents.findIndex((event) => event.id === eventId);
  if (eventIndex < 0) {
    return Promise.reject(new Error("Event not found"));
  }
  
  const participantIndex = mockEvents[eventIndex].participants.findIndex(
    (p) => p.id === participantId
  );
  if (participantIndex < 0) {
    return Promise.reject(new Error("Participant not found"));
  }
  
  const updatedParticipant = {
    ...mockEvents[eventIndex].participants[participantIndex],
    checkInStatus: true,
    checkInTime: new Date(),
  };
  
  mockEvents[eventIndex].participants[participantIndex] = updatedParticipant;
  
  return Promise.resolve(updatedParticipant);
};

// Check-in via QR code with location tracking
export const checkInParticipantWithLocation = async (
  eventId: string,
  participantId: string,
  locationData: LocationData | null
): Promise<{ participant: Participant; status: CheckInStatus }> => {
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
  let status: CheckInStatus = 'success';
  let errorMessage: string | undefined = undefined;
  
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

// Get the check-in URL for a specific event
export const getCheckInUrl = (eventId: string): string => {
  return `${window.location.origin}/event/${eventId}/check-in`;
};
