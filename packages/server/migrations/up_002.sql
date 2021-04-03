CREATE TABLE IF NOT EXISTS items
(
    id uuid DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    "level" INT NOT NULL,
    slot VARCHAR(255) NOT NULL,
    classes VARCHAR(255) NOT NULL,
    strength INT NOT NULL,
    intelligence INT NOT NULL,
    agility INT NOT NULL,
    defense INT NOT NULL,
    wisdom INT NOT NULL,
    luck INT NOT NULL,
    icon VARCHAR(255) DEFAULT 'notFound.png' NOT NULL,

    /* Meta Data */
    created_on TIMESTAMP DEFAULT now() NOT NULL
)