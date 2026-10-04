use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::MySqlPool;
/// Tenant-User relation entity mapped from t_tenant_user
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct TenantUser {
    pub id: u64,
    pub tenant_id: u64,
    pub user_id: u64,
    pub is_owner: i8,
    pub status: i8,
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}
/// Create tenant-user relation payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTenantUser {
    pub tenant_id: u64,
    pub user_id: u64,
    pub is_owner: i8,
    pub status: i8,
}
/// Tenant-User DAO
pub struct TenantUserDao;
impl TenantUserDao {
    /// Bind a user to a tenant, returns the new relation id
    pub async fn create(pool: &MySqlPool, input: &CreateTenantUser) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_tenant_user
                (tenant_id, user_id, is_owner, status)
            VALUES (?, ?, ?, ?)
            "#,
        )
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.is_owner)
        .bind(input.status)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Find a tenant-user relation by tenant id and user id
    pub async fn find(
        pool: &MySqlPool,
        tenant_id: u64,
        user_id: u64,
    ) -> sqlx::Result<Option<TenantUser>> {
        sqlx::query_as::<_, TenantUser>(
            r#"
            SELECT id, tenant_id, user_id, is_owner, status,
                   create_time, update_time
            FROM t_tenant_user
            WHERE tenant_id = ? AND user_id = ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_optional(pool)
        .await
    }
    /// Find the owner relation of a tenant
    pub async fn find_owner(pool: &MySqlPool, tenant_id: u64) -> sqlx::Result<Option<TenantUser>> {
        sqlx::query_as::<_, TenantUser>(
            r#"
            SELECT id, tenant_id, user_id, is_owner, status,
                   create_time, update_time
            FROM t_tenant_user
            WHERE tenant_id = ? AND is_owner = 1
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .fetch_optional(pool)
        .await
    }
    /// List all users of a tenant
    pub async fn list_by_tenant(pool: &MySqlPool, tenant_id: u64) -> sqlx::Result<Vec<TenantUser>> {
        sqlx::query_as::<_, TenantUser>(
            r#"
            SELECT id, tenant_id, user_id, is_owner, status,
                   create_time, update_time
            FROM t_tenant_user
            WHERE tenant_id = ?
            ORDER BY id ASC
            "#,
        )
        .bind(tenant_id)
        .fetch_all(pool)
        .await
    }
    /// List all tenants of a user
    pub async fn list_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<Vec<TenantUser>> {
        sqlx::query_as::<_, TenantUser>(
            r#"
            SELECT id, tenant_id, user_id, is_owner, status,
                   create_time, update_time
            FROM t_tenant_user
            WHERE user_id = ?
            ORDER BY id ASC
            "#,
        )
        .bind(user_id)
        .fetch_all(pool)
        .await
    }
    /// Count users of a tenant
    pub async fn count_by_tenant(pool: &MySqlPool, tenant_id: u64) -> sqlx::Result<u64> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM t_tenant_user WHERE tenant_id = ?")
            .bind(tenant_id)
            .fetch_one(pool)
            .await?;
        Ok(row.0 as u64)
    }
    /// Update the relation status
    pub async fn update_status(
        pool: &MySqlPool,
        tenant_id: u64,
        user_id: u64,
        status: i8,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_tenant_user
            SET status = ?
            WHERE tenant_id = ? AND user_id = ?
            "#,
        )
        .bind(status)
        .bind(tenant_id)
        .bind(user_id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Transfer the owner flag to another user of the same tenant
    pub async fn transfer_owner(
        pool: &MySqlPool,
        tenant_id: u64,
        new_owner_user_id: u64,
    ) -> sqlx::Result<u64> {
        // Clear current owner
        sqlx::query("UPDATE t_tenant_user SET is_owner = 0 WHERE tenant_id = ? AND is_owner = 1")
            .bind(tenant_id)
            .execute(pool)
            .await?;
        // Set the new owner
        let result = sqlx::query(
            r#"
            UPDATE t_tenant_user
            SET is_owner = 1
            WHERE tenant_id = ? AND user_id = ?
            "#,
        )
        .bind(tenant_id)
        .bind(new_owner_user_id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Unbind a user from a tenant
    pub async fn delete(pool: &MySqlPool, tenant_id: u64, user_id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            DELETE FROM t_tenant_user
            WHERE tenant_id = ? AND user_id = ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Delete all users of a tenant
    pub async fn delete_by_tenant(pool: &MySqlPool, tenant_id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query("DELETE FROM t_tenant_user WHERE tenant_id = ?")
            .bind(tenant_id)
            .execute(pool)
            .await?;
        Ok(result.rows_affected())
    }
    /// Delete all tenants of a user
    pub async fn delete_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query("DELETE FROM t_tenant_user WHERE user_id = ?")
            .bind(user_id)
            .execute(pool)
            .await?;
        Ok(result.rows_affected())
    }
}
