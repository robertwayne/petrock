CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS leaderboardsv2
(
    id uuid DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,

    /* Experience Data */
    total_experience INT NOT NULL,
    daily_experience INT NOT NULL,
    weekly_experience INT NOT NULL,
    monthly_experience INT NOT NULL,

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL,
    last_modified TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS player
(
    id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL
);

/* History represents a series of leaderboard experience data. Each row is constrained to a player and contains time */
CREATE TABLE IF NOT EXISTS history
(

);