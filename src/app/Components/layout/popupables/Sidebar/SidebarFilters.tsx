"use client";

import { Checkbox } from "@/components/ui/checkbox";

type Props = {
    filters: string[];
};

export default function SidebarFilters({ filters }: Props) {
    return (
        <div className="filters space-y-2">
            {filters.map(filter => (
                <label
                    key={filter}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Checkbox />
                    <span>{filter}</span>
                </label>
            ))}
        </div>
    );
}
