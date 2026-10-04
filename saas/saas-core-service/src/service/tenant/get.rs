use crate::{
    dao::{TenantDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_u64},
    },
    types::{HttpMethod, Request, Response},
};
pub struct TenantGetService;
impl Service for TenantGetService {
    fn uri() -> &'static str {
        "/tenant/get"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let id = match query_u64(&req, "id") {
            Some(v) => v,
            None => return err::bad_request("missing id"),
        };
        match TenantDao::find_by_id(pool(), id).await {
            Ok(Some(t)) => ok(t),
            Ok(None) => err::not_found("tenant not found"),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
