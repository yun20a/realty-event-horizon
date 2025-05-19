
import React from "react";
import { EventType } from "@/types/events";

interface EventFilterBadgeProps {
  activeFilter: EventType | 'all';
  onClearFilter: () => void;
}

export const EventFilterBadge: React.FC<EventFilterBadgeProps> = ({
  activeFilter,
  onClearFilter
}) => {
  if (activeFilter === 'all') return null;

  return (
    <div className="flex items-center">
      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
        Filtered by: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
        <button 
          className="ml-2 hover:bg-primary/20 p-1 rounded-full"
          onClick={onClearFilter}
        >
          ×
        </button>
      </div>
    </div>
  );
};
