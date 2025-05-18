
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Download, QrCode } from "lucide-react";
import { CalendarEvent } from "@/types/events";
import { toast } from "sonner";
import { QRCodeCanvas } from 'qrcode.react';

interface EventQRCodeProps {
  event: CalendarEvent;
  qrCodeUrl: string;
}

export const EventQRCode: React.FC<EventQRCodeProps> = ({ event, qrCodeUrl }) => {
  // Generate QR code URL from event data if not provided
  const effectiveQrUrl = qrCodeUrl || `${window.location.origin}/event/${event.id}/check-in`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check in to this event: ${event.title}`,
          url: effectiveQrUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(effectiveQrUrl);
      toast.success("QR code URL copied to clipboard!");
    }
  };
  
  const handleDownload = () => {
    const canvas = document.getElementById('event-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${event.title.replace(/\s/g, '-')}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR code downloaded!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Event QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Render actual QR code */}
          <QRCodeCanvas 
            id="event-qr-code"
            value={effectiveQrUrl}
            size={200}
            includeMargin={true}
            level="H"
          />
        </div>
        
        <p className="text-sm text-center text-muted-foreground">
          Scan this QR code to check in to the event
        </p>
        
        <div className="flex space-x-2 w-full">
          <Button className="flex-1 gap-2" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button className="flex-1 gap-2" onClick={handleShare}>
            <Share className="h-4 w-4" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
