
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: "Event List",
      path: "/events",
      icon: <ListTodo className="w-5 h-5" />,
    },
  ];
  
  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-border transition-all",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="p-4 flex justify-between items-center border-b border-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && <span className="font-bold text-xl">Real Estate CRM</span>}
          {collapsed && <span className="font-bold text-xl">RE</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1",
                  collapsed ? "justify-center px-2" : "px-3"
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-2">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            U
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium">User Name</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
