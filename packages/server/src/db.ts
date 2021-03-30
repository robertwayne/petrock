import { Pool } from 'pg'
const types = require('pg').types
require('dotenv').config()


export const pool: Pool = new Pool({
    user: process.env.NODE_ENV === 'production' ? process.env.PGUSER : 'test_admin',
    host: process.env.NODE_ENV === 'production' ? process.env.PGHOST : 'localhost',
    database: process.env.NODE_ENV === 'production' ? process.env.PGDATABASE : 'leaderboards',
    password: process.env.NODE_ENV === 'production' ? process.env.PGPASSWORD : 'test123',
    port: process.env.NODE_ENV === 'production' ? Number(process.env.PGPORT) : 5432,
})

export const DB_CONNECTION_STRING: string = `postgresql://test_admin:test123@localhost:5432/leaderboards`