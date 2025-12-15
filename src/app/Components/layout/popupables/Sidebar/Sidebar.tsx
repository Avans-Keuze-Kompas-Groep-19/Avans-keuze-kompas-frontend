'use client';

import SidebarFilters from "@/app/Components/layout/popupables/Sidebar/SidebarFilters";
import type { VkmFilters } from "@/app/lib/useItem";

type SidebarProps = {
    heading?: string;
    description?: string;
    value: VkmFilters;
    onChange: (next: VkmFilters) => void;
};

export default function Sidebar(props: SidebarProps) {
    const heading = props.heading ?? "Sidebar";
    const description = props.description ?? "Kies hier je filters";

    return (
        <section className="sidebar">
            <div className="sidebar bg-sidebar rounded w-[288px] h-full p-5">
                <h2>{heading}</h2>
                <p>{description}</p>

                <SidebarFilters value={props.value} onChange={props.onChange} />
            </div>
        </section>
    );
}
