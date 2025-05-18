
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { QRScannerProvider } from "@/providers/qr-scanner-provider";

export const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <QRScannerProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </QRScannerProvider>
    </SidebarProvider>
  );
};

export default Layout;
