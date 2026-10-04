mod common;
mod llm;
mod tenant;
mod types;
mod user;
use crate::types::{HttpMethod, Request, Response};
use std::future::Future;
/// registry
crate::services![
    // =================== user services ===================
    user::UserRegisterService,
    user::UserLoginService,
    user::UserCreateService,
    user::UserGetService,
    user::UserUsernameService,
    user::UserEmailService,
    user::UserPhoneService,
    user::UserListService,
    user::UserCountService,
    user::UserUpdateService,
    user::UserDeleteService,
    user::UserMeService,
    // user LLM usage services
    user::UserLlmUsageCreateService,
    user::UserLlmUsageListService,
    user::UserLlmUsageCountService,
    user::UserLlmUsageSumService,
    user::UserLlmUsageSummaryService,
    // =================== tenant services ===================
    tenant::TenantCreateService,
    tenant::TenantGetService,
    tenant::TenantCodeService,
    tenant::TenantListService,
    tenant::TenantCountService,
    tenant::TenantUpdateService,
    tenant::TenantSoftDeleteService,
    tenant::TenantHardDeleteService,
    // =================== llm metadata services ===================
    llm::LlmListProvidersService,
    llm::LlmListModelsService,
];
/// Every service (bound to one URI) must implement this trait.
pub trait Service: Send + Sync + 'static {
    /// The URI path this service exposes, e.g. "/users"
    fn uri() -> &'static str;
    /// The HTTP method this service handles
    fn method() -> HttpMethod;
    /// Handle a request and produce a response asynchronously.
    fn handle(req: Request) -> impl Future<Output = Response> + Send;
}
