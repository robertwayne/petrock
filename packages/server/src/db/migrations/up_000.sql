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

CREATE FUNCTION player_update()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS $$
BEGIN
    IF OLD.online = NEW.online THEN
        NEW.last_modified = OLD.last_modified;
    ELSE
        NEW.last_modified = now();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_update_trigger
BEFORE INSERT OR UPDATE ON players
FOR EACH ROW
EXECUTE PROCEDURE player_update();

CREATE FUNCTION history_update()
RETURNS TRIGGER
LANGUAGE 'plpgsql'
AS $$
BEGIN
    IF OLD.experience = NEW.experience THEN
        NEW.last_modified = OLD.last_modified;
    ELSE
        NEW.last_modified = now();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_update_history
BEFORE INSERT OR UPDATE ON history
FOR EACH ROW
EXECUTE PROCEDURE history_update();

CREATE OR REPLACE FUNCTION get_last_week_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7
    AND NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER;
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION get_last_month_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    AND h.created_on < DATE_TRUNC('month', NOW())
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION get_current_month_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on >= DATE_TRUNC('month', CURRENT_DATE)
$BODY$
LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION get_current_week_experience(username TEXT)
RETURNS TABLE(experience INT)
AS $BODY$
    SELECT COALESCE(SUM (h.experience), 0)
    FROM history h
    WHERE h.player = username
    AND h.created_on >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'
    AND h.created_on < NOW()
$BODY$
LANGUAGE 'sql';

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

INSERT INTO items (name, description, level, slot, type, consumable, usable_by, strength,
                   intelligence, agility, defense, wisdom, luck, can_sell, sell_price)
VALUES
('Cypress Stick', NULL, 1, 3, 1, false, (true, true, true), 1, 0, 0, 0, 0, 0, true, 1),
('Oaken Club', NULL, 2, 3, 1, false, (true, false, true), 2, 0, 0, 0, 0, 0, true, 2),
('Leather Cap', NULL, 1, 1, 1, false, (true, true, true), 0, 0, 0, 1, 0, 0, true, 1),
('Training Sword', NULL, 4, 3, 1, false, (true, false, false), 5, 0, 0, 0, 0, 0, true, 45),
('Training Wand', NULL, 4, 3, 1, false, (false, true, true), 1, 3, 0, 0, 0, 0, true, 52),
('Leather Armor', NULL, 3, 2, 1, false, (true, false, false), 0, 0, 0, 3, 0, 0, true, 24),
('Padded Garb', NULL, 3, 2, 1, false, (false, false, true), 0, 0, 0, 2, 1, 0, true, 18),
('Tattered Cloak', NULL, 2, 2, 1, false, (false, false, true), 0, 0, 0, 1, 1, 0, true, 12),
('Wooden Shield', NULL, 2, 4, 1, false, (true, false, false), 0, 0, 0, 2, 0, 0, true, 1),
('Simple Bracelet', NULL, 2, 4, 1, false, (false, true, true), 0, 0, 0, 1, 1, 0, true, 1),

('Health Potion', 'Restores 30 HP to an ally.', NULL, NULL, 3, true, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 3),
('Mana Potion', 'Restores 20 MP to an ally.', NULL, 3, 3, true, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 7),
('Teleport Scroll', 'Return the party to the last visited town.', NULL, NULL, 3, true, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 10),

('Pet Rock', 'It literally does nothing.', NULL, NULL, 4, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Sunglasses', 'Deal with it.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Pink Hair Dye', 'Valentine''s Day hair dye.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Princess Crown', 'Valentine''s Day mask.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Devil Horns', 'Valentine''s Day mask.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Rockstar Hair', 'Valentine''s Day mask.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1),
('Messy Hair', 'Just the right amount of messy.', NULL, NULL, 2, false, (true, true, true), NULL, NULL, NULL, NULL, NULL, NULL, true, 1)
;
