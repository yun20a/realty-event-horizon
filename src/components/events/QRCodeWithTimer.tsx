
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Clock, QrCode, Download } from "lucide-react";
import { CalendarEvent } from "@/types/events";
import { format, isWithinInterval } from "date-fns";
import { toast } from "sonner";
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeWithTimerProps {
  event: CalendarEvent;
  checkInUrl: string;
}

export const QRCodeWithTimer: React.FC<QRCodeWithTimerProps> = ({ event, checkInUrl }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isQrActive, setIsQrActive] = useState<boolean>(false);
  
  // Determine the valid time window for check-in (default to 1 hour before and after event time)
  const validStartTime = new Date(event.start.getTime() - 60 * 60 * 1000); // 1 hour before
  const validEndTime = new Date(event.end.getTime() + 60 * 60 * 1000); // 1 hour after
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setIsQrActive(isWithinInterval(now, { start: validStartTime, end: validEndTime }));
    }, 60000);
    
    // Set initial status
    setIsQrActive(isWithinInterval(new Date(), { start: validStartTime, end: validEndTime }));
    
    return () => clearInterval(timer);
  }, [validStartTime, validEndTime]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check in to ${event.title}`,
          text: `Check in to the event: ${event.title}`,
          url: checkInUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(checkInUrl);
      toast.success("Check-in URL copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById('event-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${event.title}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
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
        <div className={`bg-white p-4 rounded-lg shadow-sm transition-all ${!isQrActive ? 'opacity-50' : ''}`}>
          {/* QR code with event URL and ID */}
          <div id="qr-wrapper" className="relative">
            <QRCodeCanvas 
              id="event-qr-code"
              value={checkInUrl}
              size={200}
              includeMargin={true}
              level="H"
            />
            {!isQrActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-sm">
                <p className="text-white font-medium px-2 py-1 bg-black/50 rounded text-sm">
                  QR Code not active
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <p className="text-sm font-medium flex items-center justify-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            QR code valid during:
          </p>
          <p className="text-sm">
            {format(validStartTime, "MMM d, h:mm a")} - {format(validEndTime, "h:mm a")}
          </p>
          {!isQrActive && (
            <p className="text-xs text-red-500 mt-1">
              QR code is only active during the specified time window
            </p>
          )}
        </div>
        
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
