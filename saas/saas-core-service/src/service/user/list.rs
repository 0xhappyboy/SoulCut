use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::http::{err, ok, query_u64},
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};
pub struct UserListService;
impl Service for UserListService {
    fn uri() -> &'static str {
        "/user/list"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let offset = query_u64(&req, "offset").unwrap_or(0);
        let limit = query_u64(&req, "limit").unwrap_or(20);
        match UserDao::list(pool(), offset, limit).await {
            Ok(rows) => {
                let bos: Vec<UserBo> = rows.into_iter().map(UserBo::from_do).collect();
                ok(bos)
            }
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
