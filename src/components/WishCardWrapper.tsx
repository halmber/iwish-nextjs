"use client";

import { Wish } from "@prisma/client";
import { WishCard } from "@/components/WishCard";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WishCardWrapperProps {
  wishes: Wish[];
  ownWish?: boolean;
}

const sortFields = {
  desireLvl: "Desire Level",
  price: "Price",
} as const;
const filter = ["all", "fulfilled", "unfulfilled"] as const;
type SortField = keyof typeof sortFields;
type FulfilledFilter = (typeof filter)[number];

export function WishCardWrapper({ wishes, ownWish }: WishCardWrapperProps) {
  const [sortConfig, setSortConfig] = useState<{
    field: SortField | null;
    order: "asc" | "desc";
  }>({ field: null, order: "desc" });
  const [fulfilledFilter, setFulfilledFilter] =
    useState<FulfilledFilter>("all");

  const toggleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  const filteredWishes = useMemo(() => {
    if (fulfilledFilter === "all") return wishes;
    if (fulfilledFilter === "fulfilled")
      return wishes.filter((w) => w.fulfilled);
    return wishes.filter((w) => !w.fulfilled);
  }, [wishes, fulfilledFilter]);

  const sortedWishes = useMemo(() => {
    if (!sortConfig.field) return filteredWishes;

    return [...filteredWishes].sort((a, b) => {
      if (!sortConfig.field) return 0;
      const diff = a[sortConfig.field] - b[sortConfig.field];
      return sortConfig.order === "asc" ? diff : -diff;
    });
  }, [filteredWishes, sortConfig]);

  const renderArrow = (field: SortField) =>
    sortConfig.field === field &&
    (sortConfig.order === "asc" ? (
      <ArrowUpWideNarrow />
    ) : (
      <ArrowDownWideNarrow />
    ));

  return (
    <>
      <div className="flex gap-4 mb-4 text-sm font-medium">
        <Select
          defaultValue={filter[0] as string}
          onValueChange={(value) =>
            setFulfilledFilter(value as FulfilledFilter)
          }
        >
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder={filter[0]} />
          </SelectTrigger>
          <SelectContent>
            {filter.map((item) => (
              <SelectItem key={item} value={item}>
                {item[0].toUpperCase()}
                {item.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {Object.entries(sortFields).map(([field, label]) => (
          <Button
            key={field}
            variant="outline"
            onClick={() => toggleSort(field as SortField)}
            className="rounded-full flex items-center"
          >
            {label}
            {renderArrow(field as SortField)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedWishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} ownWish={ownWish} />
        ))}
      </div>
    </>
  );
}
