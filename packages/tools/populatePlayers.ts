import nodeFetch from 'node-fetch'
import { pool } from '../server/src/db/connection'
import type { Player, RawPlayerData } from '../shared/types'
import { PoolClient } from 'node-postgres'

const runner = async (): Promise<void> => {
    const client: PoolClient = await pool.connect()
    await fetchData(client)
    
    console.info('Finished ingesting data.')
    return
}

const fetchData = async (client: PoolClient) => {
    let response = undefined
    for (let i = 1; i < 10000; i++) {
        try {
            response = await nodeFetch(`https://play.retro-mmo.com/leaderboards.json?page=${i}`)
            console.info('Got data from page ', i)
        } catch (err) {
            console.info('Out of data.')
            break
        }

        const data: Array<RawPlayerData> = await response.json()
        console.log(`Inserting ${data.length} players.`)

        for (const [_, player] of Object.entries(data)) {
            const _player: Player = {
                username: player.username,
                online: false,
            }

            await client.query({
                name: 'add-user',
                text: `INSERT INTO players (username, online)
                    VALUES ($1, $2) 
                    ON CONFLICT ON CONSTRAINT players_pkey 
                    DO NOTHING`,
                values: [_player.username, _player.online],
            })
        }
    }
}

runner()
