use crate::{
    service::{
        Service,
        common::http::{err, ok, query_str},
    },
    types::{HttpMethod, Request, Response},
};
use langhub::audio::AudioModelProvider;
use langhub::chat::ChatModelProvider;
use langhub::image::ImageModelProvider;
use langhub::video::VideoModelProvider;
use serde_json::{Value, json};
/// A single provider entry in the response payload.
fn provider_entry(
    kind: &str,
    provider_id: &str,
    provider_name: &str,
    vendor: &str,
    description: &str,
    description_zh: &str,
) -> Value {
    json!({
        "kind": kind,
        "provider_id": provider_id,
        "provider_name": provider_name,
        "vendor": vendor,
        "description": description,
        "description_zh": description_zh,
    })
}
/// Build the provider list for the chat kind.
fn chat_providers() -> Vec<Value> {
    ChatModelProvider::all()
        .into_iter()
        .map(|p| {
            provider_entry(
                "chat",
                p.id(),
                &p.to_string(),
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
            )
        })
        .collect()
}
/// Build the provider list for the image kind.
fn image_providers() -> Vec<Value> {
    ImageModelProvider::all()
        .into_iter()
        .map(|p| {
            let provider_name = p.to_string();
            let provider_id = provider_name.to_lowercase();
            provider_entry(
                "image",
                &provider_id,
                &provider_name,
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
            )
        })
        .collect()
}
/// Build the provider list for the video kind.
fn video_providers() -> Vec<Value> {
    VideoModelProvider::all()
        .into_iter()
        .map(|p| {
            let provider_name = p.to_string();
            let provider_id = provider_name.to_lowercase();
            provider_entry(
                "video",
                &provider_id,
                &provider_name,
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
            )
        })
        .collect()
}
/// Build the provider list for the audio kind.
fn audio_providers() -> Vec<Value> {
    AudioModelProvider::all()
        .into_iter()
        .map(|p| {
            let provider_name = p.to_string();
            let provider_id = provider_name.to_lowercase();
            provider_entry(
                "audio",
                &provider_id,
                &provider_name,
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
            )
        })
        .collect()
}
/// Resolve the provider list for a given kind string.
fn providers_for_kind(kind: &str) -> Option<Vec<Value>> {
    match kind {
        "chat" => Some(chat_providers()),
        "image" => Some(image_providers()),
        "video" => Some(video_providers()),
        "audio" => Some(audio_providers()),
        _ => None,
    }
}
/// Return the full kind -> providers map (used when `kind` is omitted).
fn all_providers() -> Value {
    json!({
        "chat": chat_providers(),
        "image": image_providers(),
        "video": video_providers(),
        "audio": audio_providers(),
    })
}
/// Service: `GET /llm/providers[?kind=chat|image|video|audio]`
pub struct LlmListProvidersService;
impl Service for LlmListProvidersService {
    fn uri() -> &'static str {
        "/llm/providers"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        match query_str(&req, "kind") {
            Some(kind) => match providers_for_kind(&kind) {
                Some(providers) => ok(json!({
                    "kind": kind,
                    "providers": providers,
                })),
                None => {
                    err::bad_request("invalid kind, expected one of: chat, image, video, audio")
                }
            },
            None => ok(all_providers()),
        }
    }
}
