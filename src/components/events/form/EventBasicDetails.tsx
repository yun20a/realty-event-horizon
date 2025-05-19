
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventType, EventStatus } from "@/types/events";

interface EventBasicDetailsProps {
  title: string;
  type: EventType;
  status: EventStatus;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const EventBasicDetails: React.FC<EventBasicDetailsProps> = ({
  title,
  type,
  status,
  onInputChange,
  onSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onInputChange}
          placeholder="Enter event title"
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Event Type</Label>
          <Select
            value={type}
            onValueChange={(value) => onSelectChange("type", value)}
          >
            <SelectTrigger id="type" className="mt-1">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property">Property Viewing</SelectItem>
              <SelectItem value="client">Client Meeting</SelectItem>
              <SelectItem value="contract">Contract Signing</SelectItem>
              <SelectItem value="internal">Internal Meeting</SelectItem>
              <SelectItem value="followup">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => onSelectChange("status", value)}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
