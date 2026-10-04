use crate::{
    service::Service,
    types::{HttpMethod, Request, Response},
};
use std::future::Future;
use std::pin::Pin;
/// A boxed async handler used by the registry.
pub type BoxedHandler = fn(Request) -> Pin<Box<dyn Future<Output = Response> + Send + 'static>>;
#[derive(Clone, Copy)]
pub struct ServiceEntry {
    pub method: HttpMethod,
    pub uri: &'static str,
    pub handler: BoxedHandler,
}
#[derive(Default)]
pub struct ServiceRegistry {
    entries: Vec<ServiceEntry>,
}
impl ServiceRegistry {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn register<S: Service>(&mut self) -> &mut Self {
        /// Type-erase the async handler into a boxed future.
        fn wrap<S: Service>(
            req: Request,
        ) -> Pin<Box<dyn Future<Output = Response> + Send + 'static>> {
            Box::pin(S::handle(req))
        }
        self.entries.push(ServiceEntry {
            method: S::method(),
            uri: S::uri(),
            handler: wrap::<S>,
        });
        self
    }
    pub fn entries(&self) -> &[ServiceEntry] {
        &self.entries
    }
}
/// Declare the full service list in ONE place.
///
/// Usage:
/// ```ignore
/// services![GetService, PostService, PutService];
/// ```
#[macro_export]
macro_rules! services {
    ($($svc:path),* $(,)?) => {
        /// The static list of all services to expose.
        pub fn all_services() -> $crate::registry::ServiceRegistry {
            let mut reg = $crate::registry::ServiceRegistry::new();
            $( reg.register::<$svc>(); )*
            reg
        }
    };
}
