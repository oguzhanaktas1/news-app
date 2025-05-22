"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, BellOff } from "lucide-react";

export default function NotificationToggle() {
  const { toast } = useToast();

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      toast({
        title: "This browser does not support desktop notifications.",
        variant: "destructive",
      });
      setIsEnabled(false);
      return;
    }
    setIsEnabled(Notification.permission === "granted");
  }, [toast]);

  const handleEnable = async () => {
    if (Notification.permission === "granted") {
      toast({
        title: "Notifications are already enabled.",
      });
      setIsEnabled(true);
    } else {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast({
          title: "Notifications enabled.",
        });
        setIsEnabled(true);
      } else {
        toast({
          title: "Notification permission denied.",
          variant: "destructive",
        });
        setIsEnabled(false);
      }
    }
  };

  const handleDisable = () => {
    toast({
      title: "To disable notifications, please adjust your browser settings.",
      description: "This must be done manually in your browser's notification settings.",
    });
    setIsEnabled(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Notifications
          {isEnabled ? (
            <Bell className="w-5 h-5 text-blue-600" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={handleEnable} disabled={isEnabled}>
          Enable
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisable} disabled={!isEnabled}>
          Disable
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
