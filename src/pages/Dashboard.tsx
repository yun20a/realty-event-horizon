
import React, { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent } from "@/types/events";
import { EventCard } from "@/components/events/EventCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import * as mockEventService from "@/services/mockEventService";

const Dashboard = () => {
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [eventTypeData, setEventTypeData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all events
        const events = await mockEventService.getAllEvents();
        
        // Calculate this week's events
        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);
        
        // Filter events for this week
        const thisWeekEvents = events.filter(event => 
          event.start >= weekStart && event.start <= weekEnd
        );
        
        setWeekEvents(thisWeekEvents);
        
        // Generate event type data for the pie chart
        const typeCounts: { [key: string]: number } = {};
        events.forEach(event => {
          if (!typeCounts[event.type]) {
            typeCounts[event.type] = 0;
          }
          typeCounts[event.type]++;
        });
        
        const typeData = [
          { name: "Property Viewing", value: typeCounts["property"] || 0, color: "#4ade80" },
          { name: "Client Meeting", value: typeCounts["client"] || 0, color: "#60a5fa" },
          { name: "Contract Signing", value: typeCounts["contract"] || 0, color: "#fb923c" },
          { name: "Internal Meeting", value: typeCounts["internal"] || 0, color: "#9ca3af" },
          { name: "Follow-up", value: typeCounts["followup"] || 0, color: "#c084fc" },
        ];
        
        setEventTypeData(typeData);
        
        // Get today's events
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        
        const eventsToday = events.filter(event => 
          event.start >= todayStart && event.start <= todayEnd
        );
        
        setTodayEvents(eventsToday);
        
        // Get upcoming events (next 7 days excluding today)
        const tomorrowStart = addDays(todayStart, 1);
        const weekLaterEnd = addDays(todayStart, 7);
        weekLaterEnd.setHours(23, 59, 59, 999);
        
        const nextEvents = events.filter(event => 
          event.start > todayEnd && event.start <= weekLaterEnd
        ).slice(0, 5); // Get top 5
        
        setUpcomingEvents(nextEvents);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    
    loadData();
  }, []);

  // Generate weekday labels for the week view
  const weekdays = [];
  const startDay = startOfWeek(new Date());
  for (let i = 0; i < 7; i++) {
    const day = addDays(startDay, i);
    weekdays.push({
      date: day,
      label: format(day, "EEE"),
      dayOfMonth: format(day, "d"),
    });
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>This Week's Overview</CardTitle>
            <CardDescription>
              {format(startOfWeek(new Date()), "MMM d")} - {format(endOfWeek(new Date()), "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekdays.map((day) => (
                <div key={day.label} className="text-center">
                  <div className="text-sm font-medium">{day.label}</div>
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${
                      format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day.dayOfMonth}
                  </div>
                  <div className="text-sm mt-1">
                    {weekEvents.filter(
                      event => format(event.start, "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd")
                    ).length} events
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="text-sm font-medium mb-3">Events by Type</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {eventTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Events Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events scheduled for today
              </div>
            ) : (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="bg-muted text-center p-1 rounded w-14">
                      <div className="text-xs text-muted-foreground">
                        {format(event.start, "h:mm a")}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-border mt-4 pt-4">
              <div className="font-medium mb-3">Upcoming Events</div>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming events in the next 7 days
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-3">
                      <div className="bg-muted text-center p-1 rounded w-14">
                        <div className="text-xs">
                          {format(event.start, "E")}
                        </div>
                        <div className="text-xs font-medium">
                          {format(event.start, "MMM d")}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">{format(event.start, "h:mm a")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Event Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {weekEvents.length}
            </div>
            <p className="text-muted-foreground text-sm">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Property Viewings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-event-property">
              {weekEvents.filter(e => e.type === "property").length}
            </div>
            <p className="text-muted-foreground text-sm">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Client Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-event-client">
              {weekEvents.filter(e => e.type === "client").length}
            </div>
            <p className="text-muted-foreground text-sm">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contract Signings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-event-contract">
              {weekEvents.filter(e => e.type === "contract").length}
            </div>
            <p className="text-muted-foreground text-sm">This week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
