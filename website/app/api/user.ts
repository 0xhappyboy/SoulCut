/**
 * User API endpoints.
 */
import { http } from "./client";
/** Payload for POST /user/register. */
export interface RegisterPayload {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
    phone?: string;
}
/** Payload for POST /user/login. */
export interface LoginPayload {
    username: string;
    password: string;
}
/** Payload for POST /user/create (admin). */
export interface CreateUserPayload {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
    phone?: string;
    status?: number;
}
/** Payload for PUT /user/update?id=1. */
export interface UpdateUserPayload {
    password?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    // Profile
    avatar?: string;
    wallpaper?: string;
    gender?: number;
    birthday?: string; // YYYY-MM-DD
    signature?: string;
    real_name?: string;
    // Locale
    country?: string;
    province?: string;
    city?: string;
    address?: string;
    language?: string;
    timezone?: string;
    // Status
    status?: number;
}
/**
 * User business object returned by the backend.
 * Mirrors `service/user/bo.rs::UserBo`.
 */
export interface UserBo {
    id: number;
    username: string;
    nickname: string | null;
    email: string | null;
    phone: string | null;
    // Profile
    avatar: string | null;
    wallpaper: string | null;
    gender: number;
    birthday: string | null;
    signature: string | null;
    real_name: string | null;
    // Locale
    country: string | null;
    province: string | null;
    city: string | null;
    address: string | null;
    language: string;
    timezone: string;
    // Account meta
    source: string | null;
    email_verified: number;
    phone_verified: number;
    last_login_time: string | null;
    status: number;
    // Timestamps
    create_time: string;
    update_time: string;
}
/** Response of POST /user/login. */
export interface LoginResponse {
    token: string;
    user: UserBo;
    tenant_id: number;
    role: string;
}
/** Response of POST /user/register. */
export interface RegisterResponse {
    id: number;
    username: string;
    role: string;
}
/** Response of POST /user/create. */
export interface CreateUserResponse {
    id: number;
}
/** Response of PUT /user/update and DELETE /user/delete. */
export interface AffectedResponse {
    affected: number;
}
/** Response of GET /user/count. */
export interface CountResponse {
    count: number;
}
/**
 * GET /user/member — current user's membership.
 *
 * The backend derives the user from the JWT subject, so no id is sent.
 */
export interface MemberInfo {
    /** Membership expiry time as a UNIX timestamp in seconds. 0 = none. */
    expire_at: number;
    /** Whether a real record exists in the backend. */
    exists?: boolean;
    user_id?: number;
}
/**
 * GET /user/llm/integral — current user's integral balance.
 */
export interface IntegralInfo {
    /** Current integral (points) balance. */
    integral: number;
    /** Cumulative points ever recharged. */
    total_recharge?: number;
    /** Cumulative points ever consumed. */
    total_consume?: number;
    /** Whether a real record exists in the backend. */
    exists?: boolean;
    user_id?: number;
}
/** Response of GET /user/llm/usage/sum. */
export interface UsageSumResponse {
    user_id: number;
    kind: string;
    usage_type: string | null;
    tokens: number;
}
/**
 * Nested usage map keyed by kind -> provider_code -> model_id -> tokens.
 */
export type LlmUsageSummary = Record<
    string,
    Record<string, Record<string, number>>
>;
/** Response of GET /user/llm/usage/summary. */
export interface UsageSummaryResponse {
    user_id: number;
    usage: LlmUsageSummary;
}
/**
 * The four LLM model kinds, kept in sync with the backend.
 */
export type LlmKind = "chat" | "image" | "video" | "audio";
/** Per-kind usage counters for the current user. */
export interface LlmUsage {
    used: number;
    quota: number;
}
/** Usage map keyed by kind. */
export type LlmUsageMap = Record<LlmKind, LlmUsage>;
/** Default quotas per kind (frontend placeholder until backend provides them). */
export const DEFAULT_LLM_QUOTA: Record<LlmKind, number> = {
    chat: 1000,
    image: 500,
    video: 100,
    audio: 300,
};
export const userApi = {
    /** POST /user/register */
    register: (payload: RegisterPayload) =>
        http.post<RegisterResponse>("/user/register", {
            body: payload,
            skipAuth: true,
        }),
    /** POST /user/login */
    login: (payload: LoginPayload) =>
        http.post<LoginResponse>("/user/login", {
            body: payload,
            skipAuth: true,
        }),
    // Current user (JWT required)
    /** GET /user/me — current user info, derived from the JWT. */
    me: () => http.get<UserBo>("/user/me"),
    // CRUD
    /** POST /user/create (admin) */
    create: (payload: CreateUserPayload) =>
        http.post<CreateUserResponse>("/user/create", { body: payload }),
    /** GET /user/get?id=1 */
    get: (id: number) => http.get<UserBo>("/user/get", { query: { id } }),
    /** GET /user/username?username=alice */
    getByUsername: (username: string) =>
        http.get<UserBo>("/user/username", { query: { username } }),
    /** GET /user/email?email=a@b.com */
    getByEmail: (email: string) =>
        http.get<UserBo>("/user/email", { query: { email } }),
    /** GET /user/phone?phone=138... */
    getByPhone: (phone: string) =>
        http.get<UserBo>("/user/phone", { query: { phone } }),
    /** GET /user/list?offset=0&limit=20 */
    list: (offset = 0, limit = 20) =>
        http.get<UserBo[]>("/user/list", { query: { offset, limit } }),
    /** GET /user/count */
    count: () => http.get<CountResponse>("/user/count"),
    /** PUT /user/update?id=1 */
    update: (id: number, payload: UpdateUserPayload) =>
        http.put<AffectedResponse>("/user/update", {
            query: { id },
            body: payload,
        }),
    /** DELETE /user/delete?id=1 */
    delete: (id: number) =>
        http.delete<AffectedResponse>("/user/delete", { query: { id } }),
};
/**
 * Member / integral endpoints for the current user.
 */
export const memberApi = {
    /** GET /user/member — membership of the current user. */
    me: () => http.get<MemberInfo>("/user/member"),
    /** GET /user/llm/integral — integral balance of the current user. */
    integral: () => http.get<IntegralInfo>("/user/llm/integral"),
};
/**
 * LLM usage endpoints for the current user.
 */
export const llmUsageApi = {
    /**
     * GET /user/llm/usage/sum?kind=&usage_type=
     */
    sum: (kind: string, usageType?: string) =>
        http.get<UsageSumResponse>("/user/llm/usage/sum", {
            query: { kind, usage_type: usageType },
        }),
    /**
     * GET /user/llm/usage/summary
     */
    summary: () => http.get<UsageSummaryResponse>("/user/llm/usage/summary"),
};
/**
 * Fetch the token sum for a single kind for the current user.
 */
async function fetchKindTokens(kind: LlmKind): Promise<number> {
    try {
        const res = await llmUsageApi.sum(kind);
        return res.tokens ?? 0;
    } catch {
        return 0;
    }
}
/**
 * Read per-kind usage for the current user.
 */
export async function fetchLlmUsage(): Promise<LlmUsageMap> {
    const [chat, image, video, audio] = await Promise.all([
        fetchKindTokens("chat"),
        fetchKindTokens("image"),
        fetchKindTokens("video"),
        fetchKindTokens("audio"),
    ]);
    return {
        chat: { used: chat, quota: DEFAULT_LLM_QUOTA.chat },
        image: { used: image, quota: DEFAULT_LLM_QUOTA.image },
        video: { used: video, quota: DEFAULT_LLM_QUOTA.video },
        audio: { used: audio, quota: DEFAULT_LLM_QUOTA.audio },
    };
}
export { ApiError } from "./client";