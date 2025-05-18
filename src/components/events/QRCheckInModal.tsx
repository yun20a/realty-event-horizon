
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationData, getCurrentLocation, isLocationWithinRange } from "@/services/locationService";
import { CalendarEvent, Participant } from "@/types/events";
import { CheckCircle, XCircle, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QRCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventLocation?: { lat: number; lng: number };
  participant: Participant;
  onCheckInComplete: (success: boolean, locationData?: LocationData) => void;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventLocation,
  participant,
  onCheckInComplete,
}) => {
  const [locationStatus, setLocationStatus] = useState<'pending' | 'success' | 'error' | 'denied'>('pending');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Request location when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocationStatus('pending');
      setCheckInStatus('pending');
      setErrorMessage(null);
      
      getLocation();
    }
  }, [isOpen]);
  
  // Get user's current location
  const getLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setLocationData(location);
      setLocationStatus('success');
      
      // Optional: Check if user is within allowed range of the event
      if (eventLocation) {
        const withinRange = isLocationWithinRange(
          location, 
          eventLocation,
          1.0 // 1km range
        );
        
        if (!withinRange) {
          setErrorMessage("You appear to be too far from the event location. Check-in may not be accurate.");
          // Still continue with check-in, just warn the user
        }
      }
      
      // Complete check-in process with location
      completeCheckIn(location);
    } catch (error) {
      console.error("Location error:", error);
      const errorMsg = (error as Error).message || "Failed to get your location";
      setErrorMessage(errorMsg);
      setLocationStatus(errorMsg.includes('denied') ? 'denied' : 'error');
      
      // Still try to complete check-in without location
      completeCheckIn(null);
    }
  };
  
  // Complete the check-in process
  const completeCheckIn = (location: LocationData | null) => {
    // Determine if check-in is successful (location required)
    const success = location !== null;
    setCheckInStatus(success ? 'success' : 'failed');
    
    // Call the callback to record attendance
    onCheckInComplete(success, location);
    
    // Show toast notification
    if (success) {
      toast.success("Check-in successful!");
    } else {
      toast.error("Check-in failed. Location access is required.");
    }
  };
  
  // Retry getting location
  const handleRetry = () => {
    setLocationStatus('pending');
    setErrorMessage(null);
    getLocation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          {locationStatus === 'pending' && (
            <>
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Checking your location</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please allow access to your location to complete check-in
              </p>
            </>
          )}
          
          {locationStatus === 'denied' && (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Location Access Required</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please enable location access in your browser settings to check in.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleRetry}>Try Again</Button>
              </div>
            </>
          )}
          
          {locationStatus === 'error' && !checkInStatus && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Location Error</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {errorMessage || "Unable to get your location."}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Your check-in will be recorded without location data.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleRetry}>Try Again</Button>
              </div>
            </>
          )}
          
          {checkInStatus === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Check-in Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Thank you {participant.name}, your attendance has been recorded.
              </p>
              {locationData && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Location captured
                </div>
              )}
            </>
          )}
          
          {checkInStatus === 'failed' && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Check-in Failed</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Unable to complete check-in. Location access is required.
              </p>
              <Button onClick={handleRetry}>Try Again</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
