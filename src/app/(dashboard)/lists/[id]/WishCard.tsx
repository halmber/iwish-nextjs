"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wish } from "@prisma/client";
import DesireLevel from "./DesireLevel";
import { ExternalLink } from "lucide-react";
import { WishDialog } from "../WishDialog";
import { deleteWishAction, editWishAction } from "./actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WishCardProps {
  wish: Wish;
  listId: string;
}

export function WishCard({ wish, listId }: WishCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-4">
            {wish.title}
            {wish.url && (
              <a
                href={wish.url || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
          <span className="text-neutral-500">
            {wish.price} {wish.currency}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <DesireLevel desireLvl={wish.desireLvl} />
        <p className="line-clamp-2 min-h-[2lh] text-sm">
          {wish.description || "No description provided"}
        </p>

        <p className="text-sm text-end min-h-[1lh]">
          {wish.desiredGiftDate &&
            new Date(wish.desiredGiftDate).toLocaleDateString("uk-UA")}
        </p>

        <div className="flex gap-4">
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your wish.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteWishAction(wish.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>

      {isEditing && (
        <WishDialog
          wish={wish}
          onClose={() => setIsEditing(false)}
          listId={listId}
          onSubmitAction={editWishAction}
        />
      )}
    </Card>
  );
}
