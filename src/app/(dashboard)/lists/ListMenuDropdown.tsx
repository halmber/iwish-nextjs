"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pencil, Trash2 } from "lucide-react";
import { deleteListAction, editWishlistAction } from "./actions";
import { useState } from "react";
import { WishlistDialog } from "./WishlistDialog";
import { List } from "@prisma/client";
import DropdownMenuWrapper from "@/components/ui/DropdownMenuWrapper";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function ListMenuDropdown({ list }: { list: List }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenuWrapper>
        <DropdownMenuItem onClick={() => setIsDialogOpen((prev) => !prev)}>
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
          description="This action cannot be undone. This will permanently delete your wishlist."
          confirmText="Delete"
          onConfirm={() => deleteListAction(list.id)}
        />
      </DropdownMenuWrapper>

      {isDialogOpen && (
        <WishlistDialog
          wishlist={list}
          onClose={() => setIsDialogOpen(false)}
          onSubmitAction={editWishlistAction}
        />
      )}
    </>
  );
}
