import { auth } from "@/auth";
import { ListCard } from "@/app/(dashboard)/ListCard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const lists = await prisma.list.findMany({
    where: { userId: session.user.id },
    include: { wishes: true },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to WishList App</h1>

      <p className="mb-4 text-2xl">Hi, {session.user?.name}!</p>

      <div className="container mx-auto flex">
        {lists.length === 0 ? (
          <p>No lists found</p>
        ) : (
          lists.map((list) => <ListCard key={list.id} list={list} />)
        )}
      </div>
    </div>
  );
}
