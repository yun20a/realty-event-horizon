
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarEvent } from "@/types/events";
import * as mockEventService from "@/services/mockEventService";
import { EventLandingContainer } from "@/components/events/landing/EventLandingContainer";

const EventLanding = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkInUrl, setCheckInUrl] = useState("");

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

  return <EventLandingContainer event={event} checkInUrl={checkInUrl} />;
};

export default EventLanding;

// Import Button for error state
import { Button } from "@/components/ui/button";
