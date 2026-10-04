use crate::{
    config::AppConfig,
    dao::init_pool,
    registry::{ServiceEntry, ServiceRegistry},
    service::all_services,
    types::{HttpMethod, HttpStatus, Request},
};
use axum::http::HeaderValue;
use log::{error, info, warn};
use tower_http::cors::{AllowOrigin, Any, CorsLayer};
/// Load application configuration.
pub fn init_config() -> AppConfig {
    AppConfig::load()
}
/// Initialize the logger.
pub fn init_logger() {
    // Only initialize once; ignore the result if already set.
    let _ = env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .try_init();
}
/// Initialize the global MySQL connection pool.
pub async fn init_database(config: &AppConfig) {
    if let Err(e) = init_pool(config).await {
        error!("failed to init MySQL pool: {}", e);
        panic!("failed to init MySQL pool: {}", e);
    }
    info!("MySQL pool initialized");
}
/// Build the CORS layer from the configured allowed origins.
fn build_cors(config: &AppConfig) -> CorsLayer {
    let allows_any = config.cors_allowed_origins.iter().any(|o| o == "*");
    let origin = if allows_any {
        // Development default: allow everything.
        AllowOrigin::any()
    } else {
        let parsed: Vec<HeaderValue> = config
            .cors_allowed_origins
            .iter()
            .filter_map(|o| match o.parse::<HeaderValue>() {
                Ok(v) => Some(v),
                Err(_) => {
                    warn!("invalid CORS origin {:?}, ignoring", o);
                    None
                }
            })
            .collect();
        if parsed.is_empty() {
            // All entries were invalid; fall back to any to avoid
            // silently blocking every request.
            warn!("no valid CORS origins parsed, falling back to any");
            AllowOrigin::any()
        } else {
            AllowOrigin::list(parsed)
        }
    };
    CorsLayer::new()
        .allow_origin(origin)
        .allow_methods(Any)
        .allow_headers(Any)
}
/// Build the axum Router by mounting every registered service.
pub fn init_router(config: &AppConfig) -> axum::Router {
    let registry: ServiceRegistry = all_services();
    let count = registry.entries().len();
    let mut app = axum::Router::new();
    for entry in registry.entries() {
        app = mount(app, entry);
    }
    app = app.layer(build_cors(config));
    info!("mounted {} services", count);
    app
}
/// Bind a TCP listener on the given address.
pub async fn init_listener(bind_addr: &str) -> tokio::net::TcpListener {
    match tokio::net::TcpListener::bind(bind_addr).await {
        Ok(l) => l,
        Err(e) => {
            error!("failed to bind {}: {}", bind_addr, e);
            panic!("failed to bind {}: {}", bind_addr, e);
        }
    }
}
/// run server
pub async fn run_server() {
    // logger (must be first so all later logs are captured)
    init_logger();
    // config
    let config = init_config();
    let bind_addr = config.bind_addr();
    // database
    init_database(&config).await;
    // router
    let app = init_router(&config);
    // listener
    let listener = init_listener(&bind_addr).await;
    // serve
    info!("listening on http://{}", bind_addr);
    if let Err(e) = axum::serve(listener, app).await {
        error!("server error: {}", e);
    }
}
/// Mount a single service entry into the axum Router.
fn mount(app: axum::Router, entry: &ServiceEntry) -> axum::Router {
    use axum::routing::{delete, get, patch, post, put};
    let method = entry.method;
    let uri = entry.uri;
    let handler_fn = entry.handler;
    // `handler` is `async move`, reads real method/path/query/body/headers.
    let handler = move |axum_req: axum::extract::Request| async move {
        let (parts, body) = axum_req.into_parts();
        // Read the body bytes.
        let bytes = match axum::body::to_bytes(body, usize::MAX).await {
            Ok(b) => b,
            Err(e) => {
                error!("failed to read body: {}", e);
                // Use HttpStatus enum instead of a raw 400.
                return axum::response::Response::builder()
                    .status(HttpStatus::BadRequest.as_u16())
                    .body(axum::body::Body::from(format!(
                        "failed to read body: {}",
                        e
                    )))
                    .unwrap();
            }
        };
        // Build our unified Request.
        let mut req = Request::new(method, parts.uri.path().to_string());
        req.body = bytes.to_vec();
        // Query parameters.
        if let Some(q) = parts.uri.query() {
            for (k, v) in url::form_urlencoded::parse(q.as_bytes()) {
                req.query.insert(k.into_owned(), v.into_owned());
            }
        }
        // Headers (lowercase keys).
        for (k, v) in parts.headers.iter() {
            if let Ok(s) = v.to_str() {
                req.headers.insert(k.as_str().to_string(), s.to_string());
            }
        }
        // Invoke the registered async handler.
        let resp = handler_fn(req).await;
        // Build the axum response.
        // resp.status is HttpStatus; convert to u16 for axum.
        let mut b = axum::response::Response::builder().status(resp.status.as_u16());
        for (k, v) in &resp.headers {
            b = b.header(k, v);
        }
        b.body(axum::body::Body::from(resp.body)).unwrap()
    };
    match method {
        HttpMethod::Get => app.route(uri, get(handler)),
        HttpMethod::Post => app.route(uri, post(handler)),
        HttpMethod::Put => app.route(uri, put(handler)),
        HttpMethod::Delete => app.route(uri, delete(handler)),
        HttpMethod::Patch => app.route(uri, patch(handler)),
        _ => app.route(uri, axum::routing::any(handler)),
    }
}
