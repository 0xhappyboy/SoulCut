use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
/// LLM integral entity mapped from t_user_llm_integral.
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UserLlmIntegral {
    pub id: u64,
    pub user_id: u64,
    pub tenant_id: u64,
    pub integral: i64,
    pub total_recharge: u64,
    pub total_consume: u64,
    pub first_recharge_time: Option<DateTime<Utc>>,
    pub last_recharge_time: Option<DateTime<Utc>>,
    pub status: i8,
    pub is_deleted: i8,
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}
/// Create payload for a user's integral record.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUserLlmIntegral {
    pub user_id: u64,
    pub tenant_id: u64,
    pub integral: i64,
}
/// User LLM integral DAO.
pub struct UserLlmIntegralDao;
impl UserLlmIntegralDao {
    /// Insert a new integral record, returns the new id.
    pub async fn create(pool: &MySqlPool, input: &CreateUserLlmIntegral) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_llm_integral
                (user_id, tenant_id, integral, total_recharge, total_consume,
                 first_recharge_time, last_recharge_time)
            VALUES (?, ?, ?, ?, 0, NOW(), NOW())
            "#,
        )
        .bind(input.user_id)
        .bind(input.tenant_id)
        .bind(input.integral)
        .bind(input.integral.max(0) as u64)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Find the integral record of a user.
    pub async fn find_by_user(
        pool: &MySqlPool,
        user_id: u64,
    ) -> sqlx::Result<Option<UserLlmIntegral>> {
        sqlx::query_as::<_, UserLlmIntegral>(
            r#"
            SELECT id, user_id, tenant_id, integral, total_recharge, total_consume,
                   first_recharge_time, last_recharge_time,
                   status, is_deleted, create_time, update_time
            FROM t_user_llm_integral
            WHERE user_id = ?
            "#,
        )
        .bind(user_id)
        .fetch_optional(pool)
        .await
    }
    /// Add points to a user's balance, creating the row if missing.
    pub async fn add_integral(pool: &MySqlPool, user_id: u64, amount: u64) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_llm_integral
                (user_id, tenant_id, integral, total_recharge, total_consume,
                 first_recharge_time, last_recharge_time)
            VALUES (?, 0, ?, ?, 0, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                integral          = integral + VALUES(integral),
                total_recharge    = total_recharge + VALUES(total_recharge),
                last_recharge_time = NOW()
            "#,
        )
        .bind(user_id)
        .bind(amount as i64)
        .bind(amount)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Deduct points from a user's balance.
    pub async fn deduct_integral(pool: &MySqlPool, user_id: u64, amount: u64) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_llm_integral
            SET integral      = integral - ?,
                total_consume = total_consume + ?
            WHERE user_id = ? AND integral >= ?
            "#,
        )
        .bind(amount as i64)
        .bind(amount)
        .bind(user_id)
        .bind(amount as i64)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Overwrite the integral balance directly.
    pub async fn set_integral(pool: &MySqlPool, user_id: u64, integral: i64) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_llm_integral
            SET integral = ?
            WHERE user_id = ?
            "#,
        )
        .bind(integral)
        .bind(user_id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Soft delete a user's integral record.
    pub async fn delete_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_llm_integral
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
