use crate::utils;
use sqlx::{sqlite::SqliteConnectOptions, ConnectOptions, Result, SqliteConnection};
use std::str::FromStr;
use tauri::api::path::data_dir;

pub const DATABASE_NAME: &str = "data.db";

pub fn db_url() -> String {
    return format!(
        "sqlite:{}",
        data_dir()
            .unwrap()
            .join(utils::APP_SYMBOL)
            .join(DATABASE_NAME)
            .to_str()
            .unwrap()
    );
}

pub async fn connect_db() -> Result<SqliteConnection> {
    return SqliteConnectOptions::from_str(&db_url())?
        .create_if_missing(true)
        .connect()
        .await;
}
