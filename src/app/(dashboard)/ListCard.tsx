import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { List, Wish } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface ListCardProps {
  list: List & { wishes: Wish[] };
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
        <CardDescription>{list.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Type: {list.type}</p>
        <p>Visibility: {list.visibility}</p>
        <p>Items: {list.wishes.length}</p>
        <Link href={`/list/${list.id}`}>
          <Button variant="link">View List</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
