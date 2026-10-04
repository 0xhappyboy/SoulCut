/**
 * LLM metadata API endpoints.
 */
import { http } from "./client";
/** The four model kinds exposed by the backend. */
export type LlmKind = "chat" | "image" | "video" | "audio";
/** A single concrete model under a provider. */
export interface LlmModel {
    /** Stable model id, e.g. "gpt-4o" — pass this back to the backend. */
    id: string;
    /** Human-readable display name, e.g. "GPT-4o". */
    name: string;
    /** Whether the provider marks this model as recommended. */
    recommended: boolean;
}
/** A provider entry with its concrete model list. */
export interface LlmProviderModels {
    kind: LlmKind;
    provider_id: string;
    provider_name: string;
    vendor: string;
    description: string;
    description_zh: string;
    models: LlmModel[];
}
/** A provider entry without models (providers endpoint). */
export interface LlmProvider {
    kind: LlmKind;
    provider_id: string;
    provider_name: string;
    vendor: string;
    description: string;
    description_zh: string;
}
/** Response of GET /llm/models?kind=... */
export interface LlmModelsByKind {
    kind: LlmKind;
    providers: LlmProviderModels[];
}
/** Response of GET /llm/providers?kind=... */
export interface LlmProvidersByKind {
    kind: LlmKind;
    providers: LlmProvider[];
}
/** Response of GET /llm/models (no kind) — all four kinds keyed by name. */
export interface LlmModelsAll {
    chat: LlmProviderModels[];
    image: LlmProviderModels[];
    video: LlmProviderModels[];
    audio: LlmProviderModels[];
}
/** Response of GET /llm/providers (no kind). */
export interface LlmProvidersAll {
    chat: LlmProvider[];
    image: LlmProvider[];
    video: LlmProvider[];
    audio: LlmProvider[];
}
/**
 * Per-kind usage counters for the current user.
 */
export interface LlmUsage {
    /** Number of calls already consumed for this kind. */
    used: number;
    /** Total quota for this kind in the current billing cycle. */
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
export const llmApi = {
    /** GET /llm/providers — all providers across all kinds. */
    providers: () => http.get<LlmProvidersAll>("/llm/providers"),
    /** GET /llm/providers?kind=chat — providers for a single kind. */
    providersByKind: (kind: LlmKind) =>
        http.get<LlmProvidersByKind>("/llm/providers", { query: { kind } }),
    /** GET /llm/models — all providers with their models, across all kinds. */
    models: () => http.get<LlmModelsAll>("/llm/models"),
    /** GET /llm/models?kind=chat — providers with models for a single kind. */
    modelsByKind: (kind: LlmKind) =>
        http.get<LlmModelsByKind>("/llm/models", { query: { kind } }),
};
/**
 * Read per-kind usage for the current user.
 */
export async function fetchLlmUsage(): Promise<LlmUsageMap> {
    return {
        chat: { used: 0, quota: DEFAULT_LLM_QUOTA.chat },
        image: { used: 0, quota: DEFAULT_LLM_QUOTA.image },
        video: { used: 0, quota: DEFAULT_LLM_QUOTA.video },
        audio: { used: 0, quota: DEFAULT_LLM_QUOTA.audio },
    };
}