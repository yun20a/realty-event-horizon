
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Phone, Mail } from "lucide-react";
import { CalendarEvent } from "@/types/events";
import { EventAttendanceForm } from "@/components/events/EventAttendanceForm";
import { StaticMap } from "@/components/map/StaticMap";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventDetailsTabProps {
  event: CalendarEvent;
  onGetDirections: () => void;
}

export const EventDetailsTab: React.FC<EventDetailsTabProps> = ({ event, onGetDirections }) => {
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const isMobile = useIsMobile();
  
  // Find the agent (first participant with role="agent")
  const agent = event.participants.find(p => p.role === "agent");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            <div className="font-medium">Date & Time</div>
            <div>{format(event.start, "EEEE, MMMM d, yyyy")}</div>
            <div>{format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            <div className="font-medium">Location</div>
            <div className="break-words">
              {event.location}
            </div>
            <Button 
              variant="link" 
              className="px-0 h-6 text-green-600 dark:text-green-400 text-sm" 
              onClick={onGetDirections}
            >
              Get directions
            </Button>
          </div>
        </div>

        {event.description && (
          <div>
            <h3 className="font-medium text-base md:text-lg mb-2">About</h3>
            <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              {event.description}
            </div>
          </div>
        )}

        {agent && (
          <div>
            <h3 className="font-medium text-base md:text-lg mb-2">Contact</h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                {agent.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-sm md:text-base">{agent.name}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{agent.email}</div>
                
                <div className="flex mt-2 space-x-2">
                  <Button variant="outline" size="sm" className="h-7 rounded-full px-3 text-xs">
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 rounded-full px-3 text-xs">
                    <Mail className="w-3 h-3 mr-1" /> Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isMobile && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Location</h3>
            {event.coordinates ? (
              <StaticMap 
                location={event.coordinates}
                address={event.location}
                height="200px"
              />
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 mr-2 text-gray-400" />
                <span className="text-gray-400">Location Map</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!showAttendanceForm ? (
        <div className="flex justify-center mt-6 md:mt-10 col-span-1 md:col-span-2">
          <Button onClick={() => setShowAttendanceForm(true)} className="w-full sm:w-auto">
            RSVP to this event <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mt-6 col-span-1 md:col-span-2">
          <h3 className="font-medium text-lg mb-4">Confirm Your Attendance</h3>
          <EventAttendanceForm 
            eventId={event.id} 
            onSuccess={() => setShowAttendanceForm(false)} 
          />
        </div>
      )}
    </div>
  );
};
