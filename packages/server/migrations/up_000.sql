CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS players
(
    id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    online BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS leaderboards
(
    id uuid DEFAULT uuid_generate_v4(),
    player VARCHAR(255) UNIQUE NOT NULL,
    CONSTRAINT fk_player FOREIGN KEY (player) REFERENCES players (username),

    /* Experience Data */
    total_experience INT NOT NULL,
    daily_experience INT NOT NULL,
    weekly_experience INT NOT NULL,
    monthly_experience INT NOT NULL,

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL,
    last_modified TIMESTAMP DEFAULT now() NOT NULL
);

/* History represents a series of leaderboard experience data. Each row is constrained to a player and contains time and the experience earned that day.*/
CREATE TABLE IF NOT EXISTS history
(
    id uuid DEFAULT uuid_generate_v4(),
    player VARCHAR(255) UNIQUE NOT NULL,
    CONSTRAINT fk_player FOREIGN KEY (player) REFERENCES players (username),

    experience INT NOT NULL,

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS slots
(
    id SERIAL2 UNIQUE PRIMARY KEY NOT NULL,
    name VARCHAR(16) NOT NULL,
);

CREATE TABLE IF NOT EXISTS classes
(
    classifier VARCHAR(2) PRIMARY KEY NOT NULL,
    name VARCHAR(16)
)

CREATE TABLE IF NOT EXISTS items
(
    id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    level INT NOT NULL,
    slot VARCHAR(255) NOT NULL,
    classes VARCHAR(255) NOT NULL,
    strength INT NOT NULL,
    intelligence INT NOT NULL,
    agility INT NOT NULL,
    defense INT NOT NULL,
    wisdom INT NOT NULL,
    luck INT NOT NULL,
    icon VARCHAR(255) DEFAULT 'notFound.png' NOT NULL,

    /* Foreign Keys */
    CONSTRAINT fk_slot FOREIGN KEY (slot) REFERENCES slots (id),
    CONSTRAINT fk_classes FOREIGN KEY (classes) REFERENCES classes (classifier),

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL
)