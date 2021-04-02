import { Pool } from 'pg'

const user = process.env.NODE_ENV === 'production' ? process.env.DB_USER : 'test_admin'
const host = process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost'
const database = process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE : 'leaderboards'
const password = process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : 'test123'
const port = process.env.NODE_ENV === 'production' ? Number(process.env.DB_PORT) : 5432

export const pool: Pool = new Pool({
    user,
    host,
    database,
    password,
    port,
})

export const DB_CONNECTION_STRING =
    process.env.NODE_ENV === 'production'
        ? process.env.DB_URI
        : `postgresql://${user}:${password}@${host}:${port}/${database}`
