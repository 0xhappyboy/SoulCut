use crate::dao::UserInfo;
use serde::{Deserialize, Serialize};
/// User business object exposed to the frontend.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserBo {
    pub id: u64,
    pub username: String,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    // Profile
    pub avatar: Option<String>,
    pub wallpaper: Option<String>,
    pub gender: i8,
    pub birthday: Option<String>,
    pub signature: Option<String>,
    pub real_name: Option<String>,
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
    pub last_login_time: Option<String>,
    pub status: i8,
    // Timestamps
    pub create_time: String,
    pub update_time: String,
}
impl UserBo {
    /// Convert a DB entity into a business object.
    pub fn from_do(u: UserInfo) -> Self {
        Self {
            id: u.id,
            username: u.username,
            nickname: u.nickname,
            email: u.email,
            phone: u.phone,
            avatar: u.avatar,
            wallpaper: u.wallpaper,
            gender: u.gender,
            birthday: u.birthday.map(|d| d.format("%Y-%m-%d").to_string()),
            signature: u.signature,
            real_name: u.real_name,
            country: u.country,
            province: u.province,
            city: u.city,
            address: u.address,
            language: u.language,
            timezone: u.timezone,
            source: u.source,
            email_verified: u.email_verified,
            phone_verified: u.phone_verified,
            last_login_time: u.last_login_time.map(|t| t.to_rfc3339()),
            status: u.status,
            create_time: u.create_time.to_rfc3339(),
            update_time: u.update_time.to_rfc3339(),
        }
    }
}
