use std::fmt;
use std::str::FromStr;
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
#[repr(i8)]
pub enum Status {
    Disabled = 0,
    Enabled = 1,
}
impl Status {
    pub fn from_i8(v: i8) -> Option<Self> {
        match v {
            0 => Some(Status::Disabled),
            1 => Some(Status::Enabled),
            _ => None,
        }
    }
    pub fn as_i8(&self) -> i8 {
        *self as i8
    }
}
impl fmt::Display for Status {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            Status::Disabled => "DISABLED",
            Status::Enabled => "ENABLED",
        };
        write!(f, "{}", s)
    }
}
impl FromStr for Status {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "DISABLED" | "0" => Ok(Status::Disabled),
            "ENABLED" | "1" => Ok(Status::Enabled),
            other => Err(format!("invalid Status: {}", other)),
        }
    }
}
impl TryFrom<&str> for Status {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        s.parse()
    }
}
impl TryFrom<i8> for Status {
    type Error = String;
    fn try_from(v: i8) -> Result<Self, Self::Error> {
        Status::from_i8(v).ok_or_else(|| format!("invalid Status value: {}", v))
    }
}
/// Yes/No flag
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
#[repr(i8)]
pub enum YesNo {
    No = 0,
    Yes = 1,
}
impl YesNo {
    pub fn from_i8(v: i8) -> Option<Self> {
        match v {
            0 => Some(YesNo::No),
            1 => Some(YesNo::Yes),
            _ => None,
        }
    }
    pub fn as_i8(&self) -> i8 {
        *self as i8
    }
    pub fn is_yes(&self) -> bool {
        matches!(self, YesNo::Yes)
    }
    pub fn is_no(&self) -> bool {
        matches!(self, YesNo::No)
    }
}
impl fmt::Display for YesNo {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            YesNo::No => "NO",
            YesNo::Yes => "YES",
        };
        write!(f, "{}", s)
    }
}
impl FromStr for YesNo {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "NO" | "N" | "FALSE" | "0" => Ok(YesNo::No),
            "YES" | "Y" | "TRUE" | "1" => Ok(YesNo::Yes),
            other => Err(format!("invalid YesNo: {}", other)),
        }
    }
}
impl TryFrom<&str> for YesNo {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        s.parse()
    }
}
impl TryFrom<i8> for YesNo {
    type Error = String;
    fn try_from(v: i8) -> Result<Self, Self::Error> {
        YesNo::from_i8(v).ok_or_else(|| format!("invalid YesNo value: {}", v))
    }
}
/// User role code
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize)]
pub enum UserRoleCode {
    SuperAdmin,
    TenantAdmin,
    TenantUser,
}
impl UserRoleCode {
    /// The canonical string stored in the database.
    pub fn as_str(&self) -> &'static str {
        match self {
            UserRoleCode::SuperAdmin => "SUPER_ADMIN",
            UserRoleCode::TenantAdmin => "TENANT_ADMIN",
            UserRoleCode::TenantUser => "TENANT_USER",
        }
    }
    /// The tenant_id reserved for system built-in roles.
    pub fn system_tenant_id() -> u64 {
        0
    }
}
impl fmt::Display for UserRoleCode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.as_str())
    }
}
impl FromStr for UserRoleCode {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "SUPER_ADMIN" => Ok(UserRoleCode::SuperAdmin),
            "TENANT_ADMIN" => Ok(UserRoleCode::TenantAdmin),
            "TENANT_USER" => Ok(UserRoleCode::TenantUser),
            other => Err(format!("invalid UserRoleCode: {}", other)),
        }
    }
}
impl TryFrom<&str> for UserRoleCode {
    type Error = String;
    fn try_from(s: &str) -> Result<Self, Self::Error> {
        s.parse()
    }
}
