'use client';

import { useEffect, useMemo, useState } from 'react';
import { getApiClient } from './apiClient';
import type { VKM } from '@/app/types/VKM';

/**
 * Filters supported by the backend:
 * GET /vkm/filter?studyCredit=...&location=...&level=...
 */
export type VkmFilters = {
    studyCredit?: number;
    location?: string;
    level?: string;
};

/**
 * Backward-compatible alias for older components importing { Item } from this file.
 */
export type Item = VKM;

export function useItems(filters: VkmFilters = {}) {
    const [items, setItems] = useState<VKM[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Stable dependency for useEffect when filters change
    const key = useMemo(() => JSON.stringify(filters), [filters]);

    useEffect(() => {
        let cancelled = false;
        const api = getApiClient();

        (async () => {
            setLoading(true);
            setError(null);

            // Critical: clear previous results so you don't keep rendering "all items"
            setItems([]);

            try {
                const data = await api.getVKMItemsFiltered(filters);
                if (!cancelled) setItems(data);
            } catch (e: any) {
                if (!cancelled) {
                    setError(e?.message ?? 'Failed to load items');
                    setItems([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [key]);

    return { items, loading, error };
}
