use crate::{
    dao::{TenantDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_str},
    },
    types::{HttpMethod, Request, Response},
};
pub struct TenantCodeService;
impl Service for TenantCodeService {
    fn uri() -> &'static str {
        "/tenant/code"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let code = match query_str(&req, "code") {
            Some(v) => v,
            None => return err::bad_request("missing code"),
        };
        match TenantDao::find_by_code(pool(), &code).await {
            Ok(Some(t)) => ok(t),
            Ok(None) => err::not_found("tenant not found"),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
