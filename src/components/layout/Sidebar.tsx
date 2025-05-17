
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  ListChecks,
  Settings,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarContext } from "@/providers/sidebar-provider";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setOpen } = useSidebarContext();

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

  return (
    <div className="flex h-full max-w-xs flex-col border-r bg-background/50 backdrop-blur-sm">
      <ScrollArea className="flex-1 space-y-4 p-4">
        <div className="pt-4">
          <h3 className="px-4 text-lg font-semibold">Event Manager</h3>
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
        </div>
      </ScrollArea>
    </div>
  );
}
