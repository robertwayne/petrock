use chrono::{DateTime, Utc};
use rocket::{http::Status, serde::json::Json};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ChangeLogEntry {
    pub date: DateTime<Utc>,
    pub version: String,
    pub changes: Vec<String>,
}

#[get("/changelog")]
pub async fn get_changelog() -> Result<Json<Vec<ChangeLogEntry>>, Status> {
    let change = ChangeLogEntry {
        date: Utc::now(),
        version: "0.1".to_string(),
        changes: vec!["Added changelog".to_string()],
    };

    Ok(Json(vec![change]))
}
