use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_str},
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};
pub struct UserPhoneService;
impl Service for UserPhoneService {
    fn uri() -> &'static str {
        "/user/phone"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let phone = match query_str(&req, "phone") {
            Some(v) => v,
            None => return err::bad_request("missing phone"),
        };
        match UserDao::find_by_phone(pool(), &phone).await {
            Ok(Some(u)) => ok(UserBo::from_do(u)),
            Ok(None) => err::not_found("user not found"),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
