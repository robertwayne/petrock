use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Debug, Serialize, Deserialize)]
pub struct OnlineList {
    entries: Vec<String>,
}

#[get("/online")]
pub async fn get_online_players(pg: &State<PgPool>) -> Result<Json<OnlineList>, Status> {
    let results = sqlx::query!(
        r#"
        SELECT
            username
        FROM players
        WHERE online = true
        "#,
    )
    .fetch_all(&**pg)
    .await
    .map_err(|_| Status::InternalServerError)?;

    let mut entries = Vec::new();
    for result in results {
        entries.push(result.username);
    }

    Ok(Json(OnlineList { entries }))
}
