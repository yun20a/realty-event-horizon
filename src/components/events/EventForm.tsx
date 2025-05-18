
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent, EventType, Property, Participant } from "@/types/events";
import { CalendarIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventQRCode } from "./EventQRCode";
import { MapPicker } from "../map/MapPicker";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const isNewEvent = !event;
  const isMobile = useIsMobile();
  
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

  const handleParticipantChange = (selectedIds: string[]) => {
    const selectedParticipants = participants.filter((p) => selectedIds.includes(p.id));
    setFormData({
      ...formData,
      participants: selectedParticipants,
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
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type" className="mt-1">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">Property Viewing</SelectItem>
                      <SelectItem value="client">Client Meeting</SelectItem>
                      <SelectItem value="contract">Contract Signing</SelectItem>
                      <SelectItem value="internal">Internal Meeting</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="property">Property</Label>
                <Select
                  value={formData.propertyId || "none"}
                  onValueChange={handlePropertyChange}
                >
                  <SelectTrigger id="property" className="mt-1">
                    <SelectValue placeholder="Select property (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No property</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.address}, {property.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date & Time</Label>
                  <div className="flex mt-1 space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={handleStartDateChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={handleStartTimeChange}
                      className="w-24 flex-shrink-0"
                    />
                  </div>
                </div>

                <div>
                  <Label>End Date & Time</Label>
                  <div className="flex mt-1 space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      className="w-24 flex-shrink-0"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile accordion for location section */}
              {isMobile ? (
                <Accordion type="single" collapsible defaultValue="location">
                  <AccordionItem value="location">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Location
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label htmlFor="location">Address</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter location"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Pin Location on Map</Label>
                          <div className="mt-2 h-[250px] rounded-md overflow-hidden">
                            <MapPicker
                              initialLocation={formData.coordinates || undefined}
                              onLocationSelect={handleLocationSelect}
                              height="250px"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Pin Location on Map</Label>
                    <div className="mt-2 h-[300px] rounded-md overflow-hidden">
                      <MapPicker
                        initialLocation={formData.coordinates || undefined}
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Add details about this event"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Reminders</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Reminder</span>
                    <Switch
                      checked={formData.reminders?.email}
                      onCheckedChange={(checked) => handleReminderChange("email", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Reminder</span>
                    <Switch
                      checked={formData.reminders?.sms}
                      onCheckedChange={(checked) => handleReminderChange("sms", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notification</span>
                    <Switch
                      checked={formData.reminders?.push}
                      onCheckedChange={(checked) => handleReminderChange("push", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isNewEvent ? "Create Event" : "Update Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Map preview */}
        <Card>
          <CardContent className="p-0 aspect-video overflow-hidden rounded-md">
            {formData.coordinates ? (
              <MapPicker 
                initialLocation={formData.coordinates}
                readOnly={true}
                height="100%"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <MapPin className="h-8 w-8 mr-2" />
                <span>Select a location on the map</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code preview */}
        <EventQRCode 
          event={formData as CalendarEvent} 
          qrCodeUrl={event?.qrCode || "https://api.example.com/qr/placeholder"} 
        />
      </div>
    </div>
  );
};
