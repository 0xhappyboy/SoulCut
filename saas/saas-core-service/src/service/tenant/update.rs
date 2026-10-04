use crate::{
    dao::{TenantDao, UpdateTenant, pool},
    service::{
        Service,
        common::http::{err, ok, parse_time, query_u64},
    },
    types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
#[derive(Debug, Deserialize)]
pub struct UpdateTenantReq {
    pub name: Option<String>,
    pub contact: Option<String>,
    pub phone: Option<String>,
    pub status: Option<i8>,
    pub plan_id: Option<u64>,
    pub expire_time: Option<String>,
}
pub struct TenantUpdateService;
impl Service for TenantUpdateService {
    fn uri() -> &'static str {
        "/tenant/update"
    }
    fn method() -> HttpMethod {
        HttpMethod::Put
    }
    async fn handle(req: Request) -> Response {
        let id = match query_u64(&req, "id") {
            Some(v) => v,
            None => return err::bad_request("missing id"),
        };
        let input: UpdateTenantReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        let payload = UpdateTenant {
            name: input.name,
            contact: input.contact,
            phone: input.phone,
            status: input.status,
            plan_id: input.plan_id,
            expire_time: parse_time(&input.expire_time),
        };
        match TenantDao::update(pool(), id, &payload).await {
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
