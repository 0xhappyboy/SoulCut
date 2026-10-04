use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySql, MySqlPool, Transaction};
/// Role entity mapped from t_user_role_info
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UserRole {
    pub id: u64,
    pub tenant_id: u64,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub is_system: i8,
    pub status: i8,
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}
/// Create role payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateRole {
    pub tenant_id: u64,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub is_system: i8,
    pub status: i8,
}
/// Update role payload, None means keep unchanged
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct UpdateRole {
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<i8>,
}
/// User-Role relation entity mapped from t_user_role_relation
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UserRoleRelation {
    pub id: u64,
    pub tenant_id: u64,
    pub user_id: u64,
    pub role_id: u64,
    pub status: i8,
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}
/// Role DAO
pub struct RoleDao;
impl RoleDao {
    /// Insert a new role, returns the new id
    pub async fn create(pool: &MySqlPool, input: &CreateRole) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_role_info
                (tenant_id, name, code, description, is_system, status)
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.tenant_id)
        .bind(&input.name)
        .bind(&input.code)
        .bind(&input.description)
        .bind(input.is_system)
        .bind(input.status)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Find role by id
    pub async fn find_by_id(pool: &MySqlPool, id: u64) -> sqlx::Result<Option<UserRole>> {
        sqlx::query_as::<_, UserRole>(
            r#"
            SELECT id, tenant_id, name, code, description,
                   is_system, status, create_time, update_time
            FROM t_user_role_info
            WHERE id = ?
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await
    }
    /// Find role by tenant id and role code
    pub async fn find_by_tenant_and_code(
        pool: &MySqlPool,
        tenant_id: u64,
        code: &str,
    ) -> sqlx::Result<Option<UserRole>> {
        sqlx::query_as::<_, UserRole>(
            r#"
            SELECT id, tenant_id, name, code, description,
                   is_system, status, create_time, update_time
            FROM t_user_role_info
            WHERE tenant_id = ? AND code = ?
            "#,
        )
        .bind(tenant_id)
        .bind(code)
        .fetch_optional(pool)
        .await
    }
    /// Find role by tenant id and role code inside an existing transaction.
    pub async fn find_by_tenant_and_code_tx(
        tx: &mut Transaction<'_, MySql>,
        tenant_id: u64,
        code: &str,
    ) -> sqlx::Result<Option<UserRole>> {
        sqlx::query_as::<_, UserRole>(
            r#"
            SELECT id, tenant_id, name, code, description,
                   is_system, status, create_time, update_time
            FROM t_user_role_info
            WHERE tenant_id = ? AND code = ?
            "#,
        )
        .bind(tenant_id)
        .bind(code)
        .fetch_optional(&mut **tx)
        .await
    }
    /// List roles by tenant id
    pub async fn list_by_tenant(pool: &MySqlPool, tenant_id: u64) -> sqlx::Result<Vec<UserRole>> {
        sqlx::query_as::<_, UserRole>(
            r#"
            SELECT id, tenant_id, name, code, description,
                   is_system, status, create_time, update_time
            FROM t_user_role_info
            WHERE tenant_id = ?
            ORDER BY id ASC
            "#,
        )
        .bind(tenant_id)
        .fetch_all(pool)
        .await
    }
    /// List system built-in roles (tenant_id = 0)
    pub async fn list_system_roles(pool: &MySqlPool) -> sqlx::Result<Vec<UserRole>> {
        sqlx::query_as::<_, UserRole>(
            r#"
            SELECT id, tenant_id, name, code, description,
                   is_system, status, create_time, update_time
            FROM t_user_role_info
            WHERE tenant_id = 0
            ORDER BY id ASC
            "#,
        )
        .fetch_all(pool)
        .await
    }
    /// Update role by id, only fields present in the payload are changed
    pub async fn update(pool: &MySqlPool, id: u64, input: &UpdateRole) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_role_info
            SET name        = COALESCE(?, name),
                description = COALESCE(?, description),
                status      = COALESCE(?, status)
            WHERE id = ?
            "#,
        )
        .bind(&input.name)
        .bind(&input.description)
        .bind(input.status)
        .bind(id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Delete role by id
    pub async fn delete(pool: &MySqlPool, id: u64) -> sqlx::Result<u64> {
        let result = sqlx::query("DELETE FROM t_user_role_info WHERE id = ?")
            .bind(id)
            .execute(pool)
            .await?;
        Ok(result.rows_affected())
    }
    /// Bind a role to a user inside a tenant
    pub async fn bind_user_role(
        pool: &MySqlPool,
        tenant_id: u64,
        user_id: u64,
        role_id: u64,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_role_relation
                (tenant_id, user_id, role_id, status)
            VALUES (?, ?, ?, 1)
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(role_id)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Bind a role to a user inside an existing transaction.
    /// Used by register to assign TENANT_USER in the same tx.
    pub async fn bind_user_role_tx(
        tx: &mut Transaction<'_, MySql>,
        tenant_id: u64,
        user_id: u64,
        role_id: u64,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_role_relation
                (tenant_id, user_id, role_id, status)
            VALUES (?, ?, ?, 1)
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(role_id)
        .execute(&mut **tx)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Unbind a role from a user inside a tenant
    pub async fn unbind_user_role(
        pool: &MySqlPool,
        tenant_id: u64,
        user_id: u64,
        role_id: u64,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            DELETE FROM t_user_role_relation
            WHERE tenant_id = ? AND user_id = ? AND role_id = ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(role_id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// List all role relations of a user inside a tenant
    pub async fn list_relations_by_user(
        pool: &MySqlPool,
        tenant_id: u64,
        user_id: u64,
    ) -> sqlx::Result<Vec<UserRoleRelation>> {
        sqlx::query_as::<_, UserRoleRelation>(
            r#"
            SELECT id, tenant_id, user_id, role_id, status,
                   create_time, update_time
            FROM t_user_role_relation
            WHERE tenant_id = ? AND user_id = ?
            ORDER BY id ASC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(pool)
        .await
    }
    /// List all roles of a user inside a tenant (joined result)
    pub async fn list_roles_by_user(
        pool: &MySqlPool,
        tenant_id: u64,
        user_id: u64,
    ) -> sqlx::Result<Vec<UserRole>> {
        sqlx::query_as::<_, UserRole>(
            r#"
            SELECT r.id, r.tenant_id, r.name, r.code, r.description,
                   r.is_system, r.status, r.create_time, r.update_time
            FROM t_user_role_relation rel
            INNER JOIN t_user_role_info r ON r.id = rel.role_id
            WHERE rel.tenant_id = ? AND rel.user_id = ? AND rel.status = 1
            ORDER BY r.id ASC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(pool)
        .await
    }
}
