
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/types/events";

interface PropertySelectorProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPropertyChange: (propertyId: string) => void;
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({
  properties,
  selectedPropertyId,
  onPropertyChange,
}) => {
  return (
    <div>
      <Label htmlFor="property">Property</Label>
      <Select
        value={selectedPropertyId || "none"}
        onValueChange={onPropertyChange}
      >
        <SelectTrigger id="property" className="mt-1">
          <SelectValue placeholder="Select property (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No property</SelectItem>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.address}, {property.city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
