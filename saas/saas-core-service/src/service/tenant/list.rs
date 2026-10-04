use crate::{
    dao::{TenantDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_u64},
    },
    types::{HttpMethod, Request, Response},
};
pub struct TenantListService;
impl Service for TenantListService {
    fn uri() -> &'static str {
        "/tenant/list"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let offset = query_u64(&req, "offset").unwrap_or(0);
        let limit = query_u64(&req, "limit").unwrap_or(20);
        match TenantDao::list(pool(), offset, limit).await {
            Ok(rows) => ok(rows),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
