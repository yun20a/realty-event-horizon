
import React from "react";
import { format } from "date-fns";
import { EventBadge, EventStatusBadge } from "./EventBadge";
import { CalendarEvent } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onClick, 
  className,
  compact = false
}) => {
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case "property":
        return "border-l-event-property";
      case "client":
        return "border-l-event-client";
      case "contract":
        return "border-l-event-contract";
      case "internal":
        return "border-l-event-internal";
      case "followup":
        return "border-l-event-followup";
      default:
        return "border-l-gray-300";
    }
  };

  if (compact) {
    return (
      <Card 
        className={cn(
          "border-l-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5",
          getEventTypeColor(event.type),
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="text-sm font-medium truncate">{event.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {format(event.start, "h:mm a")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "border-l-4 cursor-pointer hover:shadow-md transition-all",
        getEventTypeColor(event.type),
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{event.title}</h3>
          <EventStatusBadge status={event.status} />
        </div>
        
        <div className="mb-2">
          <EventBadge type={event.type} />
        </div>
        
        <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
          <div>
            {format(event.start, "MMM d, yyyy • h:mm a")} - {format(event.end, "h:mm a")}
          </div>
          <div className="truncate">{event.location}</div>
          <div>{event.participants.length} participants</div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex -space-x-2">
            {event.participants.slice(0, 3).map((participant) => (
              <div 
                key={participant.id}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border-2 border-background text-xs font-medium"
                title={participant.name}
              >
                {participant.name.charAt(0)}
              </div>
            ))}
            {event.participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border-2 border-background text-xs font-medium">
                +{event.participants.length - 3}
              </div>
            )}
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <QrCode className="h-3 w-3" />
            <span>QR</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
