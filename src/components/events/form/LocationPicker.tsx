
import React from "react";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPicker } from "@/components/map/MapPicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationPickerProps {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  coordinates,
  onInputChange,
  onLocationSelect,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Accordion type="single" collapsible defaultValue="location">
        <AccordionItem value="location">
          <AccordionTrigger className="py-2">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="location">Address</Label>
                <Input
                  id="location"
                  name="location"
                  value={location}
                  onChange={onInputChange}
                  placeholder="Enter location"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Pin Location on Map</Label>
                <div className="mt-2 h-[250px] rounded-md overflow-hidden">
                  <MapPicker
                    initialLocation={coordinates || undefined}
                    onLocationSelect={onLocationSelect}
                    height="250px"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={location}
          onChange={onInputChange}
          placeholder="Enter location"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Pin Location on Map</Label>
        <div className="mt-2 h-[300px] rounded-md overflow-hidden">
          <MapPicker
            initialLocation={coordinates || undefined}
            onLocationSelect={onLocationSelect}
          />
        </div>
      </div>
    </>
  );
};
