
export type EventType = 'property' | 'client' | 'contract' | 'internal' | 'followup';

export type EventStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending';

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'client' | 'admin' | 'other';
  checkInStatus?: boolean;
  checkInTime?: Date;
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

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: Date;
  end: Date;
  allDay?: boolean;
  propertyId?: string;
  property?: Property;
  participants: Participant[];
  status: EventStatus;
  location: string;
  description?: string;
  reminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  qrCode?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}
