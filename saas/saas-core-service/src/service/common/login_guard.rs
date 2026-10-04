use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};
/// Max failed attempts before lockout.
const MAX_FAILED: u32 = 5;
/// Lockout duration after too many failures.
const LOCK_DURATION: Duration = Duration::from_secs(15 * 60);
struct Entry {
    failed: u32,
    locked_until: Option<Instant>,
}
static GUARD: Mutex<Option<HashMap<String, Entry>>> = Mutex::new(None);
fn with_map<F, R>(f: F) -> R
where
    F: FnOnce(&mut HashMap<String, Entry>) -> R,
{
    let mut guard = GUARD.lock().unwrap();
    let map = guard.get_or_insert_with(HashMap::new);
    f(map)
}
/// Returns Ok(()) if the username is allowed to try a login, Err(seconds_remaining) if it is currently locked.
pub fn check_allowed(username: &str) -> Result<(), u64> {
    with_map(|map| match map.get(username) {
        Some(entry) => match entry.locked_until {
            Some(until) if until > Instant::now() => {
                let remain = until.duration_since(Instant::now()).as_secs();
                Err(remain)
            }
            _ => Ok(()),
        },
        None => Ok(()),
    })
}
/// Record a successful login: clear failure state.
pub fn record_success(username: &str) {
    with_map(|map| {
        map.remove(username);
    });
}
/// Record a failed login: increment counter and lock if too many.
pub fn record_failure(username: &str) {
    with_map(|map| {
        let entry = map.entry(username.to_string()).or_insert(Entry {
            failed: 0,
            locked_until: None,
        });
        entry.failed += 1;
        if entry.failed >= MAX_FAILED {
            entry.locked_until = Some(Instant::now() + LOCK_DURATION);
            entry.failed = 0;
        }
    });
}
