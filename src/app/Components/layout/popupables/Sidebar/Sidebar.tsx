'use client'

import SidebarFilters from "@/app/Components/layout/popupables/Sidebar/SidebarFilters";

type SidebarProps = {
    heading?: string;
    description?: string;
    filters?: string[];
    buttonText?: string;
}

export default function Sidebar(props: SidebarProps) {
    const heading = props.heading ?? "Sidebar";
    const description = props.description ?? "Kies hier je filters";
    const filters = props.filters ?? ["geen filters"];
    const buttonText = props.buttonText ?? "Sluiten";

    return (
        <section className="sidebar absolute left-0 bottom-0">
            <div className="sidebar bg-sidebar rounded w-[288px] h-full">
                <h2>{heading}</h2>
            </div>
            <SidebarFilters filters={filters} />
        </section>

    )
}