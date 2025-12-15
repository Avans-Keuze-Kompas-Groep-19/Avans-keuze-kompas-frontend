"use client";

type Props = {
    filters: string[];
};

export default function SidebarFilters({ filters }: Props) {
    return (
        <div className="filters">
            {filters.map((item, index) => (
                <div key={index} className="filter-item">
                    {item}
                </div>
            ))}
        </div>
    );
}
