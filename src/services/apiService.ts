
import { CalendarEvent, Participant, Property, LocationData, CheckInStatus } from "@/types/events";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error: ${response.status}`);
  }

  return response.json();
};

// Event API calls
export const getAllEvents = (): Promise<CalendarEvent[]> => {
  return fetchAPI('/events');
};

export const getEventsByDateRange = (start: Date, end: Date): Promise<CalendarEvent[]> => {
  return fetchAPI(`/events/range/${start.toISOString()}/${end.toISOString()}`);
};

export const getEventById = (id: string): Promise<CalendarEvent | undefined> => {
  return fetchAPI(`/events/${id}`);
};

export const createEvent = (event: Omit<CalendarEvent, "id" | "createdAt">): Promise<CalendarEvent> => {
  return fetchAPI('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
};

export const updateEvent = (
  id: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  return fetchAPI(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteEvent = (id: string): Promise<boolean> => {
  return fetchAPI(`/events/${id}`, {
    method: 'DELETE',
  }).then(() => true);
};

// Get sample properties
export const getProperties = (): Promise<Property[]> => {
  return fetchAPI('/properties');
};

// Get sample participants
export const getParticipants = (): Promise<Participant[]> => {
  return fetchAPI('/participants');
};

// Check-in via QR code with location tracking
export const checkInParticipantWithLocation = async (
  eventId: string,
  participantId: string,
  locationData: LocationData | null
): Promise<{ participant: Participant; status: CheckInStatus }> => {
  return fetchAPI(`/events/${eventId}/check-in`, {
    method: 'POST',
    body: JSON.stringify({
      participantId,
      locationData,
    }),
  });
};

// Get the check-in URL for a specific event
export const getCheckInUrl = (eventId: string): string => {
  return `${window.location.origin}/event/${eventId}/check-in`;
};
