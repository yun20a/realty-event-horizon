import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import EventList from "@/pages/EventList";
import EventLanding from "@/pages/EventLanding";
import NotFound from "@/pages/NotFound";

// Import the EventStats component
import EventStats from "./pages/EventStats";

const queryClient = new QueryClient();

// Update the Routes to include EventStats
const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="events" element={<EventList />} />
              <Route path="event-stats" element={<EventStats />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="/event/:id" element={<EventLanding />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
