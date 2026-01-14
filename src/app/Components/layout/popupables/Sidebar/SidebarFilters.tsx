"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { VkmFilters } from "@/app/lib/useItem";

type Props = {
  value: VkmFilters;
  onChange: (next: VkmFilters) => void;
};

// Replace these with your real options (or load them dynamically later)
const STUDY_CREDITS = [5, 10, 15, 30];
const LOCATIONS = ["Den Bosch", "Breda", "Tilburg"];
const LEVELS = ["NLQF6", "NLQF7"];

function nextWith<T extends keyof VkmFilters>(
  value: VkmFilters,
  key: T,
  nextVal: VkmFilters[T]
): VkmFilters {
  return { ...value, [key]: nextVal };
}

export default function SidebarFilters({ value, onChange }: Props) {
  const togglestudycredit = (credit: number) => {
    onChange(
      nextWith(
        value,
        "studycredit",
        value.studycredit === credit ? undefined : credit
      )
    );
  };

  const toggleLocation = (loc: string) => {
    onChange(
      nextWith(value, "location", value.location === loc ? undefined : loc)
    );
  };

  const toggleLevel = (lvl: string) => {
    onChange(nextWith(value, "level", value.level === lvl ? undefined : lvl));
  };

  const clearAll = () => onChange({});

  return (
    <div className="filters space-y-6 mt-4">
      <div>
        <div className="font-semibold mb-2">Study credit</div>
        <div className="space-y-2">
          {STUDY_CREDITS.map((credit) => (
            <label
              key={credit}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={value.studycredit === credit}
                onCheckedChange={() => togglestudycredit(credit)}
              />
              <span>{credit}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">Locatie</div>
        <div className="space-y-2">
          {LOCATIONS.map((loc) => (
            <label key={loc} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={value.location === loc}
                onCheckedChange={() => toggleLocation(loc)}
              />
              <span>{loc}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">Level</div>
        <div className="space-y-2">
          {LEVELS.map((lvl) => (
            <label key={lvl} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={value.level === lvl}
                onCheckedChange={() => toggleLevel(lvl)}
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="button" className="text-sm underline" onClick={clearAll}>
        Reset filters
      </button>
    </div>
  );
}
