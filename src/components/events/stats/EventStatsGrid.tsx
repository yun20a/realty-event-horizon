
import React from "react";
import { CalendarEvent } from "@/types/events";
import { EventStatsCard } from "./EventStatsCard";

interface EventStatsGridProps {
  events: CalendarEvent[];
  onViewPage: (eventId: string) => void;
  onShare: (event: CalendarEvent) => void;
  onQrCodeClick: (event: CalendarEvent) => void;
}

export const EventStatsGrid: React.FC<EventStatsGridProps> = ({
  events,
  onViewPage,
  onShare,
  onQrCodeClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventStatsCard
          key={event.id}
          event={event}
          onViewPage={onViewPage}
          onShare={onShare}
          onQrCodeClick={onQrCodeClick}
        />
      ))}
    </div>
  );
};
