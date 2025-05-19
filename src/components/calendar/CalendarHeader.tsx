
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 p-2 sm:p-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handlePrevious}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <CalendarIcon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} opacity-50`} />
          <h2 className={`${isMobile ? 'text-base' : 'text-xl'} font-medium`}>
            {view === "day" 
              ? format(date, "MMM d, yyyy")
              : view === "week"
                ? `${format(date, "MMM d")} - ${format(
                    new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000),
                    "MMM d, yyyy"
                  )}`
                : format(date, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNext}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToday}
            className="text-xs sm:text-sm"
          >
            Today
          </Button>
          
          <Select
            value={view}
            onValueChange={(value) => onViewChange(value as "month" | "week" | "day")}
          >
            <SelectTrigger className={`${isMobile ? 'w-[90px] text-xs' : 'w-[110px]'}`}>
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onAddEvent} size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> {isMobile ? 'Add' : 'Add Event'}
        </Button>
      </div>
    </div>
  );
};
