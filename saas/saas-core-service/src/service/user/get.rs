use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_u64},
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};

pub struct UserGetService;

impl Service for UserGetService {
    fn uri() -> &'static str {
        "/user/get"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let id = match query_u64(&req, "id") {
            Some(v) => v,
            None => return err::bad_request("missing id"),
        };
        match UserDao::find_by_id(pool(), id).await {
            Ok(Some(u)) => ok(UserBo::from_do(u)),
            Ok(None) => err::not_found("user not found"),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
