use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
/// User member entity mapped from t_user_member.
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UserMember {
    pub id: u64,
    pub user_id: u64,
    pub tenant_id: u64,
    pub expire_at: u64,
    pub status: i8,
    pub is_deleted: i8,
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}
/// Create payload for a user's membership record.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUserMember {
    pub user_id: u64,
    pub tenant_id: u64,
    pub expire_at: u64,
}
/// User member DAO.
pub struct UserMemberDao;
impl UserMemberDao {
    /// Insert a new membership record, returns the new id.
    pub async fn create(pool: &MySqlPool, input: &CreateUserMember) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_member
                (user_id, tenant_id, expire_at)
            VALUES (?, ?, ?)
            "#,
        )
        .bind(input.user_id)
        .bind(input.tenant_id)
        .bind(input.expire_at)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Find the membership record of a user.
    pub async fn find_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<Option<UserMember>> {
        sqlx::query_as::<_, UserMember>(
            r#"
            SELECT id, user_id, tenant_id, expire_at,
                   status, is_deleted, create_time, update_time
            FROM t_user_member
            WHERE user_id = ?
            "#,
        )
        .bind(user_id)
        .fetch_optional(pool)
        .await
    }
    /// Set or extend a user's membership expiry time.
    pub async fn set_expire_at(
        pool: &MySqlPool,
        user_id: u64,
        expire_at: u64,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_member
                (user_id, tenant_id, expire_at)
            VALUES (?, 0, ?)
            ON DUPLICATE KEY UPDATE
                expire_at = VALUES(expire_at)
            "#,
        )
        .bind(user_id)
        .bind(expire_at)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Check whether a user's membership is active at the given timestamp.
    pub async fn is_active(pool: &MySqlPool, user_id: u64, now: u64) -> sqlx::Result<bool> {
        let row: Option<(i64,)> = sqlx::query_as(
            r#"
            SELECT COUNT(*)
            FROM t_user_member
            WHERE user_id = ? AND expire_at > ? AND is_deleted = 0
            "#,
        )
        .bind(user_id)
        .bind(now)
        .fetch_optional(pool)
        .await?;
        Ok(row.map(|r| r.0 > 0).unwrap_or(false))
    }
    /// List members whose membership expires before the given timestamp.
    pub async fn list_expiring_before(
        pool: &MySqlPool,
        before: u64,
        limit: u64,
    ) -> sqlx::Result<Vec<UserMember>> {
        sqlx::query_as::<_, UserMember>(
            r#"
            SELECT id, user_id, tenant_id, expire_at,
                   status, is_deleted, create_time, update_time
            FROM t_user_member
            WHERE expire_at > 0 AND expire_at <= ? AND is_deleted = 0
            ORDER BY expire_at ASC
            LIMIT ?
            "#,
        )
        .bind(before)
        .bind(limit)
        .fetch_all(pool)
        .await
    }
    /// Soft delete a user's membership record.
    pub async fn delete_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_member
            SET is_deleted = 1
            WHERE user_id = ? AND is_deleted = 0
            "#,
        )
        .bind(user_id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
}
