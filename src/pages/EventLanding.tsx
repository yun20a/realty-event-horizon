
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/events";
import { EventBadge } from "@/components/events/EventBadge";
import { Share } from "lucide-react";
import * as mockEventService from "@/services/mockEventService";

const EventLanding = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (id) {
          const eventData = await mockEventService.getEventById(id);
          if (eventData) {
            setEvent(eventData);
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || "Event",
          text: `Join me at ${event?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      console.log("Web Share API not supported");
      // You could show a modal with sharing options here
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
      <div className="container mx-auto py-12 px-4">
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
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Date & Time</h3>
                    <div className="text-gray-600 dark:text-gray-300">
                      <div>{format(event.start, "EEEE, MMMM d, yyyy")}</div>
                      <div>{format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">Location</h3>
                    <div className="text-gray-600 dark:text-gray-300">
                      {event.location}
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
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
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

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Check In</h3>
                    <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
                      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4">
                        QR Code
                      </div>
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
                        Scan this code upon arrival to check in
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Check In Manually
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">Map</h3>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      Map Preview
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <Button>
                  RSVP to this event
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-gray-500">
            This event is managed by a real estate CRM system.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLanding;
