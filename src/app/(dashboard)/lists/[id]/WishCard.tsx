import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Wish } from "@prisma/client";
import DesireLevel from "./DesireLevel";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import WishMenuDropdown from "./WishMenuDropdown";

interface WishCardProps {
  wish: Wish;
}

export function WishCard({ wish }: WishCardProps) {
  return (
    <Card>
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
          <span className="text-neutral-500">
            {wish.price} {wish.currency}
          </span>
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
        <WishMenuDropdown wish={wish} />
      </CardFooter>
    </Card>
  );
}
