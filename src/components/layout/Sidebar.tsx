
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  ListChecks,
  Settings,
  User,
  ScanLine,
  Menu,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarContext } from "@/providers/sidebar-provider";
import { useQRScanner } from "@/providers/qr-scanner-provider";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebarContext();
  const { openScanner } = useQRScanner();

  // Navigation links
  const navLinks = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: Calendar,
    },
    {
      title: "Events",
      href: "/events",
      icon: ListChecks,
    },
    {
      title: "Event Stats",
      href: "/event-stats",
      icon: BarChart3,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleOpenScanner = () => {
    openScanner();
    if (isMobile) {
      setOpen(false);
    }
  };

  if (isMobile && !open) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      <div 
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'relative'}
          ${isMobile && !open ? '-translate-x-full' : 'translate-x-0'}
          flex h-full max-w-xs flex-col border-r bg-background/50 backdrop-blur-sm`}
      >
        <ScrollArea className="flex-1 space-y-4 p-4">
          <div className="pt-4 flex justify-between items-center">
            <h3 className="px-4 text-lg font-semibold">Event Manager</h3>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            )}
          </div>
          <Separator />
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant={isActive(link.href) ? "default" : "ghost"}
                className="justify-start px-4"
                onClick={() => {
                  navigate(link.href);
                  if (isMobile) {
                    setOpen(false);
                  }
                }}
              >
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.title}</span>
              </Button>
            ))}

            {/* QR Scanner Button */}
            <Button
              variant="outline"
              className="justify-start px-4 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
              onClick={handleOpenScanner}
            >
              <ScanLine className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Scan QR Code</span>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
