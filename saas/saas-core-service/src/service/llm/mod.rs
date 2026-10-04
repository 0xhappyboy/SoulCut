//! LLM metadata service module.
//!
//! Exposes read-only APIs that describe every model kind
//! (chat / image / video / audio), every provider under each kind,
//! and every concrete model under each provider.
//!
//! All endpoints are public (no authentication required).
mod list_models;
mod list_providers;
pub use list_models::LlmListModelsService;
pub use list_providers::LlmListProvidersService;
