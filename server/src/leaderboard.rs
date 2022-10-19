use chrono::NaiveDateTime;
use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Serialize, Deserialize)]
pub struct Leaderboard {
    entries: Vec<LeaderboardEntry>,
}

#[derive(Serialize, Deserialize)]
pub struct LeaderboardEntry {
    username: String,
    online: bool,
    last_modified: NaiveDateTime,
    rank: i32,
    experience: i32,
    daily_experience: i32,
    weekly_experience: i32,
    monthly_experience: i32,
}

#[get("/leaderboards?<page>&<_sort>&<_order>")]
pub async fn get_leaderboard_page(
    page: Option<i64>,
    _sort: Option<String>,
    _order: Option<String>,
    pg: &State<PgPool>,
) -> Result<Json<Leaderboard>, Status> {
    // let result = sqlx::query!(
    //     r#"SELECT p.username, p.online, p.experience, p.last_modified, h.experience AS daily_experience, w.experience AS weekly_experience, m.experience AS monthly_experience
    //     FROM history h
    //     INNER JOIN players p ON (h.player = p.username)
    //     CROSS JOIN LATERAL get_current_week_experience(p.username) w
    //     CROSS JOIN LATERAL get_current_month_experience(p.username) m
    //     WHERE h.created_on = CURRENT_DATE
    //     ORDER BY p.experience DESC, h.player ASC
    //     LIMIT 100 OFFSET $1"#,
    //     // sort.unwrap_or("experience".to_string()),
    //     // order.unwrap_or("DESC".to_string()),
    //     page.unwrap_or(1) * 100
    // )
    // .fetch_all(&**pg)
    // .await
    // .map_err(|_| Status::InternalServerError)?;
    let offset = page.unwrap_or(0) * 100;
    let result = sqlx::query!(
        r#"SELECT p.username, p.rank, p.online, p.experience, p.last_modified
        FROM players p
        ORDER BY p.rank
        LIMIT 100 OFFSET $1"#,
        // sort.unwrap_or("experience".to_string()),
        // order.unwrap_or("DESC".to_string()),
        offset
    )
    .fetch_all(&**pg)
    .await
    .map_err(|_| Status::InternalServerError)?;

    let mut entries = Vec::new();
    for row in result {
        let entry = LeaderboardEntry {
            username: row.username,
            rank: row.rank,
            online: row.online,
            last_modified: row.last_modified,
            experience: row.experience,
            daily_experience: 0,
            weekly_experience: 0,
            monthly_experience: 0,
        };
        entries.push(entry);
    }

    Ok(Json(Leaderboard { entries }))
}
