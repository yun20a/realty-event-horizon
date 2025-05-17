
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  date: Date;
  view: "month" | "week" | "day";
  onDateChange: (date: Date) => void;
  onViewChange: (view: "month" | "week" | "day") => void;
  onAddEvent: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  view,
  onDateChange,
  onViewChange,
  onAddEvent,
}) => {
  const handlePrevious = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(date.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setDate(date.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(date.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 px-1 py-2">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handlePrevious}
        >
          &lt;
        </Button>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 opacity-50" />
          <h2 className="text-xl font-medium">
            {view === "day" 
              ? format(date, "MMMM d, yyyy")
              : view === "week"
                ? `${format(date, "MMM d")} - ${format(
                    new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000),
                    "MMM d, yyyy"
                  )}`
                : format(date, "MMMM yyyy")}
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNext}
        >
          &gt;
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToday}
          >
            Today
          </Button>
          
          <Select
            value={view}
            onValueChange={(value) => onViewChange(value as "month" | "week" | "day")}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onAddEvent} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>
    </div>
  );
};
