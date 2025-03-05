"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wish } from "@prisma/client";
import DesireLevel from "./DesireLevel";
import { Link } from "lucide-react";
import { EditWishDialog } from "./EditWishDialog";

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
                <Link className="size-4" />
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
          <Button variant="destructive">Delete</Button>
        </div>
      </CardContent>

      {isEditing && (
        <EditWishDialog
          wish={wish}
          listId={listId}
          onClose={() => setIsEditing(false)}
        />
      )}
    </Card>
  );
}
