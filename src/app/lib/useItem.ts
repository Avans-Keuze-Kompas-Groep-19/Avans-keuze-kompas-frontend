"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiClient } from "./apiClient";
import type { VKM } from "@/app/types/VKM";
import { useAuth } from "@/app/lib/auth/useAuth";

/**
 * Filters supported by the backend:
 * GET /vkm/filter?studyCredit=...&location=...&level=...
 */
export type VkmFilters = {
  studycredit?: number;
  location?: string;
  level?: string;
};

/**
 * Backward-compatible alias for older components importing { Item } from this file.
 */
export type Item = VKM;

export function useItems(filters: VkmFilters = {}, recommendation = false) {
  const [items, setItems] = useState<VKM[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Stable dependency for useEffect when filters change
  const key = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    let cancelled = false;
    const api = getApiClient();

    (async () => {
      setLoading(true);
      setError(null);
      setItems([]);

      try {
        if (recommendation) {
          if (user) {
            const fullUser = await api.getUser(user.sub);
            if (fullUser && fullUser.recommended_vkms && fullUser.recommended_vkms.length > 0) {
              const data = await api.getVKMItemsByIds(fullUser.recommended_vkms.slice(0, 3));
              if (!cancelled) setItems(data);
            }
          }
        } else {
          const data = await api.getVKMItemsFiltered(filters);
          if (!cancelled) setItems(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load items");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, recommendation, user]);

  return { items, loading, error };
}
