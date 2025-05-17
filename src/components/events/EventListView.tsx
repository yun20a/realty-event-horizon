
import React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/events";
import { Card, CardContent } from "@/components/ui/card";
import { EventBadge, EventStatusBadge } from "./EventBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, QrCode } from "lucide-react";

interface EventListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onQrCodeClick: (event: CalendarEvent) => void;
}

export const EventListView: React.FC<EventListViewProps> = ({
  events,
  onEventClick,
  onQrCodeClick
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Date & Time</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No events found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[200px] truncate">{event.title}</div>
                  </TableCell>
                  <TableCell>
                    <EventBadge type={event.type} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{format(event.start, "MMM d, yyyy")}</div>
                    <div className="text-muted-foreground text-xs">
                      {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-[200px] truncate">{event.location}</div>
                  </TableCell>
                  <TableCell>
                    <EventStatusBadge status={event.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
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
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onQrCodeClick(event)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEventClick(event)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
