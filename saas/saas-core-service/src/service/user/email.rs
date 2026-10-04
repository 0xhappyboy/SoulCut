use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_str},
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};

pub struct UserEmailService;

impl Service for UserEmailService {
    fn uri() -> &'static str {
        "/user/email"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let email = match query_str(&req, "email") {
            Some(v) => v,
            None => return err::bad_request("missing email"),
        };
        match UserDao::find_by_email(pool(), &email).await {
            Ok(Some(u)) => ok(UserBo::from_do(u)),
            Ok(None) => err::not_found("user not found"),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
