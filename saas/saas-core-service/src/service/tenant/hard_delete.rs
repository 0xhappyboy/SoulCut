use crate::{
    dao::{TenantDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_u64},
    },
    types::{HttpMethod, Request, Response},
};
use serde_json::json;
pub struct TenantHardDeleteService;
impl Service for TenantHardDeleteService {
    fn uri() -> &'static str {
        "/tenant/hard_delete"
    }
    fn method() -> HttpMethod {
        HttpMethod::Delete
    }
    async fn handle(req: Request) -> Response {
        let id = match query_u64(&req, "id") {
            Some(v) => v,
            None => return err::bad_request("missing id"),
        };
        match TenantDao::hard_delete(pool(), id).await {
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
