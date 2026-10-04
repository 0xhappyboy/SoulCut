use crate::{
    dao::{RoleDao, UserDao, pool},
    service::{
        Service,
        common::{
            check_allowed,
            http::{err, ok},
            jwt::issue_token,
            password::verify_password,
            record_failure, record_success,
        },
        types::UserRoleCode,
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
/// A freshly registered user has no tenant binding yet.
const NO_TENANT_ID: u64 = 0;
/// System-level roles are stored with tenant_id = 0.
const SYSTEM_TENANT_ID: u64 = 0;
#[derive(Debug, Deserialize)]
pub struct LoginReq {
    pub username: String,
    pub password: String,
}
pub struct UserLoginService;
impl Service for UserLoginService {
    fn uri() -> &'static str {
        "/user/login"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        let input: LoginReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        // Brute-force guard.
        if let Err(remain) = check_allowed(&input.username) {
            return err::too_many_requests(&format!(
                "too many failed attempts, try again in {} seconds",
                remain
            ));
        }
        // Look up user.
        let user = match UserDao::find_by_username(pool(), &input.username).await {
            Ok(Some(u)) => u,
            Ok(None) => {
                record_failure(&input.username);
                return err::unauthorized("invalid username or password");
            }
            Err(e) => return err::internal(&format!("db error: {}", e)),
        };
        // Verify password.
        if !verify_password(&input.password, &user.password) {
            record_failure(&input.username);
            return err::unauthorized("invalid username or password");
        }
        // Reject disabled users.
        if user.status != 1 {
            return err::forbidden("user is disabled");
        }
        // Resolve tenant + role.
        let tenant_id = NO_TENANT_ID;
        let role = match RoleDao::list_roles_by_user(pool(), SYSTEM_TENANT_ID, user.id).await {
            Ok(roles) if !roles.is_empty() => roles[0].code.clone(),
            _ => UserRoleCode::TenantUser.as_str().to_string(),
        };
        // Clear failure counter.
        record_success(&input.username);
        // Record last login (best-effort; ignore errors).
        let client_ip = req.header("x-forwarded-for").cloned();
        let _ = UserDao::update_last_login(pool(), user.id, client_ip.as_deref()).await;
        // Issue JWT.
        let token = issue_token(user.id, &user.username, tenant_id, &role);
        // Convert to BO for the response.
        let user_bo = UserBo::from_do(user);
        ok(json!({
            "token": token,
            "user": user_bo,
            "tenant_id": tenant_id,
            "role": role,
        }))
    }
}
