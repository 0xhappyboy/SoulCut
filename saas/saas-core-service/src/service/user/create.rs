use crate::{
    dao::{CreateUser, UserDao, pool},
    service::{
        Service,
        common::{
            hash_password,
            http::{err, ok},
        },
    },
    types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
#[derive(Debug, Deserialize)]
pub struct CreateUserReq {
    pub username: String,
    pub password: String,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub status: Option<i8>,
}
pub struct UserCreateService;
impl Service for UserCreateService {
    fn uri() -> &'static str {
        "/user/create"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        let input: CreateUserReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        match UserDao::find_by_username(pool(), &input.username).await {
            Ok(Some(_)) => return err::conflict("username already exists"),
            Ok(None) => {}
            Err(e) => return err::internal(&format!("db error: {}", e)),
        }
        let payload = CreateUser {
            username: input.username,
            password: hash_password(&input.password),
            nickname: input.nickname,
            email: input.email,
            phone: input.phone,
            status: input.status.unwrap_or(1),
        };
        match UserDao::create(pool(), &payload).await {
            Ok(id) => ok(json!({ "id": id })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
