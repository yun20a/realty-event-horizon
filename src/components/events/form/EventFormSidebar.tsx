
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarEvent } from "@/types/events";
import { MapPin } from "lucide-react";
import { MapPicker } from "@/components/map/MapPicker";
import { EventQRCode } from "../EventQRCode";

interface EventFormSidebarProps {
  event: Partial<CalendarEvent>;
}

export const EventFormSidebar: React.FC<EventFormSidebarProps> = ({ event }) => {
  return (
    <div className="space-y-6">
      {/* Map preview */}
      <Card>
        <CardContent className="p-0 aspect-video overflow-hidden rounded-md">
          {event.coordinates ? (
            <MapPicker 
              initialLocation={event.coordinates}
              readOnly={true}
              height="100%"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <MapPin className="h-8 w-8 mr-2" />
              <span>Select a location on the map</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code preview */}
      {event.id && (
        <EventQRCode 
          event={event as CalendarEvent} 
          qrCodeUrl={event.qrCode || "https://api.example.com/qr/placeholder"} 
        />
      )}
    </div>
  );
};
