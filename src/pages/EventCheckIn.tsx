
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarEvent, Participant } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCheckInModal } from "@/components/events/QRCheckInModal";
import { Loader2, CheckCircle, XCircle, MapPin } from "lucide-react";
import * as mockEventService from "@/services/mockEventService";
import { LocationData } from "@/services/locationService";
import { format, isWithinInterval } from "date-fns";
import { toast } from "sonner";

const EventCheckIn = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User input for check-in
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [isValidTime, setIsValidTime] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState<boolean | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  
  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (id) {
          const eventData = await mockEventService.getEventById(id);
          if (eventData) {
            setEvent(eventData);
            
            // Check if QR code is active (within valid time window)
            const now = new Date();
            const validStartTime = eventData.checkInTimeWindow?.start || 
              new Date(eventData.start.getTime() - 60 * 60 * 1000); // Default 1 hour before
            const validEndTime = eventData.checkInTimeWindow?.end || 
              new Date(eventData.end.getTime() + 60 * 60 * 1000); // Default 1 hour after
            
            setIsValidTime(isWithinInterval(now, { start: validStartTime, end: validEndTime }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;
    
    // Find participant by email (case insensitive)
    const foundParticipant = event.participants.find(
      p => p.email.toLowerCase() === email.toLowerCase()
    );
    
    if (foundParticipant) {
      // If participant found, set it and open check-in modal
      setParticipant(foundParticipant);
      setCheckInModalOpen(true);
    } else {
      // Create a new participant for guests
      const newParticipant: Participant = {
        id: `temp-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email,
        role: 'other'
      };
      setParticipant(newParticipant);
      setCheckInModalOpen(true);
    }
  };

  const handleCheckInComplete = async (success: boolean, locationData?: LocationData) => {
    setCheckInComplete(success);
    
    if (success && event && participant && locationData) {
      try {
        const result = await mockEventService.checkInParticipantWithLocation(
          event.id,
          participant.id, 
          locationData
        );
        
        // Hide modal after a delay
        setTimeout(() => {
          setCheckInModalOpen(false);
        }, 3000);
      } catch (error) {
        toast.error("Failed to record check-in");
        console.error("Check-in error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <div className="text-xl mt-4">Loading event...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-500 mb-4">{error || "Event not found"}</div>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">{event.title}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" /> Event Check-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Time validity warning */}
            {!isValidTime && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> Check-in is only available during: 
                  <br />
                  {format(event.checkInTimeWindow?.start || 
                    new Date(event.start.getTime() - 60 * 60 * 1000), "MMM d, h:mm a")} 
                  {" - "}
                  {format(event.checkInTimeWindow?.end || 
                    new Date(event.end.getTime() + 60 * 60 * 1000), "h:mm a")}
                </p>
              </div>
            )}
            
            {checkInComplete === true ? (
              <div className="text-center py-6">
                <div className="p-4 bg-green-50 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-lg font-medium">Check-In Successful!</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  You have successfully checked in to this event.
                </p>
                <Button className="mt-6" onClick={() => navigate(`/event/${id}`)}>
                  View Event Details
                </Button>
              </div>
            ) : checkInComplete === false ? (
              <div className="text-center py-6">
                <div className="p-4 bg-red-50 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-lg font-medium">Check-In Failed</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We couldn't complete your check-in. Location access is required.
                </p>
                <Button 
                  className="mt-6" 
                  onClick={() => {
                    setCheckInComplete(null);
                    setCheckInModalOpen(true);
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name (optional)
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!isValidTime}
                >
                  Check In Now
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  We'll need to access your location to verify your attendance
                </p>
              </form>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Event location: {event.location}
        </p>
      </div>
      
      {participant && (
        <QRCheckInModal
          isOpen={checkInModalOpen}
          onClose={() => setCheckInModalOpen(false)}
          eventId={event.id}
          eventLocation={event.property?.coordinates}
          onCheckInComplete={handleCheckInComplete}
          participant={participant}
        />
      )}
    </div>
  );
};

export default EventCheckIn;
