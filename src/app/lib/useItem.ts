'use client';

import { useEffect, useMemo, useState } from 'react';
import { getApiClient } from '@/app/lib/apiClient'; // pas pad aan
import type { VKM } from '@/app/types/VKM';
import type { VkmFilters} from "@/app/Components/VKM/VKMItem"; // pas pad aan

export function useItems(filters?: VkmFilters) {
    const [items, setItems] = useState<VKM[]>([]);
    const [loading, setLoading] = useState(true);

    const key = useMemo(() => JSON.stringify(filters ?? {}), [filters]);

    useEffect(() => {
        let cancelled = false;
        const api = getApiClient();

        (async () => {
            setLoading(true);
            try {
                const hasFilters =
                    !!filters?.studyCredit || !!filters?.location || !!filters?.level;

                const data = hasFilters
                    ? await api.getVKMItemsFiltered(filters!)
                    : await api.getVKMItems();

                if (!cancelled) setItems(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [key]);

    return { items, loading };
}
