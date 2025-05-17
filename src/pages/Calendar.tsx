
import React, { useState, useEffect } from "react";
import { CalendarEvent, Participant } from "@/types/events";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { CalendarDayView } from "@/components/calendar/CalendarDayView";
import { EventFilters, EventFilterOptions } from "@/components/calendar/EventFilters";
import { EventDetails } from "@/components/events/EventDetails";
import { EventForm } from "@/components/events/EventForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import * as mockEventService from "@/services/mockEventService";

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [properties, setProperties] = useState([]); 
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, propertiesData, participantsData] = await Promise.all([
          mockEventService.getAllEvents(),
          mockEventService.getProperties(),
          mockEventService.getParticipants(),
        ]);
        
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setProperties(propertiesData);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load calendar data");
      }
    };
    
    loadData();
  }, []);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: "month" | "week" | "day") => {
    setView(newView);
  };

  const handleFilterChange = (filters: EventFilterOptions) => {
    const filtered = events.filter(event => {
      // Filter by event type
      if (!filters.types.includes(event.type)) return false;
      
      // Filter by status
      if (!filters.statuses.includes(event.status)) return false;
      
      // Filter by agent
      if (filters.agents.length > 0) {
        const eventHasSelectedAgent = event.participants.some(
          participant => filters.agents.includes(participant.id)
        );
        if (!eventHasSelectedAgent) return false;
      }
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(searchTerm);
        const matchesLocation = event.location.toLowerCase().includes(searchTerm);
        const matchesDescription = event.description?.toLowerCase().includes(searchTerm) || false;
        
        if (!(matchesTitle || matchesLocation || matchesDescription)) return false;
      }
      
      return true;
    });
    
    setFilteredEvents(filtered);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEditMode(false);
    setShowEventForm(true);
  };

  const handleEditEvent = () => {
    setIsEditMode(true);
    setShowEventDetails(false);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      await mockEventService.deleteEvent(selectedEvent.id);
      
      // Update events list
      const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      
      setShowEventDetails(false);
      setSelectedEvent(null);
      
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleViewQRCode = () => {
    setShowEventDetails(false);
    setShowQRCode(true);
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      let savedEvent;
      
      if (isEditMode && selectedEvent) {
        // Update existing event
        savedEvent = await mockEventService.updateEvent(selectedEvent.id, eventData);
        
        // Update the events list
        const updatedEvents = events.map(e => 
          e.id === savedEvent.id ? savedEvent : e
        );
        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
        
        toast.success("Event updated successfully");
      } else {
        // Create new event
        savedEvent = await mockEventService.createEvent(eventData as Omit<CalendarEvent, "id" | "createdAt">);
        
        // Add to events list
        const updatedEvents = [...events, savedEvent];
        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
        
        toast.success("Event created successfully");
      }
      
      setShowEventForm(false);
      setSelectedEvent(savedEvent);
      setShowEventDetails(true);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <CalendarHeader
          date={date}
          view={view}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
          onAddEvent={handleAddEvent}
        />
        
        <EventFilters 
          agents={participants.filter(p => p.role === "agent")} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="p-4 h-[calc(100vh-280px)] overflow-y-auto">
          {view === "month" && (
            <CalendarMonthView
              date={date}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          
          {view === "week" && (
            <CalendarWeekView
              date={date}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          
          {view === "day" && (
            <CalendarDayView
              date={date}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          open={showEventDetails}
          onOpenChange={setShowEventDetails}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onViewQrCode={handleViewQRCode}
        />
      )}
      
      {/* Event Form Modal */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[900px]">
          <EventForm
            event={isEditMode ? selectedEvent || undefined : undefined}
            properties={properties}
            participants={participants}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowEventForm(false);
              if (selectedEvent) {
                setShowEventDetails(true);
              }
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* QR Code Modal */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-[400px]">
          {selectedEvent && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">QR Code</h2>
              <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  QR Code Preview
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Scan this QR code to check in to the event
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
