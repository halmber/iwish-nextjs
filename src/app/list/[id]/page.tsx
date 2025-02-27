import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WishCard } from "@/components/WishCard";
import { auth } from "@/auth";

export default async function ListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect("/");

  const list = await prisma.list.findUnique({
    where: { id },
    include: { wishes: true },
  });

  if (!list || list.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
      <p className="mb-4">{list.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} listId={list.id} />
        ))}
      </div>
    </div>
  );
}
