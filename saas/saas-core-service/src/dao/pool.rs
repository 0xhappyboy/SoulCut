use crate::config::AppConfig;
use sqlx::MySqlPool;
use sqlx::mysql::MySqlPoolOptions;
use std::sync::OnceLock;
/// Global MySQL pool shared by all services.
static POOL: OnceLock<MySqlPool> = OnceLock::new();
/// Initialize the global pool from AppConfig.
/// Call this once during application startup.
pub async fn init_pool(config: &AppConfig) -> Result<(), sqlx::Error> {
    if POOL.get().is_some() {
        return Ok(());
    }
    let url = config.database_url();
    let pool = MySqlPoolOptions::new()
        .max_connections(16)
        .min_connections(2)
        .connect(&url)
        .await?;
    let _ = POOL.set(pool);
    Ok(())
}
/// Get the global pool. Panics if init_pool was not called.
pub fn pool() -> &'static MySqlPool {
    POOL.get()
        .expect("MySQL pool is not initialized, call dao::pool::init_pool() first")
}
