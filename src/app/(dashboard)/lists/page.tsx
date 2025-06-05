import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ListCard } from "@/components/ListCard";
import { CreateWishlistBtn } from "@/components/CreateWishlistBtn";
import { CreateWishBtn } from "@/components/CreateWishBtn";

export default async function Lists() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const lists = await prisma.list.findMany({
    where: { userId: session.user.id },
    include: { wishes: false, _count: { select: { wishes: true } } },
  });

  return (
    <div className="container p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">My wishlists</h1>
        </div>
        <div className="flex gap-2">
          <CreateWishlistBtn />
          <CreateWishBtn />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.length === 0 ? (
          <p>No lists found</p>
        ) : (
          lists.map((list) => <ListCard key={list.id} list={list} />)
        )}
      </div>
    </div>
  );
}
