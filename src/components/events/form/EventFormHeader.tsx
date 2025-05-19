
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/events";

interface EventFormHeaderProps {
  event?: CalendarEvent;
  onSave: (event: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}

export const EventFormHeader: React.FC<EventFormHeaderProps> = ({
  event,
  onCancel,
}) => {
  const isNewEvent = !event;
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isNewEvent ? "Create Event" : "Update Event"}
      </Button>
    </div>
  );
};
