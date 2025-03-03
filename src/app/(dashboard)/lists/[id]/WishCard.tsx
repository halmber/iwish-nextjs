"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wish } from "@prisma/client";

interface WishCardProps {
  wish: Wish;
  listId: string;
}

export function WishCard({ wish, listId }: WishCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{wish.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Desire Level: {wish.desireLvl}</p>
        <p>
          Price: {wish.price} {wish.currency}
        </p>
        <p>
          URL:{" "}
          <a href={wish.url || ""} target="_blank" rel="noopener noreferrer">
            {wish.url}
          </a>
        </p>
        <p>Description: {wish.description}</p>
        <p>Desired Gift Date: {wish.desiredGiftDate}</p>
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </CardContent>
      {/* {isEditing && <EditWishDialog wish={wish} listId={listId} onClose={() => setIsEditing(false)} />} */}
    </Card>
  );
}
