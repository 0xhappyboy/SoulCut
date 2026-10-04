use crate::{
    dao::{CreateUser, RoleDao, UserDao, pool}, service::{
        Service, common::{http::{err, ok}, password::hash_password}, types::UserRoleCode,
    }, types::{HttpMethod, Request, Response},
};
use serde::Deserialize;
use serde_json::json;
/// System-level roles are stored with tenant_id = 0.
const SYSTEM_TENANT_ID: u64 = 0;
#[derive(Debug, Deserialize)]
pub struct RegisterReq {
    pub username: String,
    pub password: String,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
}
pub struct UserRegisterService;
impl Service for UserRegisterService {
    fn uri() -> &'static str {
        "/user/register"
    }
    fn method() -> HttpMethod {
        HttpMethod::Post
    }
    async fn handle(req: Request) -> Response {
        let input: RegisterReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        // Uniqueness check: username.
        match UserDao::find_by_username(pool(), &input.username).await {
            Ok(Some(_)) => return err::conflict("username already exists"),
            Ok(None) => {}
            Err(e) => return err::internal(&format!("db error: {}", e)),
        }
        // Uniqueness check: email (if provided).
        if let Some(email) = input.email.as_ref() {
            match UserDao::find_by_email(pool(), email).await {
                Ok(Some(_)) => return err::conflict("email already exists"),
                Ok(None) => {}
                Err(e) => return err::internal(&format!("db error: {}", e)),
            }
        }
        // Hash the password with bcrypt before storing.
        let payload = CreateUser {
            username: input.username.clone(),
            password: hash_password(&input.password),
            nickname: input.nickname,
            email: input.email,
            phone: input.phone,
            status: 1,
        };
        // Transaction: create user + bind default role.
        let mut tx = match pool().begin().await {
            Ok(t) => t,
            Err(e) => return err::internal(&format!("tx begin error: {}", e)),
        };
        // Create the user row.
        let user_id = match UserDao::create_tx(&mut tx, &payload).await {
            Ok(id) => id,
            Err(e) => {
                let _ = tx.rollback().await;
                return err::internal(&format!("db error: {}", e));
            }
        };
        // Look up the TENANT_USER role (system role, tenant_id = 0).
        let role = match RoleDao::find_by_tenant_and_code_tx(
            &mut tx,
            SYSTEM_TENANT_ID,
            UserRoleCode::TenantUser.as_str(),
        )
        .await
        {
            Ok(Some(r)) => r,
            Ok(None) => {
                let _ = tx.rollback().await;
                return err::internal("default role TENANT_USER not found");
            }
            Err(e) => {
                let _ = tx.rollback().await;
                return err::internal(&format!("db error: {}", e));
            }
        };
        // Bind the user to the role.
        if let Err(e) =
            RoleDao::bind_user_role_tx(&mut tx, SYSTEM_TENANT_ID, user_id, role.id).await
        {
            let _ = tx.rollback().await;
            return err::internal(&format!("bind role error: {}", e));
        }
        // Commit.
        if let Err(e) = tx.commit().await {
            return err::internal(&format!("tx commit error: {}", e));
        }
        ok(json!({
            "id": user_id,
            "username": input.username,
            "role": UserRoleCode::TenantUser.as_str(),
        }))
    }
}
