
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventHeader } from "./EventHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarEvent } from "@/types/events";
import { Users } from "lucide-react";
import { EventDetailsTab } from "./EventDetailsTab";
import { EventMapTab } from "./EventMapTab";
import { QRCodeWithTimer } from "@/components/events/QRCodeWithTimer";
import { AttendanceLogView } from "@/components/events/AttendanceLogView";
import { EventMobileNav } from "./EventMobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventLandingContainerProps {
  event: CalendarEvent;
  checkInUrl: string;
}

export const EventLandingContainer: React.FC<EventLandingContainerProps> = ({ 
  event, 
  checkInUrl 
}) => {
  const [activeTab, setActiveTab] = React.useState("details");
  const isMobile = useIsMobile();
  
  const handleGetDirections = () => {
    if (event.coordinates) {
      const { lat, lng } = event.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    } else {
      // Try to open map with the location text
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, "_blank");
    }
  };
  
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Join me at ${event.title} on ${format(event.start, "EEEE, MMMM d")} at ${format(event.start, "h:mm a")}. Location: ${event.location}`
    );
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <EventHeader event={event} onWhatsAppShare={handleWhatsAppShare} />
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
                  <EventDetailsTab 
                    event={event}
                    onGetDirections={handleGetDirections}
                  />
                </TabsContent>
                
                <TabsContent value="map">
                  <EventMapTab 
                    location={event.location}
                    coordinates={event.coordinates}
                    onGetDirections={handleGetDirections}
                  />
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
            <EventMobileNav 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper import at the end to avoid circular dependencies
import { format } from "date-fns";
