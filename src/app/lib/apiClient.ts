/**
 * ApiClient - Singleton Pattern
 * Centralized HTTP client for all API requests
 * Provides consistent error handling, request configuration, and authentication
 */

import { getConfig } from "./config";
import type { VKM, VKMInput } from "@/app/types/VKM";
import type { User } from "@/app/types/User";

// Types for better type safety
export interface ApiError {
    message: string;
    status: number;
    details?: unknown;
}

export interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

class ApiClient {
    private static instance: ApiClient;
    private config = getConfig();
    private getTokenFn: (() => string | null) | null = null;

    private constructor() {}

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    setTokenGetter(fn: () => string | null): void {
        this.getTokenFn = fn;
    }

    private getAuthHeaders(): HeadersInit {
        if (!this.getTokenFn) {
            return {};
        }
        const token = this.getTokenFn();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private buildHeaders(
        options: RequestOptions = {},
        includeAuth = true,
    ): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (includeAuth && options.requiresAuth !== false) {
            Object.assign(headers, this.getAuthHeaders());
        }

        return headers;
    }

    private async handleError(response: Response): Promise<never> {
        let errorDetails: unknown;
        try {
            errorDetails = await response.json();
        } catch {
            errorDetails = await response.text();
        }

        const error: ApiError = {
            message: `API request failed: ${response.statusText}`,
            status: response.status,
            details: errorDetails,
        };

        if (!this.config.IS_PRODUCTION) {
            // console.error("API Error:", error);
        }

        throw error;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {},
    ): Promise<T> {
        const url = this.config.getApiUrl(endpoint);
        const requiresAuth = options.requiresAuth !== false;

        const fetchOptions: RequestInit = {
            ...options,
            headers: this.buildHeaders(options, requiresAuth),
            credentials: "include",
        };

        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                await this.handleError(response);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            if ((error as ApiError).status) {
                throw error;
            }
            throw {
                message: "Network error or server unavailable",
                status: 0,
                details: error,
            } as ApiError;
        }
    }

    async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "GET",
            cache: "no-store",
        });
    }

    async post<T>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {},
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(
        endpoint: string,
        data: unknown,
        options: RequestOptions = {},
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "DELETE",
        });
    }

    async patch<T>(
        endpoint: string,
        data: unknown,
        options: RequestOptions = {},
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    // ===========================================
    // VKM-specific API methods
    // ===========================================

    async getVKMItems(): Promise<VKM[]> {
        return this.get<VKM[]>("/vkm");
    }

    async getVKMItem(id: string): Promise<VKM> {
        return this.get<VKM>(`/vkm/${id}`);
    }

    async createVKMItem(item: VKMInput): Promise<VKM> {
        return this.post<VKM>("/vkm", item);
    }

    async updateVKMItem(id: string | number, data: VKMInput): Promise<VKM> {
        return this.put<VKM>(`/vkm/${id}`, data);
    }

    async deleteVKMItem(id: string): Promise<void> {
        return this.delete<void>(`/vkm/${id}`);
    }

    // ===========================================
    // User-specific API methods
    // ===========================================

    async getUsers(): Promise<User[]> {
        return this.get<User[]>("/users");
    }

    /**
     * Get VKM items filtered by studyCredit, location, and/or level
     * Calls backend route: GET /vkm/filter?studyCredit=30&location=Den%20Bosch&level=NLQF6
     */
    async getVKMItemsFiltered(params: {
        studyCredit?: number;
        location?: string;
        level?: string;
    }): Promise<VKM[]> {
        const search = new URLSearchParams();

        if (params.studyCredit !== undefined) {
            search.set("studyCredit", String(params.studyCredit));
        }
        if (params.location) {
            search.set("location", params.location);
        }
        if (params.level) {
            search.set("level", params.level);
        }

        const qs = search.toString();
        const endpoint = qs ? `/vkm/filter?${qs}` : "/vkm/filter";

        // Als je backend deze route met JwtAuthGuard beschermt, laat dit zo.
        // Als je hem publiek wilt maken: { requiresAuth: false }
        return this.get<VKM[]>(endpoint);
    }
}

// Export singleton instance getter
export const getApiClient = () => ApiClient.getInstance();

// Export class for testing purposes
export default ApiClient;
