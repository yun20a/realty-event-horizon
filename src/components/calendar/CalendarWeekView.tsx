
import React, { useMemo } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addHours,
  format,
  isSameDay,
  isWithinInterval,
  differenceInMinutes,
} from "date-fns";
import { CalendarEvent } from "@/types/events";
import { EventCard } from "../events/EventCard";
import { cn } from "@/lib/utils";

interface CalendarWeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  date,
  events,
  onEventClick,
}) => {
  // Generate days array for the week
  const days = useMemo(() => {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);

    return eachDayOfInterval({
      start: weekStart,
      end: weekEnd,
    });
  }, [date]);

  // Generate hours for the day (8 AM to 8 PM)
  const hours = useMemo(() => {
    const result = [];
    for (let i = 8; i <= 20; i++) {
      result.push(i);
    }
    return result;
  }, []);

  // Group events by date and filter to current week
  const eventsByDay = useMemo(() => {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    
    // Filter events to current week
    const weekEvents = events.filter(event => 
      isWithinInterval(event.start, { start: weekStart, end: weekEnd }) ||
      isWithinInterval(event.end, { start: weekStart, end: weekEnd })
    );
    
    const byDay: { [key: string]: CalendarEvent[] } = {};
    
    days.forEach(day => {
      const dayKey = format(day, "yyyy-MM-dd");
      byDay[dayKey] = weekEvents.filter(event => 
        isSameDay(event.start, day) || 
        isSameDay(event.end, day)
      );
    });
    
    return byDay;
  }, [events, days, date]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-[100px_1fr] h-full">
        {/* Time labels column */}
        <div className="border-r border-gray-200 dark:border-gray-700">
          <div className="h-16 border-b border-gray-200 dark:border-gray-700"></div>
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
        
        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
          {/* Header with day names */}
          <div className="col-span-7 grid grid-cols-7 h-16 divide-x divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className={cn(
                  "flex flex-col items-center justify-center",
                  isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <div className="text-sm font-medium">{format(day, "E")}</div>
                <div className={cn(
                  "text-2xl font-bold mt-1 h-8 w-8 flex items-center justify-center rounded-full",
                  isSameDay(day, new Date()) && "bg-primary text-white"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          
          {/* Time slots grid */}
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay[dateKey] || [];
            
            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "relative",
                  isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/10"
                )}
              >
                {/* Time slots */}
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="h-24 border-b border-gray-200 dark:border-gray-700"
                  ></div>
                ))}
                
                {/* Events */}
                {dayEvents.map((event) => {
                  // Calculate position and height based on event time
                  const dayStart = new Date(day);
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
                      className="absolute left-1 right-1 overflow-hidden rounded-md border"
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 24)}px`,
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className={cn(
                        "h-full w-full p-1",
                        event.type === "property" && "bg-green-100 border-green-200",
                        event.type === "client" && "bg-blue-100 border-blue-200",
                        event.type === "contract" && "bg-orange-100 border-orange-200",
                        event.type === "internal" && "bg-gray-100 border-gray-200",
                        event.type === "followup" && "bg-purple-100 border-purple-200",
                      )}>
                        <div className="truncate text-xs font-medium">
                          {event.title}
                        </div>
                        {height >= 48 && (
                          <div className="truncate text-xs mt-1">
                            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
