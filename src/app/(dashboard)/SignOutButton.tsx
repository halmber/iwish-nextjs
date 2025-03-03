"use client";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/(dashboard)/actions";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <Button type="submit" className="w-full">
        Sign out
      </Button>
    </form>
  );
}
