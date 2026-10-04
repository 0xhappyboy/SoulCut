use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_str},
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};
pub struct UserUsernameService;
impl Service for UserUsernameService {
    fn uri() -> &'static str {
        "/user/username"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let username = match query_str(&req, "username") {
            Some(v) => v,
            None => return err::bad_request("missing username"),
        };
        match UserDao::find_by_username(pool(), &username).await {
            Ok(Some(u)) => ok(UserBo::from_do(u)),
            Ok(None) => err::not_found("user not found"),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
