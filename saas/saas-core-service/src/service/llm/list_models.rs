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
/// A single provider block that carries its concrete model list.
fn provider_with_models(
    kind: &str,
    provider_id: &str,
    provider_name: &str,
    vendor: &str,
    description: &str,
    description_zh: &str,
    models: Vec<(String, String, bool)>,
) -> Value {
    let model_entries: Vec<Value> = models
        .into_iter()
        .map(|(id, name, recommended)| {
            json!({
                "id": id,
                "name": name,
                "recommended": recommended,
            })
        })
        .collect();
    json!({
        "kind": kind,
        "provider_id": provider_id,
        "provider_name": provider_name,
        "vendor": vendor,
        "description": description,
        "description_zh": description_zh,
        "models": model_entries,
    })
}
/// Build the model list for the chat kind.
fn chat_models() -> Vec<Value> {
    ChatModelProvider::all()
        .into_iter()
        .map(|p| {
            provider_with_models(
                "chat",
                p.id(),
                &p.to_string(),
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
                p.models(),
            )
        })
        .collect()
}
/// Build the model list for the image kind.
fn image_models() -> Vec<Value> {
    ImageModelProvider::all()
        .into_iter()
        .map(|p| {
            let provider_name = p.to_string();
            let provider_id = provider_name.to_lowercase();
            provider_with_models(
                "image",
                &provider_id,
                &provider_name,
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
                p.models(),
            )
        })
        .collect()
}
/// Build the model list for the video kind.
fn video_models() -> Vec<Value> {
    VideoModelProvider::all()
        .into_iter()
        .map(|p| {
            let provider_name = p.to_string();
            let provider_id = provider_name.to_lowercase();
            provider_with_models(
                "video",
                &provider_id,
                &provider_name,
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
                p.models(),
            )
        })
        .collect()
}
/// Build the model list for the audio kind.
fn audio_models() -> Vec<Value> {
    AudioModelProvider::all()
        .into_iter()
        .map(|p| {
            let provider_name = p.to_string();
            let provider_id = provider_name.to_lowercase();
            provider_with_models(
                "audio",
                &provider_id,
                &provider_name,
                &p.vendor().to_string(),
                p.description(),
                p.description_zh(),
                p.models(),
            )
        })
        .collect()
}
/// Resolve the model list for a given kind string.
fn models_for_kind(kind: &str) -> Option<Vec<Value>> {
    match kind {
        "chat" => Some(chat_models()),
        "image" => Some(image_models()),
        "video" => Some(video_models()),
        "audio" => Some(audio_models()),
        _ => None,
    }
}
/// Return the full kind -> providers(with models) map.
fn all_models() -> Value {
    json!({
        "chat": chat_models(),
        "image": image_models(),
        "video": video_models(),
        "audio": audio_models(),
    })
}
/// Service: `GET /llm/models[?kind=chat|image|video|audio]`
pub struct LlmListModelsService;
impl Service for LlmListModelsService {
    fn uri() -> &'static str {
        "/llm/models"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        match query_str(&req, "kind") {
            Some(kind) => match models_for_kind(&kind) {
                Some(providers) => ok(json!({
                    "kind": kind,
                    "providers": providers,
                })),
                None => {
                    err::bad_request("invalid kind, expected one of: chat, image, video, audio")
                }
            },
            None => ok(all_models()),
        }
    }
}
