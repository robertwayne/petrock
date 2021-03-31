import nodeFetch from 'node-fetch'
import { pool } from './db'
import type { Player, RawPlayerData } from '../../shared/types'

const current_leaderboards: Array<Player> = []

const updater = async (): Promise<void> => {
    pool.connect()

    setInterval(async () => {
        const response = await nodeFetch('https://play.retro-mmo.com/leaderboards.json', {})
        const data: Array<RawPlayerData> = await response.json()

        const rows = []

        for (const [index, player] of Object.entries(data)) {
            const _player: Player = {
                username: player.username,
                total_experience: Number(player.experience),
            }

            let experience_diff = 0
            if (current_leaderboards[index] != null) {
                const tmp_player: Player = current_leaderboards[index]
                const time = new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
                experience_diff = _player.total_experience - tmp_player.total_experience
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
                VALUES ('${_player.username}', '${_player.total_experience}', 0, 0, 0)
                ON CONFLICT ON CONSTRAINT leaderboards_player_key
                DO UPDATE 
                SET
                    total_experience = '${_player.total_experience}',
                    daily_experience = COALESCE(leaderboards.daily_experience + '${experience_diff}')
                WHERE leaderboards.player = '${_player.username}';
                `
            )

            rows.push(row)
        }
    }, Number(process.env.TICK_RATE))
}

updater()
