import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ListCard } from "./ListCard";

export default async function Lists() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const lists = await prisma.list.findMany({
    where: { userId: session.user.id },
    include: { wishes: true },
  });

  return (
    <div className="container p-8 flex">
      {lists.length === 0 ? (
        <p>No lists found</p>
      ) : (
        lists.map((list) => <ListCard key={list.id} list={list} />)
      )}
    </div>
  );
}
