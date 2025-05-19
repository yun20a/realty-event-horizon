
export type EventType = 'property' | 'client' | 'contract' | 'internal' | 'followup';

export type EventStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending';

export type CheckInStatus = 'success' | 'failed' | undefined;

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'client' | 'admin' | 'other';
  checkInStatus?: boolean | CheckInStatus;
  checkInTime?: Date;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  checkInError?: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  price?: number;
  type?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AttendanceRecord {
  id: string;
  participantId: string;
  timestamp: Date;
  status: CheckInStatus;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  errorMessage?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: Date;
  end: Date;
  allDay?: boolean;
  propertyId?: string;
  property?: Property;
  coordinates?: { lat: number; lng: number } | null;
  participants: Participant[];
  status: EventStatus;
  location: string;
  description?: string;
  reminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  qrCode?: string;
  checkInTimeWindow?: {
    start: Date;
    end: Date;
  };
  attendanceLog?: AttendanceRecord[];
}
