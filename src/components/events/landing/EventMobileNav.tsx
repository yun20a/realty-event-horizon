
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, QrCode, Users } from "lucide-react";

interface EventMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const EventMobileNav: React.FC<EventMobileNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 z-50">
      <div className="flex justify-around">
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center px-4 py-2 ${activeTab === 'details' ? 'text-blue-600' : 'text-gray-500'}`} 
          onClick={() => onTabChange('details')}
        >
          <Calendar className="h-5 w-5 mb-1" />
          <span className="text-xs">Details</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center px-4 py-2 ${activeTab === 'map' ? 'text-blue-600' : 'text-gray-500'}`} 
          onClick={() => onTabChange('map')}
        >
          <MapPin className="h-5 w-5 mb-1" />
          <span className="text-xs">Map</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center px-4 py-2 ${activeTab === 'qr-code' ? 'text-blue-600' : 'text-gray-500'}`} 
          onClick={() => onTabChange('qr-code')}
        >
          <QrCode className="h-5 w-5 mb-1" />
          <span className="text-xs">QR Code</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex flex-col items-center px-4 py-2 ${activeTab === 'attendance' ? 'text-blue-600' : 'text-gray-500'}`} 
          onClick={() => onTabChange('attendance')}
        >
          <Users className="h-5 w-5 mb-1" />
          <span className="text-xs">Guests</span>
        </Button>
      </div>
    </div>
  );
};
