use crate::{
    dao::{UserDao, pool},
    service::{
        Service,
        common::{
            auth::extract_claims,
            http::{err, ok},
        },
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};
/// GET /user/me
pub struct UserMeService;
impl Service for UserMeService {
    fn uri() -> &'static str {
        "/user/me"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        // Verify token, get claims.
        let claims = match extract_claims(&req) {
            Ok(c) => c,
            Err(_) => return err::unauthorized("invalid or missing token"),
        };
        // Parse user id from claims.sub.
        let user_id: u64 = match claims.sub.parse() {
            Ok(v) => v,
            Err(_) => return err::unauthorized("invalid token subject"),
        };
        // oad the user from DB (DO).
        let user_do = match UserDao::find_by_id(pool(), user_id).await {
            Ok(Some(u)) => u,
            Ok(None) => return err::not_found("user not found"),
            Err(e) => return err::internal(&format!("db error: {}", e)),
        };
        // Convert to BO and return.
        let user_bo = UserBo::from_do(user_do);
        ok(user_bo)
    }
}
