
import React from "react";
import { EventStatCard, StatCardProps } from "./EventStatCard";
import { EventType } from "@/types/events";

interface EventStatCardGridProps {
  statCards: Omit<StatCardProps, 'isActive' | 'onClick'>[];
  activeFilter: EventType | 'all';
  onFilterChange: (type?: EventType) => void;
}

export const EventStatCardGrid: React.FC<EventStatCardGridProps> = ({
  statCards,
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <EventStatCard 
          key={stat.title} 
          {...stat}
          isActive={activeFilter === (stat.type || 'all')}
          onClick={() => onFilterChange(stat.type)}
        />
      ))}
    </div>
  );
};
