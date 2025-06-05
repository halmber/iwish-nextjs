import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Wish } from "@prisma/client";
import DesireLevel from "@/components/DesireLevel";
import { Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import WishMenuDropdown from "@/components/WishMenuDropdown";
import { Badge } from "@/components/ui/badge";

interface WishCardProps {
  wish: Wish;
  ownWish?: boolean;
}

export function WishCard({ wish, ownWish }: WishCardProps) {
  return (
    <Card className="relative">
      {wish.fulfilled && (
        <Badge
          variant="outline"
          className="p-0 absolute top-4 left-4 text-xl z-10 md:text-3xl"
        >
          <Check className="drop-shadow-3xl text-green-500" />
        </Badge>
      )}

      {wish.imageUrl && (
        <div className="relative w-full h-40 rounded-t-xl">
          <Image
            src={wish.imageUrl}
            alt={wish.title}
            fill
            sizes="100%"
            className="object-contain rounded-t-xl"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-4">
            {wish.title}
            {wish.url && (
              <a
                href={wish.url || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
          {wish.price !== 0 && (
            <Badge className="text-xs dark:text-neutral-500">
              {wish.price} {wish.currency}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <DesireLevel desireLvl={wish.desireLvl} />
        <p className="line-clamp-2 min-h-[2lh] text-sm">
          {wish.description || "No description provided"}
        </p>
      </CardContent>

      <CardFooter className="flex flex-1 items-center justify-between">
        <p className="text-sm text-end min-h-[1lh]">
          {wish.desiredGiftDate &&
            new Date(wish.desiredGiftDate).toLocaleDateString("uk-UA")}
        </p>
        {ownWish && <WishMenuDropdown wish={wish} />}
      </CardFooter>
    </Card>
  );
}
