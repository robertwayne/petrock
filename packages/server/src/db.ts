import { Pool } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

export const pool: Pool = new Pool({
    user: process.env.NODE_ENV === 'production' ? process.env.PGUSER : 'postgres',
    host: process.env.NODE_ENV === 'production' ? process.env.PGHOST : 'localhost',
    database: process.env.NODE_ENV === 'production' ? process.env.PGDATABASE : 'postgres',
    password: process.env.NODE_ENV === 'production' ? process.env.PGPASSWORD : 'postgres',
    port: process.env.NODE_ENV === 'production' ? Number(process.env.PGPORT) : 5432,
})

export const DB_CONNECTION_STRING = `postgresql://postgres:postgres@localhost:5432/postgres`
