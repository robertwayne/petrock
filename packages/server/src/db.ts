import { Pool } from 'pg'

export const pool: Pool = new Pool({
    user: process.env.NODE_ENV === 'production' ? process.env.DB_USER : 'test_admin',
    host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
    database: process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE : 'leaderboards',
    password: process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : 'test123',
    port: process.env.NODE_ENV === 'production' ? Number(process.env.DB_PORT) : 5432,
})

export const DB_CONNECTION_STRING =
    process.env.NODE_ENV === 'production'
        ? process.env.DB_URI
        : `postgresql://test_admin:test123@localhost:5432/leaderboards`
