import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import CreateWishBtn from "./CreateWishBtn";
import { WishCardWrapper } from "./WishCardWrapper";

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
    <div className="container p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
          <p className="mb-4">{list.description}</p>
        </div>

        <CreateWishBtn listId={list.id} />
      </div>

      <WishCardWrapper wishes={list.wishes} ownWish />
    </div>
  );
}
