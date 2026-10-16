import { useId } from "react";

import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_LABELS,
  type TsaEventCategory,
} from "@/data/events";
import { cn } from "@/lib/utils";

/**
 * Category filter: "All" plus one toggle button per category. Each is a real
 * `<button>` with `aria-pressed`, in a labelled group, so Tab moves between
 * them and Enter/Space selects. `null` means "All".
 *
 * The buttons wrap onto extra lines on narrow screens instead of scrolling.
 */
export default function EventFilters({
  value,
  onChange,
  className,
}: {
  value: TsaEventCategory | null;
  onChange: (category: TsaEventCategory | null) => void;
  className?: string;
}) {
  const labelId = useId();
  const options: { value: TsaEventCategory | null; label: string }[] = [
    { value: null, label: "All" },
    ...EVENT_CATEGORIES.map((c) => ({ value: c, label: EVENT_CATEGORY_LABELS[c] })),
  ];

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4", className)}>
      <span id={labelId} className="shrink-0 text-sm font-semibold text-tsa-navy-900">
        Filter by category
      </span>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const pressed = option.value === value;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(option.value)}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-tsa-red-600",
                pressed
                  ? "border-surface-navy bg-surface-navy text-surface-navy-fg"
                  : "border-tsa-navy-900/25 text-tsa-navy-900 hover:bg-tsa-navy-900/[0.06]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
