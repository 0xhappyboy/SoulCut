mod config;
mod dao;
mod init;
mod registry;
mod service;
mod types;

#[tokio::main]
async fn main() {
    init::run_server().await;
}
