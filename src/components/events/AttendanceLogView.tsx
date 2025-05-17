
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent, Participant } from "@/types/events";
import { format } from "date-fns";
import { MapPin, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AttendanceLogViewProps {
  event: CalendarEvent;
}

export const AttendanceLogView: React.FC<AttendanceLogViewProps> = ({ event }) => {
  // Get all checked-in participants
  const checkedInParticipants = event.participants.filter(p => p.checkInTime);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Attendance Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {checkedInParticipants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No attendance data available for this event yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkedInParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>
                    {participant.checkInTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{format(participant.checkInTime, "MMM d, h:mm a")}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {participant.checkInLocation ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {participant.checkInLocation.latitude.toFixed(6)}, 
                          {participant.checkInLocation.longitude.toFixed(6)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not available</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {participant.checkInStatus === 'success' || participant.checkInStatus === true ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Success
                      </Badge>
                    ) : participant.checkInStatus === 'failed' ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="h-3 w-3 mr-1" /> Failed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <AlertCircle className="h-3 w-3 mr-1" /> Unknown
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
