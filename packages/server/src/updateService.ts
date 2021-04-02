import nodeFetch from 'node-fetch'
import { pool } from './db'
import * as pino from 'pino'
import { logOptions } from '../../shared/logging'
import type { Player, RawPlayerData } from '../../shared/types'
import dotenv from 'dotenv'

dotenv.config()

const logger = pino.pino(logOptions)

const current_leaderboards: Array<Player> = []

const fetchData = async () => {
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

        await pool.query({
            name: 'add-user',
            text: `INSERT INTO players (username) 
            VALUES ($1) 
            ON CONFLICT ON CONSTRAINT players_pkey 
            DO NOTHING;`,
            values: [_player.username]
        })

        await pool.query({
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
            values: [_player.username, _player.total_experience, experience_diff]
        })

        await pool.query({
            name: 'update-history',
            text: `
            INSERT INTO history (player, experience)
            VALUES ($1, $3)
            ON CONFLICT ON CONSTRAINT history_player_key
            DO UPDATE
            SET
                experience = COALESCE(history.experience + $2)
            WHERE history.player = $1;
            `,
            values: [_player.username, _player.total_experience, experience_diff]
        })
    }
}

const updater = async (): Promise<void> => {
    pool.connect()

    await fetchData()
    setInterval(fetchData, Number(process.env.TICK_RATE))
}

updater()
