use crate::{
    dao::{CreateUserLlmUsage, UserLlmUsageDao, pool},
    service::{
        Service,
        common::{
            auth::extract_claims,
            http::{err, ok, query_str, query_u64},
        },
    },
    types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
/// Extract the authenticated user id from the request's JWT.
fn auth_user_id(req: &Request) -> Result<u64, Response> {
    let claims = extract_claims(req).map_err(|_| err::unauthorized("invalid or missing token"))?;
    claims
        .sub
        .parse::<u64>()
        .map_err(|_| err::unauthorized("invalid token subject"))
}
/// POST /user/llm/usage
#[derive(Debug, Deserialize)]
pub struct CreateUsageReq {
    pub tenant_id: Option<u64>,
    pub kind: String,
    pub provider_code: String,
    pub model_id: String,
    pub tokens: u64,
    /// "input" / "output" for chat models, None otherwise.
    pub usage_type: Option<String>,
    pub duration_ms: Option<u32>,
    pub success: Option<i8>,
    pub request_id: Option<String>,
}
pub struct UserLlmUsageCreateService;
impl Service for UserLlmUsageCreateService {
    fn uri() -> &'static str {
        "/user/llm/usage"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        // Authenticate first: the token decides whose usage this is.
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        let input: CreateUsageReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        let payload = CreateUserLlmUsage {
            user_id,
            tenant_id: input.tenant_id.unwrap_or(0),
            kind: input.kind,
            provider_code: input.provider_code,
            model_id: input.model_id,
            tokens: input.tokens,
            usage_type: input.usage_type,
            duration_ms: input.duration_ms.unwrap_or(0),
            success: input.success.unwrap_or(1),
            request_id: input.request_id,
        };
        match UserLlmUsageDao::create(pool(), &payload).await {
            Ok(id) => ok(json!({ "id": id })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// GET /user/llm/usage/list?kind=&offset=&limit=
pub struct UserLlmUsageListService;
impl Service for UserLlmUsageListService {
    fn uri() -> &'static str {
        "/user/llm/usage/list"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        let offset = query_u64(&req, "offset").unwrap_or(0);
        let limit = query_u64(&req, "limit").unwrap_or(20);
        let kind = query_str(&req, "kind");
        let result = match kind.as_deref() {
            Some(k) if !k.is_empty() => {
                UserLlmUsageDao::list_by_user_and_kind(pool(), user_id, k, offset, limit).await
            }
            _ => UserLlmUsageDao::list_by_user(pool(), user_id, offset, limit).await,
        };
        match result {
            Ok(rows) => ok(rows),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// GET /user/llm/usage/count
///
/// Total number of LLM call records for the authenticated user.
pub struct UserLlmUsageCountService;
impl Service for UserLlmUsageCountService {
    fn uri() -> &'static str {
        "/user/llm/usage/count"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        match UserLlmUsageDao::count_by_user(pool(), user_id).await {
            Ok(n) => ok(json!({ "count": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// GET /user/llm/usage/sum?kind=&usage_type=
pub struct UserLlmUsageSumService;
impl Service for UserLlmUsageSumService {
    fn uri() -> &'static str {
        "/user/llm/usage/sum"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        let kind = match query_str(&req, "kind") {
            Some(v) if !v.is_empty() => v,
            _ => return err::bad_request("missing kind"),
        };
        let usage_type = query_str(&req, "usage_type");
        match UserLlmUsageDao::sum_tokens_by_user_and_kind(
            pool(),
            user_id,
            &kind,
            usage_type.as_deref(),
        )
        .await
        {
            Ok(tokens) => ok(json!({
                "user_id": user_id,
                "kind": kind,
                "usage_type": usage_type,
                "tokens": tokens,
            })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// GET /user/llm/usage/summary
///
/// Full usage of the authenticated user, aggregated by
/// kind -> provider -> model, with the summed token count per model.
///
/// The response shape is:
/// ```json
/// {
///   "chat": {
///     "openai": { "gpt-4o": 1234, "gpt-4o-mini": 88 },
///     "anthropic": { "claude-3-5-sonnet": 5678 }
///   },
///   "image": {
///     "seedream": { "doubao-seedream-4-5": 12 }
///   }
/// }
/// ```
pub struct UserLlmUsageSummaryService;
impl Service for UserLlmUsageSummaryService {
    fn uri() -> &'static str {
        "/user/llm/usage/summary"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        match UserLlmUsageDao::sum_all_by_user(pool(), user_id).await {
            // `summary` serializes as { kind: { provider: { model: tokens } } }.
            Ok(summary) => ok(json!({ "user_id": user_id, "usage": summary.usage })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
