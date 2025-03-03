import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to WishList App</h1>

      <p className="mb-4 text-2xl">Hi, {session.user?.name}!</p>
    </div>
  );
}
