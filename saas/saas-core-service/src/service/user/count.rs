use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok},
    },
    types::{HttpMethod, Request, Response},
};
use serde_json::json;
pub struct UserCountService;
impl Service for UserCountService {
    fn uri() -> &'static str {
        "/user/count"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(_req: Request) -> Response {
        match UserDao::count(pool()).await {
            Ok(n) => ok(json!({ "count": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
