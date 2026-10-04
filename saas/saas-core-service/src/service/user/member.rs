use crate::{
    dao::{UserMemberDao, pool},
    service::{
        Service,
        common::{
            auth::extract_claims,
            http::{err, ok},
        },
    },
    types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
/// Extract the authenticated user id from the request's JWT.
fn auth_user_id(req: &Request) -> Result<u64, Response> {
    let claims = extract_claims(req).map_err(|_| err::unauthorized("invalid or missing token"))?;
    claims
        .sub
        .parse::<u64>()
        .map_err(|_| err::unauthorized("invalid token subject"))
}
/// Ensure the caller is a platform super administrator.
fn ensure_super_admin(req: &Request) -> Result<(), Response> {
    let claims = extract_claims(req).map_err(|_| err::unauthorized("invalid or missing token"))?;
    if claims.role != "SUPER_ADMIN" {
        return Err(err::forbidden("super admin only"));
    }
    Ok(())
}
/// GET /user/member
pub struct UserMemberGetService;
impl Service for UserMemberGetService {
    fn uri() -> &'static str {
        "/user/member"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        match UserMemberDao::find_by_user(pool(), user_id).await {
            Ok(Some(row)) => ok(row),
            Ok(None) => ok(json!({
                "user_id": user_id,
                "expire_at": 0,
                "exists": false,
            })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// POST /user/member/set
#[derive(Debug, Deserialize)]
pub struct SetMemberReq {
    pub user_id: u64,
    pub expire_at: u64,
}
pub struct UserMemberSetService;
impl Service for UserMemberSetService {
    fn uri() -> &'static str {
        "/user/member/set"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        if let Err(resp) = ensure_super_admin(&req) {
            return resp;
        }
        let input: SetMemberReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        match UserMemberDao::set_expire_at(pool(), input.user_id, input.expire_at).await {
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
