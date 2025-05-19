
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EventRemindersProps {
  reminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  onReminderChange: (type: "email" | "sms" | "push", checked: boolean) => void;
}

export const EventReminders: React.FC<EventRemindersProps> = ({
  reminders,
  onReminderChange,
}) => {
  return (
    <div>
      <Label>Reminders</Label>
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Email Reminder</span>
          <Switch
            checked={reminders.email}
            onCheckedChange={(checked) => onReminderChange("email", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">SMS Reminder</span>
          <Switch
            checked={reminders.sms}
            onCheckedChange={(checked) => onReminderChange("sms", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Push Notification</span>
          <Switch
            checked={reminders.push}
            onCheckedChange={(checked) => onReminderChange("push", checked)}
          />
        </div>
      </div>
    </div>
  );
};
