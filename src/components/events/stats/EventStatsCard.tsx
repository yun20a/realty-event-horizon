
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent } from "@/types/events";

interface EventStatsCardProps {
  event: CalendarEvent;
  onViewPage: (eventId: string) => void;
  onShare: (event: CalendarEvent) => void;
  onQrCodeClick: (event: CalendarEvent) => void;
}

export const EventStatsCard: React.FC<EventStatsCardProps> = ({
  event,
  onViewPage,
  onShare,
  onQrCodeClick
}) => {
  return (
    <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg truncate">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            </div>
            <div>
              <div className="font-medium">{new Date(event.start).toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
          
          {/* Agent */}
          {event.participants.find(p => p.role === 'agent') && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                {event.participants.find(p => p.role === 'agent')?.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{event.participants.find(p => p.role === 'agent')?.name}</div>
                <div className="text-sm text-muted-foreground">{event.participants.find(p => p.role === 'agent')?.email}</div>
              </div>
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="truncate">
              <div className="font-medium">Location</div>
              <div className="text-sm text-muted-foreground truncate max-w-[230px]">{event.location}</div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-2">
            <button 
              className="text-sm flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
              onClick={() => onShare(event)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" x2="12" y1="2" y2="15"></line>
              </svg>
              Share
            </button>
            
            <button 
              className="text-sm flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              onClick={() => onViewPage(event.id)}
            >
              View Page
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" x2="21" y1="14" y2="3"></line>
              </svg>
            </button>
            
            <button 
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onQrCodeClick(event)}
            >
              QR Code
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                <path d="M21 21v.01"></path>
                <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                <path d="M3 12h.01"></path>
                <path d="M12 3h.01"></path>
                <path d="M12 16v.01"></path>
                <path d="M16 12h1"></path>
                <path d="M21 12v.01"></path>
                <path d="M12 21v-1"></path>
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
