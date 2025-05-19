
import React from "react";
import { CalendarEvent } from "@/types/events";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { EventBadge } from "@/components/events/EventBadge";
import { toast } from "sonner";

interface EventHeaderProps {
  event: CalendarEvent;
  onWhatsAppShare: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ event, onWhatsAppShare }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join me at ${event.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  return (
    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4">
            {event.title}
          </CardTitle>
          <EventBadge type={event.type} className="bg-white/20" />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
            onClick={onWhatsAppShare}
          >
            <svg 
              viewBox="0 0 32 32" 
              className="w-4 h-4 mr-2"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.916 1.412 7.505 3.758 10.284l-2.454 7.317 7.519-2.407C11.618 33.024 13.744 34 16.004 34c8.817 0 15.996-7.176 15.996-16S24.821 0 16.004 0z" fill="currentColor" fillRule="nonzero"/>
              <path d="M25.314 22.515c-.393 1.12-2.316 2.045-3.789 2.315-1.008.186-2.324.335-6.75-1.451-5.668-2.289-9.334-7.909-9.617-8.273-.267-.364-2.25-2.995-2.25-5.71s1.4-4.04 1.884-4.602c.405-.472.881-.59 1.175-.59.284 0 .567 0 .815.015.262.015.612-.101.956.728.35.842 1.189 2.911 1.293 3.125.104.214.175.466.052.745-.123.279-.185.451-.37.69-.183.241-.389.536-.556.719-.185.203-.378.424-.163.833.215.41.957 1.752 2.056 2.838 1.411 1.392 2.597 1.821 2.967 2.024.37.203.58.167.798-.092.217-.262.936-1.09 1.188-1.464.25-.371.503-.309.845-.186.344.123 2.164 1.02 2.534 1.205.37.186.618.279.721.434.104.153.104.884-.29 1.737z" fill="#FFF"/>
            </svg>
            Share
          </Button>
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
      </div>
    </CardHeader>
  );
};
