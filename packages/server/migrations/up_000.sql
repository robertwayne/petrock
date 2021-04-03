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

CREATE TYPE classes AS
(
    WR BOOLEAN,
    WZ BOOLEAN,
    CL BOOLEAN
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

INSERT INTO types (id, name)
VALUES
(1, 'Equipment'),
(2, 'Cosmetic'),
(3, 'Consumable'),
(4, 'Misc');

INSERT INTO slots (id, name)
VALUES
(1, 'Head'),
(2, 'Body'),
(3, 'Main Hand'),
(4, 'Off Hand'),
(5, 'Mask'),
(6, 'Outfit'),
(7, 'Clothes Dye'),
(8, 'Hair Dye');