
import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

// Default map options
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 34.052235,
  lng: -118.243683,
};

interface MapPickerProps {
  initialLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  apiKey?: string;
  readOnly?: boolean;
  height?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialLocation,
  onLocationSelect,
  apiKey,
  readOnly = false,
  height = "400px",
}) => {
  const isMobile = useIsMobile();
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(
    initialLocation || null
  );
  const [searchValue, setSearchValue] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapApiKey, setMapApiKey] = useState<string>(apiKey || "");

  // Handle the case where apiKey is not provided
  useEffect(() => {
    if (!apiKey && !mapApiKey) {
      // Check for stored API key in localStorage
      const storedKey = localStorage.getItem("googleMapsApiKey");
      if (storedKey) {
        setMapApiKey(storedKey);
      }
    }
  }, [apiKey, mapApiKey]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapApiKey,
    libraries: ["places"],
  });

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (readOnly) return;
      
      const clickedLocation = {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng(),
      };
      
      setMarker(clickedLocation);
      
      if (onLocationSelect) {
        onLocationSelect(clickedLocation);
      }
    },
    [onLocationSelect, readOnly]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const handleSearch = useCallback(() => {
    if (!map || !searchValue || !window.google) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchValue }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newLocation = {
          lat: location.lat(),
          lng: location.lng(),
        };
        
        setMarker(newLocation);
        map.setCenter(newLocation);
        map.setZoom(15);
        
        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
      } else {
        toast.error("Location not found. Please try a different search.");
      }
    });
  }, [map, searchValue, onLocationSelect]);

  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem("googleMapsApiKey", key);
    setMapApiKey(key);
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg h-full min-h-[200px]">
        <p className="text-red-500 mb-4">Error loading Google Maps</p>
        <div className="space-y-2 w-full max-w-sm">
          <Input
            type="text"
            placeholder="Enter Google Maps API Key"
            value={mapApiKey}
            onChange={(e) => setMapApiKey(e.target.value)}
            className="mb-2"
          />
          <Button onClick={() => saveApiKey(mapApiKey)} className="w-full">
            Save API Key
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg h-full min-h-[200px]">
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="flex mb-2">
          <Input
            type="text"
            placeholder="Search for an address"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            className="ml-2"
            type="button"
            variant="secondary"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div style={{ height: height }} className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={marker ? 15 : 10}
          center={marker || defaultCenter}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            gestureHandling: isMobile ? "cooperative" : "auto",
          }}
        >
          {marker && (
            <Marker
              position={marker}
              animation={google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      </div>
      {!readOnly && marker && (
        <div className="text-xs text-gray-500 mt-1">
          Coordinates: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};
