"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WishlistDialog } from "./WishlistDialog";
import { createWishlistAction } from "./actions";

export default function CreateWishlistBtn() {
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
