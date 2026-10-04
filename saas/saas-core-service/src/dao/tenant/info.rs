use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::MySqlPool;

/// Tenant entity mapped from t_tenant_info
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct TenantInfo {
    pub id: u64,
    pub name: String,
    pub code: String,
    pub contact: Option<String>,
    pub phone: Option<String>,
    pub status: i8,
    pub plan_id: u64,
    pub expire_time: Option<DateTime<Utc>>,
    pub is_deleted: i8,
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}

/// Create tenant payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTenant {
    pub name: String,
    pub code: String,
    pub contact: Option<String>,
    pub phone: Option<String>,
    pub status: i8,
    pub plan_id: u64,
    pub expire_time: Option<DateTime<Utc>>,
}

/// Update tenant payload, None means keep unchanged
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct UpdateTenant {
    pub name: Option<String>,
    pub contact: Option<String>,
    pub phone: Option<String>,
    pub status: Option<i8>,
    pub plan_id: Option<u64>,
    pub expire_time: Option<DateTime<Utc>>,
}

/// Tenant DAO
pub struct TenantDao;

impl TenantDao {
    /// Insert a new tenant, returns the new id
    pub async fn create(pool: &MySqlPool, input: &CreateTenant) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_tenant_info
                (name, code, contact, phone, status, plan_id, expire_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.name)
        .bind(&input.code)
        .bind(&input.contact)
        .bind(&input.phone)
        .bind(input.status)
        .bind(input.plan_id)
        .bind(input.expire_time)
        .execute(pool)
        .await?;

        Ok(result.last_insert_id())
    }

    /// Find tenant by id (only not deleted)
    pub async fn find_by_id(pool: &MySqlPool, id: u64) -> sqlx::Result<Option<TenantInfo>> {
        sqlx::query_as::<_, TenantInfo>(
            r#"
            SELECT id, name, code, contact, phone, status, plan_id,
                   expire_time, is_deleted, create_time, update_time
            FROM t_tenant_info
            WHERE id = ? AND is_deleted = 0
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await
    }

    /// Find tenant by code (only not deleted)
    pub async fn find_by_code(pool: &MySqlPool, code: &str) -> sqlx::Result<Option<TenantInfo>> {
        sqlx::query_as::<_, TenantInfo>(
            r#"
            SELECT id, name, code, contact, phone, status, plan_id,
                   expire_time, is_deleted, create_time, update_time
            FROM t_tenant_info
            WHERE code = ? AND is_deleted = 0
            "#,
        )
        .bind(code)
        .fetch_optional(pool)
        .await
    }

    /// List tenants with pagination (only not deleted)
    pub async fn list(pool: &MySqlPool, offset: u64, limit: u64) -> sqlx::Result<Vec<TenantInfo>> {
        sqlx::query_as::<_, TenantInfo>(
            r#"
            SELECT id, name, code, contact, phone, status, plan_id,
                   expire_time, is_deleted, create_time, update_time
            FROM t_tenant_info
            WHERE is_deleted = 0
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            "#,
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
    }

    /// Count not deleted tenants
    pub async fn count(pool: &MySqlPool) -> sqlx::Result<u64> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM t_tenant_info WHERE is_deleted = 0")
            .fetch_one(pool)
            .await?;
        Ok(row.0 as u64)
    }

    /// Update tenant by id, only fields present in the payload are changed
    pub async fn update(pool: &MySqlPool, id: u64, input: &UpdateTenant) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_tenant_info
            SET name        = COALESCE(?, name),
                contact     = COALESCE(?, contact),
                phone       = COALESCE(?, phone),
                status      = COALESCE(?, status),
                plan_id     = COALESCE(?, plan_id),
                expire_time = COALESCE(?, expire_time)
            WHERE id = ? AND is_deleted = 0
            "#,
        )
        .bind(&input.name)
        .bind(&input.contact)
        .bind(&input.phone)
        .bind(input.status)
        .bind(input.plan_id)
        .bind(input.expire_time)
        .bind(id)
        .execute(pool)
        .await?;

        Ok(result.rows_affected())
    }

    /// Soft delete tenant by id
    pub async fn soft_delete(pool: &MySqlPool, id: u64) -> sqlx::Result<u64> {
        let result =
            sqlx::query("UPDATE t_tenant_info SET is_deleted = 1 WHERE id = ? AND is_deleted = 0")
                .bind(id)
                .execute(pool)
                .await?;
        Ok(result.rows_affected())
    }

    /// Hard delete tenant by id (use with caution)
    pub async fn hard_delete(pool: &MySqlPool, id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query("DELETE FROM t_tenant_info WHERE id = ?")
            .bind(id)
            .execute(pool)
            .await?;
        Ok(result.rows_affected())
    }
}
