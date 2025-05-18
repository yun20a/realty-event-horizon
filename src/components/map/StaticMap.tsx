
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaticMapProps {
  location: { lat: number; lng: number };
  address?: string;
  zoom?: number;
  width?: string | number;
  height?: string | number;
  apiKey?: string;
}

export const StaticMap: React.FC<StaticMapProps> = ({
  location,
  address,
  zoom = 15,
  width = "100%",
  height = "200px",
  apiKey,
}) => {
  const [mapApiKey, setMapApiKey] = useState<string>(apiKey || "");
  
  // Check for stored API key
  useEffect(() => {
    if (!apiKey) {
      const storedKey = localStorage.getItem("googleMapsApiKey");
      if (storedKey) {
        setMapApiKey(storedKey);
      }
    }
  }, [apiKey]);

  const getMapImageUrl = () => {
    if (!mapApiKey) return "";
    
    const { lat, lng } = location;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x400&markers=color:red%7C${lat},${lng}&key=${mapApiKey}`;
  };

  const getDirectionsUrl = () => {
    const { lat, lng } = location;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  // If no API key is available, show a placeholder
  if (!mapApiKey) {
    return (
      <div
        style={{ width, height }}
        className="bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center"
      >
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {address || "Location map preview"}
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => window.open(getDirectionsUrl(), "_blank")}
        >
          View Directions
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <img
        src={getMapImageUrl()}
        alt={address || "Event location"}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute bottom-2 right-2">
        <Button
          size="sm"
          className="bg-white/80 text-black hover:bg-white backdrop-blur-sm"
          onClick={() => window.open(getDirectionsUrl(), "_blank")}
        >
          View Directions
        </Button>
      </div>
    </div>
  );
};
