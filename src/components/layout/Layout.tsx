
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { QRScannerProvider } from "@/providers/qr-scanner-provider";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <QRScannerProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className={`flex-1 overflow-auto ${isMobile ? 'pb-16' : ''}`}>
            <Outlet />
          </div>
        </div>
      </QRScannerProvider>
    </SidebarProvider>
  );
};

export default Layout;
