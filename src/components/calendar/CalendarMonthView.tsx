
import React, { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { CalendarEvent } from "@/types/events";
import { EventCard } from "../events/EventCard";
import { cn } from "@/lib/utils";

interface CalendarMonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  date,
  events,
  onEventClick,
  onDateClick,
}) => {
  // Generate days array for the calendar grid
  const days = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  }, [date]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const byDate: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach((event) => {
      const dateKey = format(event.start, "yyyy-MM-dd");
      if (!byDate[dateKey]) {
        byDate[dateKey] = [];
      }
      byDate[dateKey].push(event);
    });
    
    return byDate;
  }, [events]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      {/* Calendar header - weekdays */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 grid-rows-6 gap-px bg-gray-200 dark:bg-gray-700 h-full">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate[dateKey] || [];
          const maxVisibleEvents = 3;
          const hasMoreEvents = dayEvents.length > maxVisibleEvents;
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[100px] bg-white dark:bg-gray-800 p-1 overflow-hidden flex flex-col",
                !isSameMonth(day, date) && "bg-gray-50 dark:bg-gray-900/50 text-gray-400",
                isSameDay(day, new Date()) && "ring-2 ring-inset ring-primary/20"
              )}
              onClick={() => onDateClick && onDateClick(day)}
            >
              <div className="flex justify-between items-center p-1">
                <span
                  className={cn(
                    "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-white"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs px-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 mt-1 hide-scrollbar">
                {dayEvents.slice(0, maxVisibleEvents).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    compact={true}
                    onClick={() => onEventClick(event)}
                  />
                ))}
                
                {hasMoreEvents && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-1 mt-1">
                    + {dayEvents.length - maxVisibleEvents} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
