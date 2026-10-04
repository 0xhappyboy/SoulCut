use crate::types::{HttpStatus, Request, Response};
use serde::Serialize;
use serde_json::json;
/// Build a 200 OK JSON response with code=0.
pub fn ok<T: Serialize>(data: T) -> Response {
    let body = serde_json::to_vec(&json!({
        "code": 0,
        "message": "ok",
        "data": data,
    }))
    .unwrap_or_else(|_| b"{\"code\":0,\"message\":\"ok\",\"data\":null}".to_vec());
    Response::new(HttpStatus::Ok)
        .with_header("content-type", "application/json")
        .with_body(body)
}
/// Build an error JSON response with the given HTTP status.
pub fn fail(status: HttpStatus, msg: &str) -> Response {
    let body = serde_json::to_vec(&json!({
        "code": status.as_u16() as i32,
        "message": msg,
        "data": serde_json::Value::Null,
    }))
    .unwrap_or_else(|_| b"{}".to_vec());
    Response::new(status)
        .with_header("content-type", "application/json")
        .with_body(body)
}
/// Parse a query parameter as u64.
pub fn query_u64(req: &Request, key: &str) -> Option<u64> {
    req.query.get(key).and_then(|v| v.parse::<u64>().ok())
}
/// Parse a query parameter as i8.
pub fn query_i8(req: &Request, key: &str) -> Option<i8> {
    req.query.get(key).and_then(|v| v.parse::<i8>().ok())
}
/// Parse a query parameter as String.
pub fn query_str(req: &Request, key: &str) -> Option<String> {
    req.query.get(key).cloned()
}
/// Parse an RFC3339 string into a UTC DateTime.
pub fn parse_time(s: &Option<String>) -> Option<chrono::DateTime<chrono::Utc>> {
    s.as_ref().and_then(|v| {
        chrono::DateTime::parse_from_rfc3339(v)
            .ok()
            .map(|dt| dt.with_timezone(&chrono::Utc))
    })
}
/// Shorthand helpers for the most common error responses.
pub mod err {
    use super::*;
    pub fn bad_request(msg: &str) -> Response {
        fail(HttpStatus::BadRequest, msg)
    }
    pub fn unauthorized(msg: &str) -> Response {
        fail(HttpStatus::Unauthorized, msg)
    }
    pub fn payment_required(msg: &str) -> Response {
        fail(HttpStatus::PaymentRequired, msg)
    }
    pub fn forbidden(msg: &str) -> Response {
        fail(HttpStatus::Forbidden, msg)
    }
    pub fn not_found(msg: &str) -> Response {
        fail(HttpStatus::NotFound, msg)
    }
    pub fn conflict(msg: &str) -> Response {
        fail(HttpStatus::Conflict, msg)
    }
    pub fn unprocessable(msg: &str) -> Response {
        fail(HttpStatus::UnprocessableEntity, msg)
    }
    pub fn too_many_requests(msg: &str) -> Response {
        fail(HttpStatus::TooManyRequests, msg)
    }
    pub fn internal(msg: &str) -> Response {
        fail(HttpStatus::InternalServerError, msg)
    }
}
