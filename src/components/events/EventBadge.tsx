
import React from "react";
import { EventType } from "@/types/events";
import { cn } from "@/lib/utils";

interface EventBadgeProps {
  type: EventType;
  className?: string;
}

export const EventBadge: React.FC<EventBadgeProps> = ({ type, className }) => {
  const getEventTypeDetails = (type: EventType) => {
    switch (type) {
      case "property":
        return { label: "Property Viewing", bgColor: "bg-event-property", textColor: "text-event-property" };
      case "client":
        return { label: "Client Meeting", bgColor: "bg-event-client", textColor: "text-event-client" };
      case "contract":
        return { label: "Contract Signing", bgColor: "bg-event-contract", textColor: "text-event-contract" };
      case "internal":
        return { label: "Internal Meeting", bgColor: "bg-event-internal", textColor: "text-event-internal" };
      case "followup":
        return { label: "Follow-up", bgColor: "bg-event-followup", textColor: "text-event-followup" };
      default:
        return { label: "Event", bgColor: "bg-gray-300", textColor: "text-gray-700" };
    }
  };

  const { label, bgColor, textColor } = getEventTypeDetails(type);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        bgColor,
        className
      )}
    >
      {label}
    </span>
  );
};

export const EventStatusBadge: React.FC<{ status: string; className?: string }> = ({ 
  status, 
  className 
}) => {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          label: "Scheduled",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
      case "completed":
        return {
          label: "Completed",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      case "pending":
        return {
          label: "Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      default:
        return {
          label: status,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  const { label, bgColor, textColor } = getStatusDetails(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        bgColor,
        textColor,
        className
      )}
    >
      {label}
    </span>
  );
};
