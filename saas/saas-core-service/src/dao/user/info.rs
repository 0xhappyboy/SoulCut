use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, MySql, MySqlPool, Transaction};
/// User entity mapped from t_user_info (full row).
#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct UserInfo {
    pub id: u64,
    pub username: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    // Profile
    pub avatar: Option<String>,
    pub wallpaper: Option<String>,
    pub gender: i8,
    pub birthday: Option<NaiveDate>,
    pub signature: Option<String>,
    pub real_name: Option<String>,
    pub id_card_no: Option<String>,
    // Locale
    pub country: Option<String>,
    pub province: Option<String>,
    pub city: Option<String>,
    pub address: Option<String>,
    pub language: String,
    pub timezone: String,
    // Account meta
    pub source: Option<String>,
    pub email_verified: i8,
    pub phone_verified: i8,
    pub last_login_time: Option<DateTime<Utc>>,
    pub last_login_ip: Option<String>,
    // Status & audit
    pub status: i8,
    pub is_deleted: i8,
    // Timestamps
    pub create_time: DateTime<Utc>,
    pub update_time: DateTime<Utc>,
}
/// Create user payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateUser {
    pub username: String,
    pub password: String,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub status: i8,
}
/// Update user payload, None means keep unchanged
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct UpdateUser {
    pub password: Option<String>,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub avatar: Option<String>,
    pub wallpaper: Option<String>,
    pub gender: Option<i8>,
    pub birthday: Option<NaiveDate>,
    pub signature: Option<String>,
    pub real_name: Option<String>,
    pub country: Option<String>,
    pub province: Option<String>,
    pub city: Option<String>,
    pub address: Option<String>,
    pub language: Option<String>,
    pub timezone: Option<String>,
    pub status: Option<i8>,
}
/// User DAO
pub struct UserDao;
impl UserDao {
    /// Insert a new user, returns the new id
    pub async fn create(pool: &MySqlPool, input: &CreateUser) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_info
                (username, password, nickname, email, phone, status)
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.username)
        .bind(&input.password)
        .bind(&input.nickname)
        .bind(&input.email)
        .bind(&input.phone)
        .bind(input.status)
        .execute(pool)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Insert a new user inside an existing transaction, returns the new id.
    pub async fn create_tx(
        tx: &mut Transaction<'_, MySql>,
        input: &CreateUser,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            INSERT INTO t_user_info
                (username, password, nickname, email, phone, status)
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.username)
        .bind(&input.password)
        .bind(&input.nickname)
        .bind(&input.email)
        .bind(&input.phone)
        .bind(input.status)
        .execute(&mut **tx)
        .await?;
        Ok(result.last_insert_id())
    }
    /// Find user by id
    pub async fn find_by_id(pool: &MySqlPool, id: u64) -> sqlx::Result<Option<UserInfo>> {
        sqlx::query_as::<_, UserInfo>(
            r#"
            SELECT id, username, password, nickname, email, phone,
                   avatar, wallpaper, gender, birthday, signature, real_name, id_card_no,
                   country, province, city, address, language, timezone,
                   source, email_verified, phone_verified, last_login_time, last_login_ip,
                   status, is_deleted, create_time, update_time
            FROM t_user_info
            WHERE id = ?
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await
    }
    /// Find user by username
    pub async fn find_by_username(
        pool: &MySqlPool,
        username: &str,
    ) -> sqlx::Result<Option<UserInfo>> {
        sqlx::query_as::<_, UserInfo>(
            r#"
            SELECT id, username, password, nickname, email, phone,
                   avatar, wallpaper, gender, birthday, signature, real_name, id_card_no,
                   country, province, city, address, language, timezone,
                   source, email_verified, phone_verified, last_login_time, last_login_ip,
                   status, is_deleted, create_time, update_time
            FROM t_user_info
            WHERE username = ?
            "#,
        )
        .bind(username)
        .fetch_optional(pool)
        .await
    }
    /// Find user by email
    pub async fn find_by_email(pool: &MySqlPool, email: &str) -> sqlx::Result<Option<UserInfo>> {
        sqlx::query_as::<_, UserInfo>(
            r#"
            SELECT id, username, password, nickname, email, phone,
                   avatar, wallpaper, gender, birthday, signature, real_name, id_card_no,
                   country, province, city, address, language, timezone,
                   source, email_verified, phone_verified, last_login_time, last_login_ip,
                   status, is_deleted, create_time, update_time
            FROM t_user_info
            WHERE email = ?
            "#,
        )
        .bind(email)
        .fetch_optional(pool)
        .await
    }
    /// Find user by phone
    pub async fn find_by_phone(pool: &MySqlPool, phone: &str) -> sqlx::Result<Option<UserInfo>> {
        sqlx::query_as::<_, UserInfo>(
            r#"
            SELECT id, username, password, nickname, email, phone,
                   avatar, wallpaper, gender, birthday, signature, real_name, id_card_no,
                   country, province, city, address, language, timezone,
                   source, email_verified, phone_verified, last_login_time, last_login_ip,
                   status, is_deleted, create_time, update_time
            FROM t_user_info
            WHERE phone = ?
            "#,
        )
        .bind(phone)
        .fetch_optional(pool)
        .await
    }
    /// List users with pagination
    pub async fn list(pool: &MySqlPool, offset: u64, limit: u64) -> sqlx::Result<Vec<UserInfo>> {
        sqlx::query_as::<_, UserInfo>(
            r#"
            SELECT id, username, password, nickname, email, phone,
                   avatar, wallpaper, gender, birthday, signature, real_name, id_card_no,
                   country, province, city, address, language, timezone,
                   source, email_verified, phone_verified, last_login_time, last_login_ip,
                   status, is_deleted, create_time, update_time
            FROM t_user_info
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
    /// Count all users
    pub async fn count(pool: &MySqlPool) -> sqlx::Result<u64> {
        let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM t_user_info WHERE is_deleted = 0")
            .fetch_one(pool)
            .await?;
        Ok(row.0 as u64)
    }
    /// Update user by id, only fields present in the payload are changed
    pub async fn update(pool: &MySqlPool, id: u64, input: &UpdateUser) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_info
            SET password    = COALESCE(?, password),
                nickname    = COALESCE(?, nickname),
                email       = COALESCE(?, email),
                phone       = COALESCE(?, phone),
                avatar      = COALESCE(?, avatar),
                wallpaper   = COALESCE(?, wallpaper),
                gender      = COALESCE(?, gender),
                birthday    = COALESCE(?, birthday),
                signature   = COALESCE(?, signature),
                real_name   = COALESCE(?, real_name),
                country     = COALESCE(?, country),
                province    = COALESCE(?, province),
                city        = COALESCE(?, city),
                address     = COALESCE(?, address),
                language    = COALESCE(?, language),
                timezone    = COALESCE(?, timezone),
                status      = COALESCE(?, status)
            WHERE id = ? AND is_deleted = 0
            "#,
        )
        .bind(&input.password)
        .bind(&input.nickname)
        .bind(&input.email)
        .bind(&input.phone)
        .bind(&input.avatar)
        .bind(&input.wallpaper)
        .bind(input.gender)
        .bind(input.birthday)
        .bind(&input.signature)
        .bind(&input.real_name)
        .bind(&input.country)
        .bind(&input.province)
        .bind(&input.city)
        .bind(&input.address)
        .bind(&input.language)
        .bind(&input.timezone)
        .bind(input.status)
        .bind(id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
    /// Soft delete user by id
    pub async fn delete(pool: &MySqlPool, id: u64) -> sqlx::Result<u64> {
        let result =
            sqlx::query("UPDATE t_user_info SET is_deleted = 1 WHERE id = ? AND is_deleted = 0")
                .bind(id)
                .execute(pool)
                .await?;
        Ok(result.rows_affected())
    }
    /// Update last login info
    pub async fn update_last_login(
        pool: &MySqlPool,
        id: u64,
        ip: Option<&str>,
    ) -> sqlx::Result<u64> {
        let result = sqlx::query(
            r#"
            UPDATE t_user_info
            SET last_login_time = NOW(), last_login_ip = ?
            WHERE id = ?
            "#,
        )
        .bind(ip)
        .bind(id)
        .execute(pool)
        .await?;
        Ok(result.rows_affected())
    }
}
