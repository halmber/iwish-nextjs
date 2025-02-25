"use client";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <Button type="submit" className="w-full">
        Sign out
      </Button>
    </form>
  );
}
