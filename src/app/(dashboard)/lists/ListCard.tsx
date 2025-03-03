import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { List, Wish } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ListChecks } from "lucide-react";
import ListMenuDropdown from "./ListMenuDropdown";

interface ListCardProps {
  list: List & { wishes: Wish[] };
}

export function ListCard({ list }: ListCardProps) {
  const wishesLength = list.wishes.length;

  return (
    <Link href={`/lists/${list.id}`}>
      <Card className="px-4 shadow-sm dark:shadow-slate-800 transition hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold truncate">
            {list.name}
          </CardTitle>

          <p className="text-sm text-gray-500 truncate">
            {list.description || "No description provided"}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center gap-1">
              {list.visibility === "public" ? (
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ListChecks className="size-4 text-gray-400" />
              <span>
                {wishesLength} {"item" + (wishesLength === 1 ? "" : "s")}
              </span>
            </div>

            <ListMenuDropdown />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
