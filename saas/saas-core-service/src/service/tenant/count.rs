use crate::{
    dao::{TenantDao, pool},
    service::{
        Service,
        common::http::{err, ok},
    },
    types::{HttpMethod, Request, Response},
};
use serde_json::json;
pub struct TenantCountService;
impl Service for TenantCountService {
    fn uri() -> &'static str {
        "/tenant/count"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(_req: Request) -> Response {
        match TenantDao::count(pool()).await {
            Ok(n) => ok(json!({ "count": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
