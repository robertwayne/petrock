import pino from 'pino'
import nodeFetch from 'node-fetch'
import dotenv from 'dotenv'
import { pool } from './connection'
import { logOptions } from '../../../shared/logging'
import type { Player, RawPlayerData } from '../../../shared/types'
import { PoolClient } from 'node-postgres'

dotenv.config()

const logger = pino(logOptions)
const current_leaderboards: Array<Player> = []

const runner = async (): Promise<void> => {
    const client: PoolClient = await pool.connect()
    await fetchData(client)
    setInterval(fetchData, Number(process.env.TICK_RATE), client)
}

const fetchData = async (client: PoolClient) => {
    logger.info('Checking for updates...')

    let response = undefined

    try {
        response = await nodeFetch('https://play.retro-mmo.com/leaderboards.json', {})
    } catch (err) {
        logger.error(`Error fetching data from RetroMMO API.\n${err}`)
        return
    }

    const data: Array<RawPlayerData> = await response.json()

    for (const [index, player] of Object.entries(data)) {
        const _player: Player = {
            username: player.username,
            total_experience: Number(player.experience),
        }

        let experience_diff = 0
        if (current_leaderboards[index] != null) {
            const tmp_player: Player = current_leaderboards[index]
            experience_diff = _player.total_experience - tmp_player.total_experience

            if (experience_diff !== 0) {
                logger.info(`${_player.username} gained ${experience_diff} experience.`)
            }
        }

        current_leaderboards[index] = _player
        try {
            await client.query('BEGIN')
            await client.query({
                name: 'add-user',
                text: `INSERT INTO players (username) 
                VALUES ($1) 
                ON CONFLICT ON CONSTRAINT players_pkey 
                DO NOTHING;`,
                values: [_player.username],
            })

            await client.query({
                name: 'update-leaderboards-tmp',
                text: `
                INSERT INTO leaderboards (player, total_experience, daily_experience, weekly_experience, monthly_experience)
                VALUES ($1, $3, 0, 0, 0)
                ON CONFLICT ON CONSTRAINT leaderboards_player_key
                DO UPDATE 
                SET
                    total_experience = $2,
                    daily_experience = COALESCE(leaderboards.daily_experience + $3)
                WHERE leaderboards.player = $1;`,
                values: [_player.username, _player.total_experience, experience_diff],
            })

            await client.query({
                name: 'update-history',
                text: `
                INSERT INTO history (player, experience)
                VALUES ($1, $2)
                ON CONFLICT ON CONSTRAINT history_player_key
                DO UPDATE
                SET
                    experience = COALESCE(history.experience + $2)
                WHERE history.player = $1;
                `,
                values: [_player.username, experience_diff],
            })

            await client.query('COMMIT')
        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        }
    }
}

runner()
