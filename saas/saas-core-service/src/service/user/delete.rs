use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_u64},
    },
    types::{HttpMethod, Request, Response},
};
use serde_json::json;
pub struct UserDeleteService;
impl Service for UserDeleteService {
    fn uri() -> &'static str {
        "/user/delete"
    }
    fn method() -> HttpMethod {
        HttpMethod::Delete
    }
    async fn handle(req: Request) -> Response {
        let id = match query_u64(&req, "id") {
            Some(v) => v,
            None => return err::bad_request("missing id"),
        };
        match UserDao::delete(pool(), id).await {
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
