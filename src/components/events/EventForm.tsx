
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarEvent, Property, Participant } from "@/types/events";
import { EventBasicDetails } from "./form/EventBasicDetails";
import { PropertySelector } from "./form/PropertySelector";
import { EventDateTimePicker } from "./form/EventDateTimePicker";
import { LocationPicker } from "./form/LocationPicker";
import { EventDescription } from "./form/EventDescription";
import { EventReminders } from "./form/EventReminders";
import { EventFormHeader } from "./form/EventFormHeader";
import { EventFormSidebar } from "./form/EventFormSidebar";

interface EventFormProps {
  event?: CalendarEvent;
  properties: Property[];
  participants: Participant[];
  onSave: (event: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  properties,
  participants,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>(
    event || {
      title: "",
      type: "property",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      participants: [],
      status: "scheduled",
      location: "",
      reminders: {
        email: true,
        sms: false,
        push: true,
      },
      coordinates: event?.coordinates || null,
    }
  );
  
  const [startDate, setStartDate] = useState<Date | undefined>(
    event ? new Date(event.start) : new Date()
  );
  
  const [endDate, setEndDate] = useState<Date | undefined>(
    event ? new Date(event.end) : new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  
  const [startTime, setStartTime] = useState<string>(
    event ? format(new Date(event.start), "HH:mm") : format(new Date(), "HH:mm")
  );
  
  const [endTime, setEndTime] = useState<string>(
    event ? format(new Date(event.end), "HH:mm") : format(new Date(new Date().getTime() + 60 * 60 * 1000), "HH:mm")
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePropertyChange = (propertyId: string) => {
    // If "none" is selected, clear the property
    if (propertyId === "none") {
      setFormData({
        ...formData,
        propertyId: undefined,
        property: undefined,
        location: formData.location || "", // Keep existing location if any
        coordinates: null,
      });
      return;
    }
    
    const property = properties.find((p) => p.id === propertyId);
    setFormData({
      ...formData,
      propertyId,
      property,
      location: property ? `${property.address}, ${property.city}, ${property.state} ${property.zipCode}` : formData.location,
      coordinates: property?.coordinates || null,
    });
  };

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setFormData({
      ...formData,
      coordinates,
    });
  };

  const handleReminderChange = (type: "email" | "sms" | "push", checked: boolean) => {
    setFormData({
      ...formData,
      reminders: {
        ...formData.reminders!,
        [type]: checked,
      },
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    
    const [hours, minutes] = startTime.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    
    setFormData({
      ...formData,
      start: date,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    setEndDate(date);
    
    const [hours, minutes] = endTime.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    
    setFormData({
      ...formData,
      end: date,
    });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    if (startDate) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDate = new Date(startDate);
      newDate.setHours(hours, minutes, 0, 0);
      
      setFormData({
        ...formData,
        start: newDate,
      });
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    if (endDate) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDate = new Date(endDate);
      newDate.setHours(hours, minutes, 0, 0);
      
      setFormData({
        ...formData,
        end: newDate,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <EventBasicDetails
                title={formData.title || ""}
                type={formData.type || "property"}
                status={formData.status || "scheduled"}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />

              <PropertySelector
                properties={properties}
                selectedPropertyId={formData.propertyId}
                onPropertyChange={handlePropertyChange}
              />

              <EventDateTimePicker
                startDate={startDate}
                startTime={startTime}
                endDate={endDate}
                endTime={endTime}
                onStartDateChange={handleStartDateChange}
                onStartTimeChange={handleStartTimeChange}
                onEndDateChange={handleEndDateChange}
                onEndTimeChange={handleEndTimeChange}
              />

              <LocationPicker
                location={formData.location || ""}
                coordinates={formData.coordinates}
                onInputChange={handleInputChange}
                onLocationSelect={handleLocationSelect}
              />

              <EventDescription
                description={formData.description}
                onInputChange={handleInputChange}
              />

              <EventReminders
                reminders={formData.reminders || { email: true, sms: false, push: true }}
                onReminderChange={handleReminderChange}
              />
            </div>

            <EventFormHeader
              event={event}
              onSave={onSave}
              onCancel={onCancel}
            />
          </form>
        </CardContent>
      </Card>

      <EventFormSidebar event={formData} />
    </div>
  );
};
