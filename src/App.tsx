
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import EventList from "@/pages/EventList";
import EventLanding from "@/pages/EventLanding";
import EventCheckIn from "@/pages/EventCheckIn";
import NotFound from "@/pages/NotFound";
import EventStats from "./pages/EventStats";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { InstallPrompt } from "./components/pwa/InstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  // Register service worker update handler
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Handle service worker updates
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, ask the user if they want to reload
                if (window.confirm('New content is available. Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      });
    }
  }, []);

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
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="/event/:id" element={<EventLanding />} />
            <Route path="/event/:id/check-in" element={<EventCheckIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <InstallPrompt />
        </BrowserRouter>
        <Toaster richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
