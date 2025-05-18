
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CalendarEvent } from "@/types/events";
import { EventBadge, EventStatusBadge } from "./EventBadge";
import { Edit, MapPin, Trash2, Calendar, Users, QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceLogView } from "./AttendanceLogView";
import { QRCodeCanvas } from "qrcode.react";
import { useIsMobile } from "@/hooks/use-mobile";
import { StaticMap } from "../map/StaticMap";

interface EventDetailsProps {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewQrCode: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onViewQrCode,
}) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const isMobile = useIsMobile();
  
  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  const viewDirections = () => {
    if (event.coordinates) {
      const { lat, lng } = event.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    } else {
      // Try to open map with the location text
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[600px] p-0 ${isMobile ? 'h-[90vh]' : ''} overflow-hidden`}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 mt-2">
            <EventBadge type={event.type} />
            <EventStatusBadge status={event.status} />
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="px-6 pt-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ScrollArea className={`${isMobile ? 'h-[calc(90vh-180px)]' : 'max-h-[60vh]'} px-6`}>
              <div className="py-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{formatDate(event.start)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    <Button 
                      variant="link" 
                      className="px-0 h-6 text-sm" 
                      onClick={viewDirections}
                    >
                      Get directions
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      {event.participants.map((participant) => (
                        <li key={participant.id} className="flex items-center justify-between">
                          <span>{participant.name}</span>
                          {participant.checkInStatus !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              participant.checkInStatus
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {participant.checkInStatus ? "Checked In" : "Not Checked In"}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {event.description && (
                  <div className="mt-4">
                    <p className="font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                )}
                
                <div>
                  <p className="font-medium mb-1">Reminders</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`text-xs px-2 py-1 rounded-full text-center ${
                      event.reminders.email
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      Email {event.reminders.email ? "On" : "Off"}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full text-center ${
                      event.reminders.sms
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      SMS {event.reminders.sms ? "On" : "Off"}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full text-center ${
                      event.reminders.push
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      Push {event.reminders.push ? "On" : "Off"}
                    </div>
                  </div>
                </div>
                
                {event.property && (
                  <div className="mt-4">
                    <p className="font-medium mb-1">Property Details</p>
                    <div className="text-sm text-muted-foreground">
                      <p>{event.property.address}</p>
                      <p>{event.property.city}, {event.property.state} {event.property.zipCode}</p>
                      {event.property.price && (
                        <p className="font-medium mt-1">
                          ${event.property.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="location">
            <div className={`${isMobile ? 'h-[calc(90vh-180px)]' : 'h-[60vh]'} overflow-hidden p-4`}>
              {event.coordinates ? (
                <div className="h-full flex flex-col">
                  <StaticMap 
                    location={event.coordinates}
                    address={event.location}
                    height="80%"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-sm mb-2">{event.location}</p>
                    <Button onClick={viewDirections}>
                      Get Directions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No exact location available</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    This event doesn't have exact coordinates set.
                  </p>
                  {event.location && (
                    <Button onClick={viewDirections}>
                      Look up "{event.location}"
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className={`${isMobile ? 'h-[calc(90vh-180px)]' : 'h-[60vh]'} overflow-auto px-6 py-4`}>
            <AttendanceLogView event={event} />
          </TabsContent>
          
          <TabsContent value="qrcode" className={`${isMobile ? 'h-[calc(90vh-180px)]' : 'h-[60vh]'} overflow-auto px-6 py-4`}>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm mb-4">
                {event.qrCode && (
                  <QRCodeCanvas 
                    value={event.qrCode}
                    size={250}
                    includeMargin={true}
                    level="H"
                  />
                )}
              </div>
              
              <div className="text-center max-w-xs">
                <h3 className="text-lg font-medium mb-2">Event Check-in QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Participants can scan this QR code to check in to the event. The check-in will record their name, time, and location.
                </p>
                <Button onClick={onViewQrCode}>View Full QR Code</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-6 py-4 flex flex-wrap justify-between gap-2 bg-muted/20">
          <Button variant="outline" size="sm" onClick={onDelete} className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onViewQrCode} className="gap-2">
              <QrCode className="h-4 w-4" /> QR Code
            </Button>
            <Button size="sm" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
