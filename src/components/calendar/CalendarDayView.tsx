
import React, { useMemo } from "react";
import {
  addHours,
  format,
  isWithinInterval,
  isSameDay,
  differenceInMinutes,
} from "date-fns";
import { CalendarEvent } from "@/types/events";
import { cn } from "@/lib/utils";

interface CalendarDayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  date,
  events,
  onEventClick,
}) => {
  // Generate hours for the day (8 AM to 8 PM)
  const hours = useMemo(() => {
    const result = [];
    for (let i = 8; i <= 20; i++) {
      result.push(i);
    }
    return result;
  }, []);

  // Filter events to current day
  const dayEvents = useMemo(() => {
    return events.filter(event => isSameDay(event.start, date));
  }, [events, date]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-[100px_1fr] h-full">
        {/* Time labels column */}
        <div className="border-r border-gray-200 dark:border-gray-700">
          {hours.map((hour) => (
            <div 
              key={hour} 
              className="h-24 border-b border-gray-200 dark:border-gray-700 pr-2 text-right"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
              </span>
            </div>
          ))}
        </div>
        
        {/* Day column */}
        <div className="relative">
          {/* Time slots */}
          {hours.map((hour) => (
            <div 
              key={hour} 
              className="h-24 border-b border-gray-200 dark:border-gray-700"
            ></div>
          ))}
          
          {/* Current time indicator */}
          {isSameDay(new Date(), date) && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
              style={{
                top: `${((new Date().getHours() - 8) * 60 + new Date().getMinutes()) / 60 * 96}px`
              }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 -mt-1.5 -ml-1.5"></div>
            </div>
          )}
          
          {/* Events */}
          {dayEvents.map((event) => {
            // Calculate position and height based on event time
            const dayStart = new Date(date);
            dayStart.setHours(8, 0, 0, 0); // 8 AM
            
            const startMinutes = differenceInMinutes(event.start, dayStart);
            const durationMinutes = differenceInMinutes(event.end, event.start);
            
            // Skip events outside our time range
            if (startMinutes < 0 || startMinutes > 60 * 12) {
              return null;
            }
            
            const top = (startMinutes / 60) * 96; // 96px per hour (24px * 4)
            const height = (durationMinutes / 60) * 96;
            
            return (
              <div
                key={event.id}
                className="absolute left-4 right-4 overflow-hidden rounded-md cursor-pointer hover:shadow-lg transition-shadow"
                style={{
                  top: `${top}px`,
                  height: `${Math.max(height, 32)}px`,
                }}
                onClick={() => onEventClick(event)}
              >
                <div className={cn(
                  "h-full w-full p-2",
                  event.type === "property" && "bg-green-100 border-l-4 border-l-green-500 dark:bg-green-900/30",
                  event.type === "client" && "bg-blue-100 border-l-4 border-l-blue-500 dark:bg-blue-900/30",
                  event.type === "contract" && "bg-orange-100 border-l-4 border-l-orange-500 dark:bg-orange-900/30",
                  event.type === "internal" && "bg-gray-100 border-l-4 border-l-gray-500 dark:bg-gray-900/30",
                  event.type === "followup" && "bg-purple-100 border-l-4 border-l-purple-500 dark:bg-purple-900/30",
                )}>
                  <div className="font-medium truncate">
                    {event.title}
                  </div>
                  {height >= 64 && (
                    <>
                      <div className="text-sm mt-1">
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </div>
                      {height >= 96 && event.location && (
                        <div className="text-sm mt-1 truncate text-gray-600 dark:text-gray-300">
                          {event.location}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
