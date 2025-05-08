import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { List } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ListChecks } from "lucide-react";
import ListMenuDropdown from "./ListMenuDropdown";
import { VISIBILITY } from "@/lib/constants";

interface ListCardProps {
  list: List & { _count: { wishes: number } };
}

export function ListCard({ list }: ListCardProps) {
  const wishesLength = list._count.wishes;

  return (
    <Card className="max-w-[350px]">
      <Link href={`/lists/${list.id}`}>
        <CardHeader className="hover:underline">
          <CardTitle className="text-md font-semibold truncate">
            {list.name}
          </CardTitle>

          <p className="text-sm text-gray-500 truncate">
            {list.description || "No description provided"}
          </p>
        </CardHeader>
      </Link>

      <CardContent className="-mt-2">
        <Badge variant="secondary">
          {list.visibility === VISIBILITY.PUBLIC ? (
            <>
              <Eye className="size-4" />
              <span>public</span>
            </>
          ) : (
            <>
              <EyeOff className="size-4" />
              <span>private</span>
            </>
          )}
        </Badge>
      </CardContent>

      <CardFooter className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ListChecks className="size-4 text-gray-400" />
          <span>
            {wishesLength} {"item" + (wishesLength === 1 ? "" : "s")}
          </span>
        </div>

        <ListMenuDropdown list={list} />
      </CardFooter>
    </Card>
  );
}
