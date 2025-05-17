import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  ListChecks,
  Settings,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMobile } from "@/hooks/use-mobile";
import { useSidebarContext } from "@/providers/sidebar-provider";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();
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
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="flex h-full max-w-xs flex-col border-r bg-background/50 backdrop-blur-sm">
      <ScrollArea className="flex-1 space-y-4 p-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 text-center">
            <h4 className="text-sm font-medium leading-none">shadcn</h4>
            <p className="text-xs text-muted-foreground">UI Engineer</p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col space-y-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
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
        <Separator />
        <div className="flex flex-col space-y-1">
          <Button variant="ghost" className="justify-start px-4">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Button>
          <Button variant="ghost" className="justify-start px-4">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
