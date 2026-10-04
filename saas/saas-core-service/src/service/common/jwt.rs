use chrono::{Duration, Utc};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use std::sync::Once;
/// JWT claims carried inside the token.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    /// Subject: user id
    pub sub: String,
    /// Username
    pub username: String,
    /// Tenant id (0 = personal)
    pub tenant_id: u64,
    /// Role code, e.g. "TENANT_USER"
    pub role: String,
    /// Issued at (unix seconds)
    pub iat: i64,
    /// Expiration (unix seconds)
    pub exp: i64,
}
/// Default secret used when `JWT_SECRET` is not set.
const DEV_SECRET: &str = "dev-secret-change-me";
/// Ensures the "JWT_SECRET not set" warning is emitted only once.
static WARN_ONCE: Once = Once::new();
/// Read the JWT secret from env, fall back to a dev default.
fn secret() -> String {
    match std::env::var("JWT_SECRET") {
        Ok(v) => v,
        Err(_) => {
            WARN_ONCE.call_once(|| {
                log::warn!(
                    "JWT_SECRET is not set; using the insecure development \
                     fallback secret. Set JWT_SECRET in production."
                );
            });
            DEV_SECRET.to_string()
        }
    }
}
/// Issue a JWT for the given user/tenant/role. Valid for 7 days.
pub fn issue_token(user_id: u64, username: &str, tenant_id: u64, role: &str) -> String {
    let now = Utc::now();
    let exp = now + Duration::days(7);
    let claims = Claims {
        sub: user_id.to_string(),
        username: username.to_string(),
        tenant_id,
        role: role.to_string(),
        iat: now.timestamp(),
        exp: exp.timestamp(),
    };
    encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(secret().as_bytes()),
    )
    .expect("jwt encode failed")
}
/// Verify a JWT and return its claims.
pub fn verify_token(token: &str) -> Result<Claims, String> {
    let validation = Validation::new(Algorithm::HS256);
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret().as_bytes()),
        &validation,
    )
    .map(|data| data.claims)
    .map_err(|e| format!("invalid token: {}", e))
}
