"use client";

import { markAllNotificationsAsRead } from "@/app/(dashboard)/actions";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { CheckIcon } from "lucide-react";

export function MarkAllReadButton() {
  const { toast } = useToast();

  const handleClick = useCallback(async () => {
    const { succes, error } = await markAllNotificationsAsRead();

    if (!succes || error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, []);

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="w-full flex justify-start"
    >
      <CheckIcon />
      <span>Mark all as read</span>
    </Button>
  );
}
