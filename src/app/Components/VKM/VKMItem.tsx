'use client';

import { useState } from 'react';
import { useItems, type VkmFilters } from '../../lib/useItem';
import { ItemCard } from './ItemCard';
import Sidebar from "@/app/Components/layout/popupables/Sidebar/Sidebar";

export default function ItemsView() {
    const [filters, setFilters] = useState<VkmFilters>({});
    const { items, loading, error } = useItems(filters);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container flex gap-5">
            <div className="col">
                <Sidebar
                    heading="Filters"
                    description="Kies hier je filters"
                    value={filters}
                    onChange={setFilters}
                />
            </div>

            <div className="col">
                <h2 className="text-3xl mb-2 font-bold">Alle keuze modules:</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    {items.map((item, index) => (
                        <ItemCard key={item._id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
