"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WishDialog } from "@/components/WishDialog";
import { createWishAction } from "@/app/(dashboard)/lists/[id]/actions";

export function CreateWishBtn({ listId }: { listId?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        New wish
      </Button>

      {open && (
        <WishDialog
          wish={null}
          listId={listId}
          onClose={() => setOpen((prev) => !prev)}
          onSubmitAction={createWishAction}
        />
      )}
    </>
  );
}
