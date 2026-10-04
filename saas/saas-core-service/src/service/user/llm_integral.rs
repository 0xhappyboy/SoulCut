use crate::{
    dao::{UserLlmIntegralDao, pool},
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
/// GET /user/llm/integral
///
/// Return the integral record of the authenticated user.
pub struct UserLlmIntegralGetService;
impl Service for UserLlmIntegralGetService {
    fn uri() -> &'static str {
        "/user/llm/integral"
    }
    fn method() -> HttpMethod {
        HttpMethod::Get
    }
    async fn handle(req: Request) -> Response {
        let user_id = match auth_user_id(&req) {
            Ok(v) => v,
            Err(resp) => return resp,
        };
        match UserLlmIntegralDao::find_by_user(pool(), user_id).await {
            Ok(Some(row)) => ok(row),
            Ok(None) => ok(json!({
                "user_id": user_id,
                "integral": 0,
                "total_recharge": 0,
                "total_consume": 0,
                "exists": false,
            })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// POST /user/llm/integral/add
#[derive(Debug, Deserialize)]
pub struct AddIntegralReq {
    pub user_id: u64,
    pub amount: u64,
}
pub struct UserLlmIntegralAddService;
impl Service for UserLlmIntegralAddService {
    fn uri() -> &'static str {
        "/user/llm/integral/add"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        if let Err(resp) = ensure_super_admin(&req) {
            return resp;
        }
        let input: AddIntegralReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        if input.amount == 0 {
            return err::bad_request("amount must be greater than 0");
        }
        match UserLlmIntegralDao::add_integral(pool(), input.user_id, input.amount).await {
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
/// POST /user/llm/integral/deduct
#[derive(Debug, Deserialize)]
pub struct DeductIntegralReq {
    pub user_id: u64,
    pub amount: u64,
}
pub struct UserLlmIntegralDeductService;
impl Service for UserLlmIntegralDeductService {
    fn uri() -> &'static str {
        "/user/llm/integral/deduct"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        if let Err(resp) = ensure_super_admin(&req) {
            return resp;
        }
        let input: DeductIntegralReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        if input.amount == 0 {
            return err::bad_request("amount must be greater than 0");
        }
        match UserLlmIntegralDao::deduct_integral(pool(), input.user_id, input.amount).await {
            Ok(0) => err::conflict("insufficient integral or no record"),
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
