use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySqlPool};
use std::collections::BTreeMap;
/// LLM usage entity mapped from t_user_llm_usage.
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UserLlmUsage {
    pub id: u64,
    pub user_id: u64,
    pub tenant_id: u64,
    pub kind: String,
    pub provider_code: String,
    pub model_id: String,
    pub tokens: u64,
    pub usage_type: Option<String>,
    pub duration_ms: u32,
    pub success: i8,
    pub request_id: Option<String>,
    pub created_at: DateTime<Utc>,
}
/// Create payload for one LLM call record.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUserLlmUsage {
    pub user_id: u64,
    pub tenant_id: u64,
    pub kind: String,
    pub provider_code: String,
    pub model_id: String,
    pub tokens: u64,
    pub usage_type: Option<String>,
    pub duration_ms: u32,
    pub success: i8,
    pub request_id: Option<String>,
}
/// One row of the grouped usage query.
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct ModelUsageRow {
    pub kind: String,
    pub provider_code: String,
    pub model_id: String,
    pub tokens: u64,
}
/// Nested usage summary for one user.
///
/// Serializes as:
/// ```json
/// {
///   "chat": {
///     "openai": { "gpt-4o": 1234, "gpt-4o-mini": 88 },
///     "anthropic": { "claude-3-5-sonnet": 5678 }
///   },
///   "image": {
///     "seedream": { "doubao-seedream-4-5": 12 }
///   }
/// }
/// ```
///
/// The outer key is `kind`, the middle key is `provider_code`, and
/// the inner key is `model_id`. Values are summed token counts.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct UserLlmUsageSummary {
    /// kind -> provider_code -> model_id -> tokens
    pub usage: BTreeMap<String, BTreeMap<String, BTreeMap<String, u64>>>,
}
impl UserLlmUsageSummary {
    /// Build the nested summary from the flat grouped rows.
    ///
    /// Rows with the same (kind, provider, model) are summed together
    /// defensively, even though the SQL already groups them.
    pub fn from_rows(rows: Vec<ModelUsageRow>) -> Self {
        let mut usage: BTreeMap<String, BTreeMap<String, BTreeMap<String, u64>>> = BTreeMap::new();
        for r in rows {
            let by_provider = usage.entry(r.kind).or_default();
            let by_model = by_provider.entry(r.provider_code).or_default();
            let entry = by_model.entry(r.model_id).or_insert(0);
            *entry = entry.saturating_add(r.tokens);
        }
        Self { usage }
    }
}
/// User LLM usage DAO.
pub struct UserLlmUsageDao;
impl UserLlmUsageDao {
    /// Insert a single usage record, returns the new id.
    pub async fn create(pool: &MySqlPool, input: &CreateUserLlmUsage) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_llm_usage
                (user_id, tenant_id, kind, provider_code, model_id,
                 tokens, usage_type, duration_ms, success, request_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.user_id)
        .bind(input.tenant_id)
        .bind(&input.kind)
        .bind(&input.provider_code)
        .bind(&input.model_id)
        .bind(input.tokens)
        .bind(&input.usage_type)
        .bind(input.duration_ms)
        .bind(input.success)
        .bind(&input.request_id)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Find a usage record by id.
    pub async fn find_by_id(pool: &MySqlPool, id: u64) -> sqlx::Result<Option<UserLlmUsage>> {
        sqlx::query_as::<_, UserLlmUsage>(
            r#"
            SELECT id, user_id, tenant_id, kind, provider_code, model_id,
                   tokens, usage_type, duration_ms, success, request_id, created_at
            FROM t_user_llm_usage
            WHERE id = ?
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await
    }
    /// List usage records of a user with pagination, newest first.
    pub async fn list_by_user(
        pool: &MySqlPool,
        user_id: u64,
        offset: u64,
        limit: u64,
    ) -> sqlx::Result<Vec<UserLlmUsage>> {
        sqlx::query_as::<_, UserLlmUsage>(
            r#"
            SELECT id, user_id, tenant_id, kind, provider_code, model_id,
                   tokens, usage_type, duration_ms, success, request_id, created_at
            FROM t_user_llm_usage
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            "#,
        )
        .bind(user_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
    }
    /// List usage records of a tenant with pagination, newest first.
    pub async fn list_by_tenant(
        pool: &MySqlPool,
        tenant_id: u64,
        offset: u64,
        limit: u64,
    ) -> sqlx::Result<Vec<UserLlmUsage>> {
        sqlx::query_as::<_, UserLlmUsage>(
            r#"
            SELECT id, user_id, tenant_id, kind, provider_code, model_id,
                   tokens, usage_type, duration_ms, success, request_id, created_at
            FROM t_user_llm_usage
            WHERE tenant_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            "#,
        )
        .bind(tenant_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
    }
    /// List usage records of a user filtered by kind, newest first.
    pub async fn list_by_user_and_kind(
        pool: &MySqlPool,
        user_id: u64,
        kind: &str,
        offset: u64,
        limit: u64,
    ) -> sqlx::Result<Vec<UserLlmUsage>> {
        sqlx::query_as::<_, UserLlmUsage>(
            r#"
            SELECT id, user_id, tenant_id, kind, provider_code, model_id,
                   tokens, usage_type, duration_ms, success, request_id, created_at
            FROM t_user_llm_usage
            WHERE user_id = ? AND kind = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            "#,
        )
        .bind(user_id)
        .bind(kind)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
    }
    /// Total number of usage records of a user.
    pub async fn count_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<u64> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM t_user_llm_usage WHERE user_id = ?")
            .bind(user_id)
            .fetch_one(pool)
            .await?;
        Ok(row.0 as u64)
    }
    /// Sum tokens consumed by a user for a given kind.
    pub async fn sum_tokens_by_user_and_kind(
        pool: &MySqlPool,
        user_id: u64,
        kind: &str,
        usage_type: Option<&str>,
    ) -> sqlx::Result<u64> {
        let row: (i64,) = match usage_type {
            Some(t) => {
                sqlx::query_as(
                    r#"
                    SELECT COALESCE(SUM(tokens), 0)
                    FROM t_user_llm_usage
                    WHERE user_id = ? AND kind = ? AND usage_type = ?
                    "#,
                )
                .bind(user_id)
                .bind(kind)
                .bind(t)
                .fetch_one(pool)
                .await?
            }
            None => {
                sqlx::query_as(
                    r#"
                    SELECT COALESCE(SUM(tokens), 0)
                    FROM t_user_llm_usage
                    WHERE user_id = ? AND kind = ?
                    "#,
                )
                .bind(user_id)
                .bind(kind)
                .fetch_one(pool)
                .await?
            }
        };
        Ok(row.0 as u64)
    }
    /// Sum tokens consumed by a tenant for a given kind.
    pub async fn sum_tokens_by_tenant_and_kind(
        pool: &MySqlPool,
        tenant_id: u64,
        kind: &str,
        usage_type: Option<&str>,
    ) -> sqlx::Result<u64> {
        let row: (i64,) = match usage_type {
            Some(t) => {
                sqlx::query_as(
                    r#"
                    SELECT COALESCE(SUM(tokens), 0)
                    FROM t_user_llm_usage
                    WHERE tenant_id = ? AND kind = ? AND usage_type = ?
                    "#,
                )
                .bind(tenant_id)
                .bind(kind)
                .bind(t)
                .fetch_one(pool)
                .await?
            }
            None => {
                sqlx::query_as(
                    r#"
                    SELECT COALESCE(SUM(tokens), 0)
                    FROM t_user_llm_usage
                    WHERE tenant_id = ? AND kind = ?
                    "#,
                )
                .bind(tenant_id)
                .bind(kind)
                .fetch_one(pool)
                .await?
            }
        };
        Ok(row.0 as u64)
    }
    /// Aggregate a user's full usage into a nested summary.
    ///
    /// Result shape (serialized):
    /// ```json
    /// {
    ///   "chat": {
    ///     "openai": { "gpt-4o": 1234 },
    ///     "anthropic": { "claude-3-5-sonnet": 5678 }
    ///   },
    ///   "image": {
    ///     "seedream": { "doubao-seedream-4-5": 12 }
    ///   }
    /// }
    /// ```
    pub async fn sum_all_by_user(
        pool: &MySqlPool,
        user_id: u64,
    ) -> sqlx::Result<UserLlmUsageSummary> {
        let rows = sqlx::query_as::<_, ModelUsageRow>(
            r#"
            SELECT kind,
                   provider_code,
                   model_id,
                   CAST(COALESCE(SUM(tokens), 0) AS UNSIGNED) AS tokens
            FROM t_user_llm_usage
            WHERE user_id = ?
            GROUP BY kind, provider_code, model_id
            "#,
        )
        .bind(user_id)
        .fetch_all(pool)
        .await?;
        Ok(UserLlmUsageSummary::from_rows(rows))
    }
    /// Aggregate a tenant's full usage into a nested summary.
    pub async fn sum_all_by_tenant(
        pool: &MySqlPool,
        tenant_id: u64,
    ) -> sqlx::Result<UserLlmUsageSummary> {
        let rows = sqlx::query_as::<_, ModelUsageRow>(
            r#"
            SELECT kind,
                   provider_code,
                   model_id,
                   CAST(COALESCE(SUM(tokens), 0) AS UNSIGNED) AS tokens
            FROM t_user_llm_usage
            WHERE tenant_id = ?
            GROUP BY kind, provider_code, model_id
            "#,
        )
        .bind(tenant_id)
        .fetch_all(pool)
        .await?;
        Ok(UserLlmUsageSummary::from_rows(rows))
    }
    /// Delete all usage records of a user.
    pub async fn delete_by_user(pool: &MySqlPool, user_id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query("DELETE FROM t_user_llm_usage WHERE user_id = ?")
            .bind(user_id)
            .execute(pool)
            .await?;
        Ok(result.rows_affected())
    }
}
