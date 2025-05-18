import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/events";
import { EventBadge } from "@/components/events/EventBadge";
import { Share, MapPin, Calendar, Clock, ArrowRight, Users, QrCode } from "lucide-react";
import { EventAttendanceForm } from "@/components/events/EventAttendanceForm";
import { QRCodeWithTimer } from "@/components/events/QRCodeWithTimer";
import { AttendanceLogView } from "@/components/events/AttendanceLogView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as mockEventService from "@/services/mockEventService";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { StaticMap } from "@/components/map/StaticMap";

const EventLanding = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [checkInUrl, setCheckInUrl] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (id) {
          const eventData = await mockEventService.getEventById(id);
          if (eventData) {
            setEvent(eventData);
            
            // Get the check-in URL for the QR code - either use the one from the event or generate a new one
            const url = eventData.qrCode || mockEventService.getCheckInUrl(id);
            setCheckInUrl(url);
          } else {
            setError("Event not found");
          }
        } else {
          setError("No event ID provided");
        }
      } catch (err) {
        setError("Failed to load event");
        console.error("Error loading event:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleShare = async () => {
    if (!event) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join me at ${event.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    if (!event) return;
    
    const text = encodeURIComponent(
      `Join me at ${event.title} on ${format(event.start, "EEEE, MMMM d")} at ${format(event.start, "h:mm a")}. Location: ${event.location}`
    );
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleGetDirections = () => {
    if (!event) return;
    
    if (event.coordinates) {
      const { lat, lng } = event.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    } else {
      // Try to open map with the location text
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading event...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-500 mb-4">{error || "Event not found"}</div>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Find the agent (first participant with role="agent")
  const agent = event.participants.find(p => p.role === "agent");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold mb-4">
                    {event.title}
                  </CardTitle>
                  <EventBadge type={event.type} className="bg-white/20" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                    onClick={handleWhatsAppShare}
                  >
                    <svg 
                      viewBox="0 0 32 32" 
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.916 1.412 7.505 3.758 10.284l-2.454 7.317 7.519-2.407C11.618 33.024 13.744 34 16.004 34c8.817 0 15.996-7.176 15.996-16S24.821 0 16.004 0z" fill="currentColor" fillRule="nonzero"/>
                      <path d="M25.314 22.515c-.393 1.12-2.316 2.045-3.789 2.315-1.008.186-2.324.335-6.75-1.451-5.668-2.289-9.334-7.909-9.617-8.273-.267-.364-2.25-2.995-2.25-5.71s1.4-4.04 1.884-4.602c.405-.472.881-.59 1.175-.59.284 0 .567 0 .815.015.262.015.612-.101.956.728.35.842 1.189 2.911 1.293 3.125.104.214.175.466.052.745-.123.279-.185.451-.37.69-.183.241-.389.536-.556.719-.185.203-.378.424-.163.833.215.41.957 1.752 2.056 2.838 1.411 1.392 2.597 1.821 2.967 2.024.37.203.58.167.798-.092.217-.262.936-1.09 1.188-1.464.25-.371.503-.309.845-.186.344.123 2.164 1.02 2.534 1.205.37.186.618.279.721.434.104.153.104.884-.29 1.737z" fill="#FFF"/>
                    </svg>
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                    onClick={handleShare}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-4'} mb-6`}>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                  <TabsTrigger value="qr-code">QR Check-in</TabsTrigger>
                  <TabsTrigger value="attendance">
                    <Users className={`${isMobile ? '' : 'mr-2'} h-4 w-4`} />
                    {!isMobile && "Attendance"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <div className="font-medium">Date & Time</div>
                          <div>{format(event.start, "EEEE, MMMM d, yyyy")}</div>
                          <div>{format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <div className="font-medium">Location</div>
                          <div>
                            {event.location}
                          </div>
                          <Button 
                            variant="link" 
                            className="px-0 h-6 text-green-600 dark:text-green-400" 
                            onClick={handleGetDirections}
                          >
                            Get directions
                          </Button>
                        </div>
                      </div>

                      {event.description && (
                        <div>
                          <h3 className="font-medium text-lg mb-2">About</h3>
                          <div className="text-gray-600 dark:text-gray-300">
                            {event.description}
                          </div>
                        </div>
                      )}

                      {agent && (
                        <div>
                          <h3 className="font-medium text-lg mb-2">Contact</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{agent.email}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isMobile && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-lg mb-2">Location</h3>
                          {event.coordinates ? (
                            <StaticMap 
                              location={event.coordinates}
                              address={event.location}
                              height="200px"
                            />
                          ) : (
                            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <MapPin className="h-8 w-8 mr-2 text-gray-400" />
                              <span className="text-gray-400">Location Map</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!showAttendanceForm ? (
                    <div className="flex justify-center mt-10">
                      <Button onClick={() => setShowAttendanceForm(true)}>
                        RSVP to this event <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <h3 className="font-medium text-lg mb-4">Confirm Your Attendance</h3>
                      <EventAttendanceForm 
                        eventId={event.id} 
                        onSuccess={() => setShowAttendanceForm(false)} 
                      />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="map">
                  <div className="h-[400px] md:h-[500px]">
                    {event.coordinates ? (
                      <div className="h-full flex flex-col">
                        <StaticMap 
                          location={event.coordinates}
                          address={event.location}
                          height="85%"
                        />
                        <div className="mt-4 text-center">
                          <p className="text-sm mb-2">{event.location}</p>
                          <Button onClick={handleGetDirections}>
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">No exact location available</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          This event doesn't have exact coordinates set.
                        </p>
                        {event.location && (
                          <Button onClick={handleGetDirections}>
                            Look up "{event.location}"
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="qr-code">
                  <div className="flex flex-col items-center">
                    <QRCodeWithTimer
                      event={event}
                      checkInUrl={checkInUrl}
                    />
                    
                    <div className="mt-8 text-center max-w-md mx-auto">
                      <h3 className="font-medium text-lg mb-2">How to check in</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Scan this QR code using your mobile device camera or share the code with attendees.
                        Attendees will need to verify their location to complete check-in.
                      </p>
                      
                      <Button onClick={() => window.open(checkInUrl, '_blank')} variant="outline" className="mt-2">
                        Open Check-in Page
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="attendance">
                  <AttendanceLogView event={event} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-gray-500">
            This event is managed by a real estate CRM system.
          </div>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 z-50">
              <div className="flex justify-around">
                <Button 
                  variant="ghost" 
                  className={`flex flex-col items-center px-4 py-2 ${activeTab === 'details' ? 'text-blue-600' : 'text-gray-500'}`} 
                  onClick={() => setActiveTab('details')}
                >
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs">Details</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`flex flex-col items-center px-4 py-2 ${activeTab === 'map' ? 'text-blue-600' : 'text-gray-500'}`} 
                  onClick={() => setActiveTab('map')}
                >
                  <MapPin className="h-5 w-5 mb-1" />
                  <span className="text-xs">Map</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`flex flex-col items-center px-4 py-2 ${activeTab === 'qr-code' ? 'text-blue-600' : 'text-gray-500'}`} 
                  onClick={() => setActiveTab('qr-code')}
                >
                  <QrCode className="h-5 w-5 mb-1" />
                  <span className="text-xs">QR Code</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className={`flex flex-col items-center px-4 py-2 ${activeTab === 'attendance' ? 'text-blue-600' : 'text-gray-500'}`} 
                  onClick={() => setActiveTab('attendance')}
                >
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Guests</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLanding;
