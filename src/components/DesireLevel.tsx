import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface DesireLevelSelectorProps {
  desireLvl: number;
  setDesireLvl?: (desireLvl: number) => void;
  className?: string;
}

export default function DesireLevel({
  desireLvl,
  setDesireLvl,
  className,
}: DesireLevelSelectorProps) {
  const desireLvls = [1, 2, 3, 4, 5];

  return (
    <div className={cn("flex justify-between", className)}>
      <div className="flex gap-2">
        {desireLvls.map((level) => (
          <button
            key={level}
            className="transition-transform hover:scale-110"
            {...(setDesireLvl && { onClick: () => setDesireLvl(level) })}
            disabled={!setDesireLvl}
            type="button"
          >
            <Heart
              size={20}
              className={cn(
                "transition-colors",
                level <= desireLvl
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
