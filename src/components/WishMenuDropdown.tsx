"use client";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import DropdownMenuWrapper from "@/components/ui/DropdownMenuWrapper";
import { Wish } from "@prisma/client";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  deleteWishAction,
  editWishAction,
  toggleFulfilled,
} from "@/app/(dashboard)/lists/[id]/actions";
import { WishDialog } from "@/components/WishDialog";

export default function WishMenuDropdown({ wish }: { wish: Wish }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <DropdownMenuWrapper>
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Check size={16} />
              <span>{`${wish.fulfilled ? "Unm" : "M"}ark`} as fulfilled</span>
            </DropdownMenuItem>
          }
          description="Mark the wish as fulfilled. You can change this later."
          onConfirm={() =>
            toggleFulfilled({ state: wish.fulfilled, id: wish.id })
          }
        />

        <DropdownMenuItem onClick={() => setIsEditing((prev) => !prev)}>
          <Pencil />
          <span>Edit</span>
        </DropdownMenuItem>

        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="text-rose-500" size={16} />
              <span className="text-rose-500">Delete</span>
            </DropdownMenuItem>
          }
          description="This action cannot be undone. This will permanently delete your wish."
          confirmText="Delete"
          onConfirm={() => deleteWishAction(wish.id)}
        />
      </DropdownMenuWrapper>

      {isEditing && (
        <WishDialog
          wish={wish}
          onClose={() => setIsEditing(false)}
          listId={wish.listId}
          onSubmitAction={editWishAction}
        />
      )}
    </>
  );
}
