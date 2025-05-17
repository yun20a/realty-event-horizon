
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentLocation, LocationData } from "@/services/locationService";
import { Participant } from "@/types/events";
import { toast } from "sonner";
import { Loader2, MapPin, CheckCircle, XCircle, AlertCircle, Smartphone } from "lucide-react";

interface QRCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventLocation: { lat: number; lng: number } | undefined;
  onCheckInComplete: (success: boolean, locationData?: LocationData) => void;
  participant: Participant;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventLocation,
  onCheckInComplete,
  participant,
}) => {
  const [step, setStep] = useState<"initial" | "requesting" | "success" | "error">("initial");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("initial");
      setErrorMessage("");
      setLocationData(null);
    }
  }, [isOpen]);

  const handleRequestLocation = async () => {
    setStep("requesting");
    
    try {
      const location = await getCurrentLocation();
      setLocationData(location);
      setStep("success");
      onCheckInComplete(true, location);
      toast.success("Successfully checked in!");
    } catch (error) {
      console.error("Location error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to get location");
      setStep("error");
      onCheckInComplete(false);
    }
  };

  const handleRetry = () => {
    setStep("initial");
    setErrorMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Event Check-In</DialogTitle>
          <DialogDescription className="text-center">
            Welcome {participant.name}, please share your location to complete check-in
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          {step === "initial" && (
            <>
              <div className="text-center space-y-2">
                <div className="p-6 bg-blue-50 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium mt-4">Location Required</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  We need your current location to confirm your attendance at this event.
                </p>
              </div>
              
              <Button 
                onClick={handleRequestLocation} 
                className="gap-2"
                size="lg"
              >
                <Smartphone className="h-5 w-5" />
                Share My Location
              </Button>
            </>
          )}

          {step === "requesting" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p>Requesting location access...</p>
              <p className="text-xs text-muted-foreground">Please allow access when prompted by your browser</p>
            </div>
          )}

          {step === "success" && locationData && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-green-50 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-medium">Check-In Successful!</h3>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Location captured:</p>
                <p className="text-xs text-muted-foreground">
                  Lat: {locationData.latitude.toFixed(6)}, 
                  Lng: {locationData.longitude.toFixed(6)}
                </p>
              </div>
              
              <Button onClick={onClose}>Close</Button>
            </div>
          )}

          {step === "error" && (
            <div className="text-center space-y-4 w-full">
              <div className="p-6 bg-red-50 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              
              <h3 className="text-lg font-medium">Location Access Required</h3>
              
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              
              <div className="space-y-2 mt-4">
                <Button onClick={handleRetry} className="w-full">Try Again</Button>
                <Button variant="outline" onClick={onClose} className="w-full">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
