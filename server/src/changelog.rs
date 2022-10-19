use chrono::{DateTime, Utc};
use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChangeLog {
    entries: Vec<ChangeLogEntry>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChangeLogEntry {
    pub date: DateTime<Utc>,
    pub changes: Vec<String>,
}

#[get("/changelog")]
pub async fn get_changelog(pg: &State<PgPool>) -> Result<Json<ChangeLog>, Status> {
    let results = sqlx::query!(
        r#"
        SELECT
            date,
            changes
        FROM changelog
        ORDER BY date DESC
        "#,
    )
    .fetch_all(&**pg)
    .await
    .map_err(|_| Status::InternalServerError)?;

    let mut entries = Vec::new();
    for result in results {
        let entry = ChangeLogEntry { date: result.date, changes: result.changes };
        entries.push(entry);
    }

    Ok(Json(ChangeLog { entries }))
}
