import nodeFetch from 'node-fetch'
import { Pool } from 'pg'
import { pool } from './db'

// TODO: figure out why index.d.ts isn't being read from here
type Player = {
    username: string
    experience: number
}

type RawPlayerData = {
    username: string
    experience: number
}

let current_leaderboards: Array<Player> = []

const updater = async (): Promise<void> => {
    pool.connect()

    setInterval(async () => {
        const response = await nodeFetch('https://play.retro-mmo.com/leaderboards.json', {})
        const data: Array<RawPlayerData> = await response.json()

        let rows = []

        for (const [index, player] of Object.entries(data)) {
            let _player: Player = {
                username: player.username,
                experience: Number(player.experience),
            }

            let experience_diff: number = 0
            if (current_leaderboards[index] != null) {
                let tmp_player: Player = current_leaderboards[index]
                let time = new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
                experience_diff = _player.experience - tmp_player.experience
                if (experience_diff !== 0) {
                    console.log(`[${time}] ${_player.username} gained ${experience_diff} experience.`)
                }
            }

            current_leaderboards[index] = _player

            const row = await pool.query(
                `
                
                INSERT INTO players (username)
                VALUES ('${_player.username}')
                ON CONFLICT ON CONSTRAINT players_pkey
                DO NOTHING;

                INSERT INTO leaderboards (player, total_experience, daily_experience, weekly_experience, monthly_experience)
                VALUES ('${_player.username}', '${_player.experience}', 0, 0, 0)
                ON CONFLICT ON CONSTRAINT leaderboards_player_key
                DO UPDATE 
                SET
                    total_experience = '${_player.experience}',
                    daily_experience = COALESCE(leaderboards.daily_experience + '${experience_diff}')
                WHERE leaderboards.player = '${_player.username}';
                `
            )

            rows.push(row)
        }
    }, 10000)
}

const resetDaily = async (pool: Pool): Promise<void> => {
    console.log('Not implemented.')
}

updater()
