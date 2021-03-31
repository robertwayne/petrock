import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

export const pool: Pool = new Pool({
    user: process.env.NODE_ENV === 'production' ? process.env.DB_USER : 'postgres',
    host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
    database: process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE : 'postgres',
    password: process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : 'postgres',
    port: process.env.NODE_ENV === 'production' ? Number(process.env.DB_PORT) : 5432,
})

export const DB_CONNECTION_STRING = `postgresql://postgres:postgres@localhost:5432/postgres`
