import { auth } from "@/auth";
import { SignOut } from "@/components/SignOutButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to WishList App</h1>

      <p className="mb-4 text-2xl">Welcome, {session.user?.name}!</p>

      <SignOut />
    </div>
  );
}
