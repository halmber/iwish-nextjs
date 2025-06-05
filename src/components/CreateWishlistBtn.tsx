"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WishlistDialog } from "@/components/WishlistDialog";
import { createWishlistAction } from "@/app/(dashboard)/lists/actions";

export function CreateWishlistBtn() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        New wishlist
      </Button>

      {open && (
        <WishlistDialog
          wishlist={null}
          onClose={() => setOpen((prev) => !prev)}
          onSubmitAction={createWishlistAction}
        />
      )}
    </>
  );
}
