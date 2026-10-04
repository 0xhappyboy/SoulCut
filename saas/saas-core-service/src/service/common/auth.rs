use crate::service::common::jwt::{Claims, verify_token};
use crate::types::Request;
/// Extract and verify the JWT from the request.
pub fn extract_claims(req: &Request) -> Result<Claims, String> {
    let token = extract_token(req).ok_or_else(|| "missing token".to_string())?;
    verify_token(&token)
}
/// Locate the raw token string in the request.
fn extract_token(req: &Request) -> Option<String> {
    // Authorization: Bearer <token>
    if let Some(v) = req.header("authorization") {
        let trimmed = v.trim();
        if let Some(t) = trimmed.strip_prefix("Bearer ") {
            return Some(t.trim().to_string());
        }
        if let Some(t) = trimmed.strip_prefix("bearer ") {
            return Some(t.trim().to_string());
        }
    }
    // Cookie: token=<token>
    if let Some(cookie) = req.header("cookie") {
        for pair in cookie.split(';') {
            let pair = pair.trim();
            if let Some(t) = pair.strip_prefix("token=") {
                return Some(t.to_string());
            }
        }
    }
    None
}
