CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS players
(
    id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    online BOOLEAN DEFAULT false NOT NULL,
    experience INT DEFAULT 0 NOT NULL,  /* We track total experience here because we don't have a complete history. */
    rank INT,

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL,
    last_modified TIMESTAMP DEFAULT now() NOT NULL
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
    player VARCHAR(255) NOT NULL,
--     CONSTRAINT fk_player FOREIGN KEY (player) REFERENCES players (username),

    experience INT NOT NULL,

    /* Meta Data */
    created_on TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
    last_modified TIMESTAMP DEFAULT now() NOT NULL,

    /* Composite Primary Key */
    PRIMARY KEY (player, created_on)
);

CREATE TABLE IF NOT EXISTS types
(
    id INT UNIQUE PRIMARY KEY NOT NULL,
    name VARCHAR(16) NOT NULL
);

CREATE TABLE IF NOT EXISTS slots
(
    id INT UNIQUE PRIMARY KEY NOT NULL,
    name VARCHAR(16) NOT NULL
);

CREATE TABLE IF NOT EXISTS items
(
    id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    description TEXT,
    level INT,
    slot INT,
    type INT NOT NULL,
    consumable BOOLEAN,
    usable_by classes,
    strength INT,
    intelligence INT,
    agility INT,
    defense INT,
    wisdom INT,
    luck INT,
    can_sell BOOLEAN NOT NULL,
    sell_price INT,
    icon VARCHAR(255) DEFAULT 'notFound.png' NOT NULL,

    /* Foreign Keys */
    CONSTRAINT fk_slot FOREIGN KEY (slot) REFERENCES slots (id),
    CONSTRAINT fk_type FOREIGN KEY (type) REFERENCES types (id),

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL
);