use log::warn;
use std::env;
/// Global application configuration.
#[derive(Debug, Clone)]
pub struct AppConfig {
    /// Port the HTTP server listens on.
    pub port: u16,
    /// Bind address, e.g. "0.0.0.0".
    pub host: String,
    /// MySQL host
    pub mysql_host: String,
    /// MySQL port
    pub mysql_port: u16,
    /// MySQL user
    pub mysql_user: String,
    /// MySQL password
    pub mysql_password: String,
    /// MySQL database name
    pub mysql_name: String,
    /// Allowed CORS origins.
    ///
    /// `["*"]` (the dev default) means any origin. In production this
    /// should be set to the concrete frontend origins via the
    /// `CORS_ALLOWED_ORIGINS` env var (comma-separated).
    pub cors_allowed_origins: Vec<String>,
}
impl Default for AppConfig {
    fn default() -> Self {
        Self {
            port: 8080,
            host: "0.0.0.0".to_string(),
            mysql_host: "127.0.0.1".to_string(),
            mysql_port: 3306,
            mysql_user: "root".to_string(),
            mysql_password: "root123456".to_string(),
            mysql_name: "soulcut_saas_core_service".to_string(),
            cors_allowed_origins: vec!["*".to_string()],
        }
    }
}
impl AppConfig {
    /// Build config with priority:
    ///   1. command-line args (--port, --host, --mysql-host, ...)
    ///   2. environment variables (APP_PORT, APP_HOST, MYSQL_HOST, ...)
    ///   3. defaults
    pub fn load() -> Self {
        let mut cfg = Self::default();
        // ----- environment variables -----
        if let Ok(port) = env::var("APP_PORT") {
            match port.parse::<u16>() {
                Ok(p) => cfg.port = p,
                Err(_) => warn!("invalid APP_PORT={:?}, ignoring", port),
            }
        }
        if let Ok(host) = env::var("APP_HOST") {
            cfg.host = host;
        }
        if let Ok(v) = env::var("MYSQL_HOST") {
            cfg.mysql_host = v;
        }
        if let Ok(v) = env::var("MYSQL_PORT") {
            match v.parse::<u16>() {
                Ok(p) => cfg.mysql_port = p,
                Err(_) => warn!("invalid MYSQL_PORT={:?}, ignoring", v),
            }
        }
        if let Ok(v) = env::var("MYSQL_USER") {
            cfg.mysql_user = v;
        }
        if let Ok(v) = env::var("MYSQL_PASSWORD") {
            cfg.mysql_password = v;
        }
        if let Ok(v) = env::var("MYSQL_NAME") {
            cfg.mysql_name = v;
        }
        // CORS_ALLOWED_ORIGINS: comma-separated list.
        // "*" (default) allows any origin; production should set
        // concrete origins, e.g. "https://xxxx.com,https://xxx.com".
        if let Ok(v) = env::var("CORS_ALLOWED_ORIGINS") {
            let origins: Vec<String> = v
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect();
            if origins.is_empty() {
                warn!(
                    "CORS_ALLOWED_ORIGINS is set but empty, keeping default {:?}",
                    cfg.cors_allowed_origins
                );
            } else {
                cfg.cors_allowed_origins = origins;
            }
        }
        // ----- command-line args (highest priority) -----
        let args: Vec<String> = env::args().skip(1).collect();
        let mut i = 0;
        while i < args.len() {
            match args[i].as_str() {
                "--port" | "-p" => {
                    if let Some(v) = args.get(i + 1) {
                        match v.parse::<u16>() {
                            Ok(p) => cfg.port = p,
                            Err(_) => warn!("invalid --port={:?}, ignoring", v),
                        }
                        i += 2;
                    } else {
                        warn!("--port requires a value");
                        i += 1;
                    }
                }
                "--host" | "-h" => {
                    if let Some(v) = args.get(i + 1) {
                        cfg.host = v.clone();
                        i += 2;
                    } else {
                        warn!("--host requires a value");
                        i += 1;
                    }
                }
                "--mysql-host" => {
                    if let Some(v) = args.get(i + 1) {
                        cfg.mysql_host = v.clone();
                        i += 2;
                    } else {
                        warn!("--mysql-host requires a value");
                        i += 1;
                    }
                }
                "--mysql-port" => {
                    if let Some(v) = args.get(i + 1) {
                        match v.parse::<u16>() {
                            Ok(p) => cfg.mysql_port = p,
                            Err(_) => warn!("invalid --mysql-port={:?}, ignoring", v),
                        }
                        i += 2;
                    } else {
                        warn!("--mysql-port requires a value");
                        i += 1;
                    }
                }
                "--mysql-user" => {
                    if let Some(v) = args.get(i + 1) {
                        cfg.mysql_user = v.clone();
                        i += 2;
                    } else {
                        warn!("--mysql-user requires a value");
                        i += 1;
                    }
                }
                "--mysql-password" => {
                    if let Some(v) = args.get(i + 1) {
                        cfg.mysql_password = v.clone();
                        i += 2;
                    } else {
                        warn!("--mysql-password requires a value");
                        i += 1;
                    }
                }
                "--mysql-name" => {
                    if let Some(v) = args.get(i + 1) {
                        cfg.mysql_name = v.clone();
                        i += 2;
                    } else {
                        warn!("--mysql-name requires a value");
                        i += 1;
                    }
                }
                "--cors-origins" => {
                    if let Some(v) = args.get(i + 1) {
                        let origins: Vec<String> = v
                            .split(',')
                            .map(|s| s.trim().to_string())
                            .filter(|s| !s.is_empty())
                            .collect();
                        if origins.is_empty() {
                            warn!("--cors-origins requires at least one origin");
                        } else {
                            cfg.cors_allowed_origins = origins;
                        }
                        i += 2;
                    } else {
                        warn!("--cors-origins requires a value");
                        i += 1;
                    }
                }
                "--help" => {
                    print_help();
                    std::process::exit(0);
                }
                other => {
                    warn!("unknown argument: {}", other);
                    print_help();
                    std::process::exit(1);
                }
            }
        }
        cfg
    }
    /// HTTP bind address, e.g. "0.0.0.0:8080"
    pub fn bind_addr(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
    /// Build the MySQL connection URL from config fields.
    /// Format: mysql://user:password@host:port/db
    pub fn database_url(&self) -> String {
        format!(
            "mysql://{}:{}@{}:{}/{}",
            self.mysql_user, self.mysql_password, self.mysql_host, self.mysql_port, self.mysql_name
        )
    }
}
fn print_help() {
    log::info!(
        r#"Usage: app [OPTIONS]
Options:
  -p, --port <PORT>            Port to listen on   (env: APP_PORT, default: 8080)
  -h, --host <HOST>            Host to bind        (env: APP_HOST, default: 0.0.0.0)
      --mysql-host <HOST>         MySQL host          (env: MYSQL_HOST, default: 127.0.0.1)
      --mysql-port <PORT>         MySQL port          (env: MYSQL_PORT, default: 3306)
      --mysql-user <USER>         MySQL user          (env: MYSQL_USER, default: root)
      --mysql-password <PASSWORD> MySQL password      (env: MYSQL_PASSWORD, default: root123456)
      --mysql-name <NAME>         MySQL database      (env: MYSQL_NAME, default: soulcut_saas_core_service)
      --cors-origins <LIST>    Comma-separated CORS origins
                               (env: CORS_ALLOWED_ORIGINS, default: *)
      --help                   Show this help
"#
    );
}
