
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventDescriptionProps {
  description?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
  onInputChange,
}) => {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        name="description"
        value={description || ""}
        onChange={onInputChange}
        placeholder="Add details about this event"
        rows={3}
        className="mt-1"
      />
    </div>
  );
};
