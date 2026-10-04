use bcrypt::{DEFAULT_COST, hash, verify};
/// Hash a plaintext password with bcrypt (auto-salted, slow by design).
pub fn hash_password(raw: &str) -> String {
    hash(raw, DEFAULT_COST).expect("bcrypt hash failed")
}
/// Verify a plaintext password against a stored bcrypt hash.
/// Constant-time internally; safe against timing attacks.
pub fn verify_password(raw: &str, stored: &str) -> bool {
    verify(raw, stored).unwrap_or(false)
}
