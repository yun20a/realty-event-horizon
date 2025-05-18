
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, ListChecks, QrCode } from "lucide-react";
import { useQRScanner } from "@/providers/qr-scanner-provider";

const Index = () => {
  const navigate = useNavigate();
  const { openScanner } = useQRScanner();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Realty Event Horizon
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Manage your real estate events with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full sm:w-auto text-lg py-6 px-8"
            >
              Open Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => openScanner()}
              className="w-full sm:w-auto text-lg py-6 px-8"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Scan Event QR
            </Button>
          </div>
        </div>
        
        {/* Quick access cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4 mx-auto">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Calendar</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              View and manage your upcoming events.
            </p>
            <div className="text-center">
              <Button variant="ghost" onClick={() => navigate("/calendar")} className="w-full">
                Open Calendar
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-4 mx-auto">
              <ListChecks className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Events</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              Manage all your real estate events.
            </p>
            <div className="text-center">
              <Button variant="ghost" onClick={() => navigate("/events")} className="w-full">
                View Events
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-4 mx-auto">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">Check-In</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              Quickly check-in to events via QR code.
            </p>
            <div className="text-center">
              <Button variant="ghost" onClick={() => openScanner()} className="w-full">
                Scan QR Code
              </Button>
            </div>
          </div>
        </div>
        
        {/* PWA install promotion */}
        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
          <h3 className="text-xl font-medium text-blue-800 dark:text-blue-300 mb-2 text-center">Install as App</h3>
          <p className="text-blue-600 dark:text-blue-200 text-center mb-2">
            For the best experience, install this app on your mobile device.
          </p>
          <p className="text-sm text-blue-500 dark:text-blue-300 text-center">
            Look for "Add to Home Screen" in your browser menu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
