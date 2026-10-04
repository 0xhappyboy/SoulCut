use crate::{
    dao::{UpdateUser, UserDao, pool},
    service::{
        Service,
        common::{
            hash_password,
            http::{err, ok, query_u64},
        },
        user::bo::UserBo,
    },
    types::{HttpMethod, Request, Response},
};
use chrono::NaiveDate;
use serde::Deserialize;
use serde_json::json;
/// PUT /user/update?id=1
#[derive(Debug, Deserialize)]
pub struct UpdateUserReq {
    pub password: Option<String>,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    // Profile
    pub avatar: Option<String>,
    pub wallpaper: Option<String>,
    pub gender: Option<i8>,
    pub birthday: Option<String>, // YYYY-MM-DD
    pub signature: Option<String>,
    pub real_name: Option<String>,
    // Locale
    pub country: Option<String>,
    pub province: Option<String>,
    pub city: Option<String>,
    pub address: Option<String>,
    pub language: Option<String>,
    pub timezone: Option<String>,
    // Status
    pub status: Option<i8>,
}
pub struct UserUpdateService;
impl Service for UserUpdateService {
    fn uri() -> &'static str {
        "/user/update"
    }
    fn method() -> HttpMethod {
        HttpMethod::Put
    }
    async fn handle(req: Request) -> Response {
        let id = match query_u64(&req, "id") {
            Some(v) => v,
            None => return err::bad_request("missing id"),
        };
        let input: UpdateUserReq = match serde_json::from_slice(&req.body) {
            Ok(v) => v,
            Err(e) => return err::bad_request(&format!("invalid body: {}", e)),
        };
        // Parse birthday if provided (YYYY-MM-DD).
        let birthday: Option<NaiveDate> = match input.birthday.as_ref() {
            Some(s) => match NaiveDate::parse_from_str(s, "%Y-%m-%d") {
                Ok(d) => Some(d),
                Err(_) => return err::bad_request("invalid birthday, expected YYYY-MM-DD"),
            },
            None => None,
        };
        let payload = UpdateUser {
            password: input.password.as_ref().map(|p| hash_password(p)),
            nickname: input.nickname,
            email: input.email,
            phone: input.phone,
            avatar: input.avatar,
            wallpaper: input.wallpaper,
            gender: input.gender,
            birthday,
            signature: input.signature,
            real_name: input.real_name,
            country: input.country,
            province: input.province,
            city: input.city,
            address: input.address,
            language: input.language,
            timezone: input.timezone,
            status: input.status,
        };
        match UserDao::update(pool(), id, &payload).await {
            Ok(n) => ok(json!({ "affected": n })),
            Err(e) => err::internal(&format!("db error: {}", e)),
        }
    }
}
