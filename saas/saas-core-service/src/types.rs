use std::collections::HashMap;
use std::fmt;
use std::str::FromStr;
// HTTP status code
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
#[repr(u16)]
pub enum HttpStatus {
    // 1xx Informational
    Continue = 100,
    SwitchingProtocols = 101,
    Processing = 102,
    // 2xx Success
    Ok = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    // 3xx Redirection
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    // 4xx Client Error
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PayloadTooLarge = 413,
    UnsupportedMediaType = 415,
    UnprocessableEntity = 422,
    TooManyRequests = 429,
    // 5xx Server Error
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
}
impl HttpStatus {
    /// Return the numeric status code.
    pub fn as_u16(&self) -> u16 {
        *self as u16
    }
    /// Convert from a numeric code.
    pub fn from_u16(code: u16) -> Option<Self> {
        match code {
            100 => Some(HttpStatus::Continue),
            101 => Some(HttpStatus::SwitchingProtocols),
            102 => Some(HttpStatus::Processing),
            200 => Some(HttpStatus::Ok),
            201 => Some(HttpStatus::Created),
            202 => Some(HttpStatus::Accepted),
            203 => Some(HttpStatus::NonAuthoritativeInformation),
            204 => Some(HttpStatus::NoContent),
            205 => Some(HttpStatus::ResetContent),
            206 => Some(HttpStatus::PartialContent),
            300 => Some(HttpStatus::MultipleChoices),
            301 => Some(HttpStatus::MovedPermanently),
            302 => Some(HttpStatus::Found),
            303 => Some(HttpStatus::SeeOther),
            304 => Some(HttpStatus::NotModified),
            307 => Some(HttpStatus::TemporaryRedirect),
            308 => Some(HttpStatus::PermanentRedirect),
            400 => Some(HttpStatus::BadRequest),
            401 => Some(HttpStatus::Unauthorized),
            402 => Some(HttpStatus::PaymentRequired),
            403 => Some(HttpStatus::Forbidden),
            404 => Some(HttpStatus::NotFound),
            405 => Some(HttpStatus::MethodNotAllowed),
            406 => Some(HttpStatus::NotAcceptable),
            408 => Some(HttpStatus::RequestTimeout),
            409 => Some(HttpStatus::Conflict),
            410 => Some(HttpStatus::Gone),
            411 => Some(HttpStatus::LengthRequired),
            413 => Some(HttpStatus::PayloadTooLarge),
            415 => Some(HttpStatus::UnsupportedMediaType),
            422 => Some(HttpStatus::UnprocessableEntity),
            429 => Some(HttpStatus::TooManyRequests),
            500 => Some(HttpStatus::InternalServerError),
            501 => Some(HttpStatus::NotImplemented),
            502 => Some(HttpStatus::BadGateway),
            503 => Some(HttpStatus::ServiceUnavailable),
            504 => Some(HttpStatus::GatewayTimeout),
            _ => None,
        }
    }
    /// Whether this status code is successful (2xx).
    pub fn is_success(&self) -> bool {
        let c = self.as_u16();
        (200..300).contains(&c)
    }
    /// Whether this status code is a client error (4xx).
    pub fn is_client_error(&self) -> bool {
        let c = self.as_u16();
        (400..500).contains(&c)
    }
    /// Whether this status code is a server error (5xx).
    pub fn is_server_error(&self) -> bool {
        let c = self.as_u16();
        (500..600).contains(&c)
    }
    /// The canonical reason phrase, e.g. "Not Found".
    pub fn reason(&self) -> &'static str {
        match self {
            HttpStatus::Continue => "Continue",
            HttpStatus::SwitchingProtocols => "Switching Protocols",
            HttpStatus::Processing => "Processing",
            HttpStatus::Ok => "OK",
            HttpStatus::Created => "Created",
            HttpStatus::Accepted => "Accepted",
            HttpStatus::NonAuthoritativeInformation => "Non-Authoritative Information",
            HttpStatus::NoContent => "No Content",
            HttpStatus::ResetContent => "Reset Content",
            HttpStatus::PartialContent => "Partial Content",
            HttpStatus::MultipleChoices => "Multiple Choices",
            HttpStatus::MovedPermanently => "Moved Permanently",
            HttpStatus::Found => "Found",
            HttpStatus::SeeOther => "See Other",
            HttpStatus::NotModified => "Not Modified",
            HttpStatus::TemporaryRedirect => "Temporary Redirect",
            HttpStatus::PermanentRedirect => "Permanent Redirect",
            HttpStatus::BadRequest => "Bad Request",
            HttpStatus::Unauthorized => "Unauthorized",
            HttpStatus::PaymentRequired => "Payment Required",
            HttpStatus::Forbidden => "Forbidden",
            HttpStatus::NotFound => "Not Found",
            HttpStatus::MethodNotAllowed => "Method Not Allowed",
            HttpStatus::NotAcceptable => "Not Acceptable",
            HttpStatus::RequestTimeout => "Request Timeout",
            HttpStatus::Conflict => "Conflict",
            HttpStatus::Gone => "Gone",
            HttpStatus::LengthRequired => "Length Required",
            HttpStatus::PayloadTooLarge => "Payload Too Large",
            HttpStatus::UnsupportedMediaType => "Unsupported Media Type",
            HttpStatus::UnprocessableEntity => "Unprocessable Entity",
            HttpStatus::TooManyRequests => "Too Many Requests",
            HttpStatus::InternalServerError => "Internal Server Error",
            HttpStatus::NotImplemented => "Not Implemented",
            HttpStatus::BadGateway => "Bad Gateway",
            HttpStatus::ServiceUnavailable => "Service Unavailable",
            HttpStatus::GatewayTimeout => "Gateway Timeout",
        }
    }
}
impl fmt::Display for HttpStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} {}", self.as_u16(), self.reason())
    }
}
impl FromStr for HttpStatus {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.parse::<u16>() {
            Ok(code) => {
                HttpStatus::from_u16(code).ok_or_else(|| format!("unknown HTTP status: {}", code))
            }
            Err(_) => Err(format!("invalid HTTP status string: {}", s)),
        }
    }
}
impl TryFrom<&str> for HttpStatus {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        s.parse()
    }
}
impl TryFrom<u16> for HttpStatus {
    type Error = String;
    fn try_from(code: u16) -> Result<Self, Self::Error> {
        HttpStatus::from_u16(code).ok_or_else(|| format!("unknown HTTP status: {}", code))
    }
}
// Existing HttpMethod
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum HttpMethod {
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Head,
    Options,
    Trace,
    Connect,
}
impl fmt::Display for HttpMethod {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            HttpMethod::Get => "GET",
            HttpMethod::Post => "POST",
            HttpMethod::Put => "PUT",
            HttpMethod::Delete => "DELETE",
            HttpMethod::Patch => "PATCH",
            HttpMethod::Head => "HEAD",
            HttpMethod::Options => "OPTIONS",
            HttpMethod::Trace => "TRACE",
            HttpMethod::Connect => "CONNECT",
        };
        write!(f, "{}", s)
    }
}
impl FromStr for HttpMethod {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let upper = s.to_uppercase();
        if upper == "GET" {
            return Ok(HttpMethod::Get);
        }
        if upper == "POST" {
            return Ok(HttpMethod::Post);
        }
        if upper == "PUT" {
            return Ok(HttpMethod::Put);
        }
        if upper == "DELETE" {
            return Ok(HttpMethod::Delete);
        }
        if upper == "PATCH" {
            return Ok(HttpMethod::Patch);
        }
        if upper == "HEAD" {
            return Ok(HttpMethod::Head);
        }
        if upper == "OPTIONS" {
            return Ok(HttpMethod::Options);
        }
        if upper == "TRACE" {
            return Ok(HttpMethod::Trace);
        }
        if upper == "CONNECT" {
            return Ok(HttpMethod::Connect);
        }
        Err(format!("未知的 HTTP 方法: {}", upper))
    }
}
impl TryFrom<&str> for HttpMethod {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        s.parse()
    }
}
/// Unified global Request type
#[derive(Debug, Clone)]
pub struct Request {
    /// HTTP method
    pub method: HttpMethod,
    /// Request path, e.g. /users/1
    pub path: String,
    /// Query parameters, e.g. ?page=1&size=10
    pub query: HashMap<String, String>,
    /// Request headers (keys are lowercase)
    pub headers: HashMap<String, String>,
    /// Request body
    pub body: Vec<u8>,
}
impl Request {
    /// Create an empty request
    pub fn new(method: HttpMethod, path: impl Into<String>) -> Self {
        Self {
            method,
            path: path.into(),
            query: HashMap::new(),
            headers: HashMap::new(),
            body: Vec::new(),
        }
    }
    /// Builder-style: set body
    pub fn with_body(mut self, body: impl Into<Vec<u8>>) -> Self {
        self.body = body.into();
        self
    }
    /// Builder-style: set header
    pub fn with_header(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.headers.insert(key.into().to_lowercase(), value.into());
        self
    }
    /// Get a header (case-insensitive)
    pub fn header(&self, key: &str) -> Option<&String> {
        self.headers.get(&key.to_lowercase())
    }
    /// Parse body as UTF-8 string
    pub fn body_str(&self) -> Result<&str, std::str::Utf8Error> {
        std::str::from_utf8(&self.body)
    }
}
/// Unified global Response type
#[derive(Debug, Clone)]
pub struct Response {
    /// HTTP status code
    pub status: HttpStatus,
    /// Response headers (keys are lowercase)
    pub headers: HashMap<String, String>,
    /// Response body
    pub body: Vec<u8>,
}
impl Response {
    /// Create an empty response with the given status
    pub fn new(status: HttpStatus) -> Self {
        Self {
            status,
            headers: HashMap::new(),
            body: Vec::new(),
        }
    }
    /// 200 OK with a text body
    pub fn ok(body: impl Into<Vec<u8>>) -> Self {
        Self::new(HttpStatus::Ok).with_body(body)
    }
    /// 201 Created
    pub fn created(body: impl Into<Vec<u8>>) -> Self {
        Self::new(HttpStatus::Created).with_body(body)
    }
    /// 204 No Content
    pub fn no_content() -> Self {
        Self::new(HttpStatus::NoContent)
    }
    /// 400 Bad Request
    pub fn bad_request(msg: impl Into<Vec<u8>>) -> Self {
        Self::new(HttpStatus::BadRequest).with_body(msg)
    }
    /// 401 Unauthorized
    pub fn unauthorized(msg: impl Into<Vec<u8>>) -> Self {
        Self::new(HttpStatus::Unauthorized).with_body(msg)
    }
    /// 403 Forbidden
    pub fn forbidden(msg: impl Into<Vec<u8>>) -> Self {
        Self::new(HttpStatus::Forbidden).with_body(msg)
    }
    /// 404 Not Found
    pub fn not_found() -> Self {
        Self::new(HttpStatus::NotFound).with_body("Not Found")
    }
    /// 500 Internal Server Error
    pub fn internal_error(msg: impl Into<Vec<u8>>) -> Self {
        Self::new(HttpStatus::InternalServerError).with_body(msg)
    }
    /// Builder-style: set body
    pub fn with_body(mut self, body: impl Into<Vec<u8>>) -> Self {
        self.body = body.into();
        self
    }
    /// Builder-style: set header
    pub fn with_header(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.headers.insert(key.into().to_lowercase(), value.into());
        self
    }
    /// Get a header (case-insensitive)
    pub fn header(&self, key: &str) -> Option<&String> {
        self.headers.get(&key.to_lowercase())
    }
    /// Parse body as UTF-8 string
    pub fn body_str(&self) -> Result<&str, std::str::Utf8Error> {
        std::str::from_utf8(&self.body)
    }
}
