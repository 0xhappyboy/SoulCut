/**
 * Unified API client.
 * Works both in the browser (relative URLs) and in Node (BFF routes,
 * absolute URLs pointing at the Rust backend).
 */
import { BASE_URL } from "@/AppConfig";
import { getToken, clearToken } from "./auth";
/** Is this running in Node (BFF routes) or the browser? */
const IS_SERVER = typeof window === "undefined";
/** Prefix for building request URLs. */
function prefix(): string {
    return IS_SERVER ? BASE_URL : "/api/saas";
}
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T | null;
}
export class ApiError extends Error {
    status: number;
    code: number;
    constructor(status: number, code: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}
export interface RequestOptions {
    query?: Record<string, string | number | boolean | undefined | null>;
    body?: unknown;
    headers?: Record<string, string>;
    skipAuth?: boolean;
    /** Forward incoming cookie (BFF only). */
    cookie?: string | null;
}
function buildUrl(path: string, query?: RequestOptions["query"]): string {
    const base = `${prefix()}${path}`;
    if (!query) return base;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null && v !== "") {
            params.set(k, String(v));
        }
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
}
function buildHeaders(options: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
    };
    if (!options.skipAuth && !IS_SERVER) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}
/**
 * Raw request. Always returns `{ status, body }`.
 * Used by BFF routes (they need the HTTP status).
 */
export async function requestRaw<T = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    options: RequestOptions = {},
): Promise<{ status: number; body: ApiResponse<T> }> {
    const resp = await fetch(buildUrl(path, options.query), {
        method,
        headers: buildHeaders(options),
        body:
            options.body !== undefined ? JSON.stringify(options.body) : undefined,
        cache: "no-store",
    });
    let body: ApiResponse<T>;
    try {
        body = (await resp.json()) as ApiResponse<T>;
    } catch {
        body = {
            code: resp.status,
            message: resp.statusText || "invalid response",
            data: null,
        };
    }
    return { status: resp.status, body };
}
/**
 * Core request. Returns `data` on success, throws `ApiError` on failure.
 * Used by the browser.
 */
export async function request<T = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { status, body } = await requestRaw<T>(method, path, options);
    if (status === 401 && !IS_SERVER) clearToken();
    if (status < 200 || status >= 300 || body.code !== 0) {
        throw new ApiError(
            status,
            body.code ?? status,
            body.message || "request failed",
        );
    }
    return body.data as T;
}
/** Browser helpers. */
export const http = {
    get: <T = unknown>(path: string, options?: RequestOptions) =>
        request<T>("GET", path, options),
    post: <T = unknown>(path: string, options?: RequestOptions) =>
        request<T>("POST", path, options),
    put: <T = unknown>(path: string, options?: RequestOptions) =>
        request<T>("PUT", path, options),
    delete: <T = unknown>(path: string, options?: RequestOptions) =>
        request<T>("DELETE", path, options),
    patch: <T = unknown>(path: string, options?: RequestOptions) =>
        request<T>("PATCH", path, options),
};
/** BFF helpers (return status + body, never throw). */
export const httpRaw = {
    get: <T = unknown>(path: string, options?: RequestOptions) =>
        requestRaw<T>("GET", path, options),
    post: <T = unknown>(path: string, options?: RequestOptions) =>
        requestRaw<T>("POST", path, options),
    put: <T = unknown>(path: string, options?: RequestOptions) =>
        requestRaw<T>("PUT", path, options),
    delete: <T = unknown>(path: string, options?: RequestOptions) =>
        requestRaw<T>("DELETE", path, options),
    patch: <T = unknown>(path: string, options?: RequestOptions) =>
        requestRaw<T>("PATCH", path, options),
};