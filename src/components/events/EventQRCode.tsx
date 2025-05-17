
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { CalendarEvent } from "@/types/events";

interface EventQRCodeProps {
  event: CalendarEvent;
  qrCodeUrl: string;
}

export const EventQRCode: React.FC<EventQRCodeProps> = ({ event, qrCodeUrl }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: `https://example.com/events/landing/${event.id}`, // This would be your actual event landing page URL
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Event QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Placeholder for the QR code image */}
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
            {/* In a real implementation, you'd render an actual QR code here */}
            <div className="text-center text-gray-400">QR Code Preview</div>
          </div>
        </div>
        
        <p className="text-sm text-center text-muted-foreground">
          Scan this QR code to check in to the event
        </p>
        
        <div className="flex space-x-2 w-full">
          <Button className="flex-1" variant="outline">Download</Button>
          <Button className="flex-1 gap-2" onClick={handleShare}>
            <Share className="h-4 w-4" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
