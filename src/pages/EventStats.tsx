
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent, EventType } from "@/types/events";
import { EventListView } from "@/components/events/EventListView";
import { EventFilters, EventFilterOptions } from "@/components/calendar/EventFilters";
import * as mockEventService from "@/services/mockEventService";
import { EventDetails } from "@/components/events/EventDetails";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type StatCard = {
  title: string;
  type?: EventType;
  count: number;
  color: string;
};

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

  const statCards: StatCard[] = [
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

  // Generate page links for pagination
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
      <h1 className="text-2xl font-bold">Event Statistics</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === (stat.type || 'all') ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onClick={() => filterEventsByType(stat.type)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.count}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Filter Badge */}
      {activeFilter !== 'all' && (
        <div className="flex items-center">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
            Filtered by: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            <button 
              className="ml-2 hover:bg-primary/20 p-1 rounded-full"
              onClick={() => filterEventsByType()}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Event Filters */}
      <EventFilters 
        agents={participants.filter(p => p.role === "agent")} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Event List with Extended actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg truncate">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{new Date(event.start).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                      {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                
                {/* Agent */}
                {event.participants.find(p => p.role === 'agent') && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                      {event.participants.find(p => p.role === 'agent')?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{event.participants.find(p => p.role === 'agent')?.name}</div>
                      <div className="text-sm text-muted-foreground">{event.participants.find(p => p.role === 'agent')?.email}</div>
                    </div>
                  </div>
                )}
                
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[230px]">{event.location}</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between pt-2">
                  <button 
                    className="text-sm flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => handleShareEvent(event)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" x2="12" y1="2" y2="15"></line>
                    </svg>
                    Share
                  </button>
                  
                  <button 
                    className="text-sm flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    onClick={() => handleViewEventPage(event.id)}
                  >
                    View Page
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" x2="21" y1="14" y2="3"></line>
                    </svg>
                  </button>
                  
                  <button 
                    className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleQrCodeClick(event)}
                  >
                    QR Code
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                      <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                      <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                      <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                      <path d="M21 21v.01"></path>
                      <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                      <path d="M3 12h.01"></path>
                      <path d="M12 3h.01"></path>
                      <path d="M12 16v.01"></path>
                      <path d="M16 12h1"></path>
                      <path d="M21 12v.01"></path>
                      <path d="M12 21v-1"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6 flex justify-center">
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
            
            {/* Show pagination with ellipses for many pages */}
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
      )}
      
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
