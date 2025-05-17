
import React, { useState, useEffect } from "react";
import { CalendarEvent, Participant } from "@/types/events";
import { EventListView } from "@/components/events/EventListView";
import { EventFilters, EventFilterOptions } from "@/components/calendar/EventFilters";
import { EventDetails } from "@/components/events/EventDetails";
import { EventForm } from "@/components/events/EventForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import * as mockEventService from "@/services/mockEventService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const EventList = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [properties, setProperties] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 10;

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

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
        setTotalPages(Math.ceil(eventsData.length / eventsPerPage));
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load event data");
      }
    };
    
    loadData();
  }, []);

  // Update total pages when filtered events change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredEvents.length / eventsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredEvents]);

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

  const handleQrCodeClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowQRCode(true);
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

  // Generate page links
  const pageLinks = [];
  for (let i = 1; i <= totalPages; i++) {
    pageLinks.push(
      <PaginationItem key={i}>
        <PaginationLink 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(i);
          }}
          isActive={currentPage === i}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Event List</h1>
        <Button onClick={handleAddEvent} className="gap-2">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>
      
      <EventFilters 
        agents={participants.filter(p => p.role === "agent")} 
        onFilterChange={handleFilterChange} 
      />
      
      <EventListView 
        events={currentEvents}
        onEventClick={handleEventClick}
        onQrCodeClick={handleQrCodeClick}
      />
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {totalPages <= 5 ? (
            pageLinks
          ) : (
            <>
              {/* First page */}
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              
              {/* Display dots if needed */}
              {currentPage > 3 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
              
              {/* Pages around current page */}
              {Array.from(
                { length: Math.min(3, totalPages) },
                (_, i) => {
                  let pageNum;
                  if (currentPage <= 2) {
                    pageNum = i + 2; // 2, 3, 4
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 3 + i; // totalPages-2, totalPages-1, totalPages
                  } else {
                    pageNum = currentPage - 1 + i; // currentPage-1, currentPage, currentPage+1
                  }
                  
                  if (pageNum > 1 && pageNum < totalPages) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              ).filter(Boolean)}
              
              {/* Display dots if needed */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
              
              {/* Last page */}
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          open={showEventDetails}
          onOpenChange={setShowEventDetails}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onViewQrCode={() => setShowQRCode(true)}
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

export default EventList;
