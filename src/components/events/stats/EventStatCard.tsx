
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventType } from "@/types/events";

export interface StatCardProps {
  title: string;
  type?: EventType;
  count: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export const EventStatCard: React.FC<StatCardProps> = ({ 
  title, 
  type, 
  count, 
  color, 
  isActive, 
  onClick 
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>
          {count}
        </div>
      </CardContent>
    </Card>
  );
};
