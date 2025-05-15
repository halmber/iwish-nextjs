"use client";

import { deleteAllNotifications } from "@/app/(dashboard)/actions";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";

export function DeleteAllButton() {
  const { toast } = useToast();

  const handleClick = useCallback(async () => {
    const { succes, error } = await deleteAllNotifications();

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
      className="w-full text-red-500 flex justify-start"
    >
      <TrashIcon />
      <span>Delete all</span>
    </Button>
  );
}
