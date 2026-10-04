use crate::{
    dao::{CreateTenant, TenantDao, pool},
    service::{
        Service,
        common::http::{err, ok, parse_time},
    },
    types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
#[derive(Debug, Deserialize)]
pub struct CreateTenantReq {
    pub name: String,
    pub code: String,
    pub contact: Option<String>,
    pub phone: Option<String>,
    pub status: Option<i8>,
    pub plan_id: Option<u64>,
    pub expire_time: Option<String>,
}
pub struct TenantCreateService;
impl Service for TenantCreateService {
    fn uri() -> &'static str {
        "/tenant/create"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        let input: CreateTenantReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        let payload = CreateTenant {
            name: input.name,
            code: input.code,
            contact: input.contact,
            phone: input.phone,
            status: input.status.unwrap_or(1),
            plan_id: input.plan_id.unwrap_or(0),
            expire_time: parse_time(&input.expire_time),
        };
        match TenantDao::create(pool(), &payload).await {
            Ok(id) => ok(json!({ "id": id })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
