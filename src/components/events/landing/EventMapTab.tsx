
import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaticMap } from "@/components/map/StaticMap";

interface EventMapTabProps {
  location: string;
  coordinates?: { lat: number; lng: number };
  onGetDirections: () => void;
}

export const EventMapTab: React.FC<EventMapTabProps> = ({ 
  location, 
  coordinates, 
  onGetDirections 
}) => {
  return (
    <div className="h-[400px] md:h-[500px]">
      {coordinates ? (
        <div className="h-full flex flex-col">
          <StaticMap 
            location={coordinates}
            address={location}
            height="85%"
          />
          <div className="mt-4 text-center">
            <p className="text-sm mb-2">{location}</p>
            <Button onClick={onGetDirections}>
              Get Directions
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No exact location available</p>
          <p className="text-sm text-muted-foreground mb-4">
            This event doesn't have exact coordinates set.
          </p>
          {location && (
            <Button onClick={onGetDirections}>
              Look up "{location}"
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
