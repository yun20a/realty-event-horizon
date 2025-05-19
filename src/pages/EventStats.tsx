
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarEvent, EventType } from "@/types/events";
import { EventFilters, EventFilterOptions } from "@/components/calendar/EventFilters";
import * as mockEventService from "@/services/mockEventService";
import { EventDetails } from "@/components/events/EventDetails";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EventStatCardGrid } from "@/components/events/stats/EventStatCardGrid";
import { EventFilterBadge } from "@/components/events/stats/EventFilterBadge";
import { EventStatsGrid } from "@/components/events/stats/EventStatsGrid";
import { EventStatsPagination } from "@/components/events/stats/EventStatsPagination";
import { StatCardProps } from "@/components/events/stats/EventStatCard";

const EventStats = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [participants, setParticipants] = useState([]);
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, participantsData] = await Promise.all([
          mockEventService.getAllEvents(),
          mockEventService.getParticipants(),
        ]);
        
        setEvents(eventsData);
        setFilteredEvents(eventsData);
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

  const filterEventsByType = (type?: EventType) => {
    if (!type) {
      // Show all events
      setActiveFilter('all');
      setFilteredEvents(events);
    } else {
      // Filter by specific type
      setActiveFilter(type);
      const filtered = events.filter(event => event.type === type);
      setFilteredEvents(filtered);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleQrCodeClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowQRCode(true);
  };

  const handleViewEventPage = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleShareEvent = async (event: CalendarEvent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join me for ${event.title} at ${event.location}`,
          url: `${window.location.origin}/event/${event.id}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast.info("Copy this link to share: " + `${window.location.origin}/event/${event.id}`);
    }
  };

  // Calculate stats
  const propertyEventCount = events.filter(e => e.type === 'property').length;
  const clientEventCount = events.filter(e => e.type === 'client').length;
  const internalEventCount = events.filter(e => e.type === 'internal').length;
  const contractEventCount = events.filter(e => e.type === 'contract').length;
  const followupEventCount = events.filter(e => e.type === 'followup').length;
  const totalEventCount = events.length;

  const statCards: Omit<StatCardProps, 'isActive' | 'onClick'>[] = [
    { 
      title: "Total Events", 
      count: totalEventCount, 
      color: "bg-primary/10 text-primary" 
    },
    { 
      title: "Property Viewings", 
      type: "property", 
      count: propertyEventCount, 
      color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" 
    },
    { 
      title: "Client Meetings", 
      type: "client", 
      count: clientEventCount, 
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
    },
    { 
      title: "Internal Meetings", 
      type: "internal", 
      count: internalEventCount, 
      color: "bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400" 
    },
    { 
      title: "Contract Signings", 
      type: "contract", 
      count: contractEventCount, 
      color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" 
    },
    { 
      title: "Follow-ups", 
      type: "followup", 
      count: followupEventCount, 
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" 
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Event Statistics</h1>
      
      {/* Stats Cards */}
      <EventStatCardGrid 
        statCards={statCards}
        activeFilter={activeFilter}
        onFilterChange={filterEventsByType}
      />
      
      {/* Filter Badge */}
      <EventFilterBadge 
        activeFilter={activeFilter}
        onClearFilter={() => filterEventsByType()}
      />
      
      {/* Event Filters */}
      <EventFilters 
        agents={participants.filter(p => p.role === "agent")} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Event List with Extended actions */}
      <EventStatsGrid 
        events={currentEvents}
        onViewPage={handleViewEventPage}
        onShare={handleShareEvent}
        onQrCodeClick={handleQrCodeClick}
      />
      
      {/* Pagination */}
      <EventStatsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
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
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          open={showEventDetails}
          onOpenChange={setShowEventDetails}
          onEdit={() => {}} // Not implementing edit functionality in this view
          onDelete={() => {}} // Not implementing delete functionality in this view
          onViewQrCode={() => setShowQRCode(true)}
        />
      )}
    </div>
  );
};

export default EventStats;
