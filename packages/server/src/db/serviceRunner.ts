import pino from 'pino'
import nodeFetch from 'node-fetch'
import dotenv from 'dotenv'
import { pool } from './connection'
import { logOptions } from '../../../shared/logging'
import { PoolClient } from 'node-postgres'
import { currentTimestampAsISO } from '../helpers'
import type { Player, RawPlayerData } from '../../../shared/types'

dotenv.config()

const logger = pino(logOptions)
const current_leaderboards: Array<Player> = []

/** Starts a continuous database runner on an interval. Collects data from the
 * RetroMMO API and ingests it into the PetRock database.
 */
const runner = async (): Promise<void> => {
    const client: PoolClient = await pool.connect()
    await updateDatabase(client)
    setInterval(updateDatabase, Number(10000), client)
}

/** Returns an array of player names that are currently online. */
const getOnlinePlayers = async (): Promise<Array<string>> => {
    let response = undefined

    try {
        response = await nodeFetch('https://play.retro-mmo.com/players.json')
    } catch (err) {
        logger.error(`Error fetching online players from RetroMMO API.`)
        return
    }

    return await response.json()
}

/** Executes a set of queries for updating players and history tables.. */
const executeQueries = async (client: PoolClient, player: Player, diff: number): Promise<void> => {
    try {
        await client.query({
            name: 'add-user',
            text: `INSERT INTO players (username, online)
        VALUES ($1, $2) 
        ON CONFLICT ON CONSTRAINT players_pkey
        DO UPDATE
        SET
            online = $2
        WHERE players.username = $1;
        `,
            values: [player.username, player.online],
        })

        await client.query({
            name: 'update-history',
            text: `
        INSERT INTO history (player, experience)
        VALUES ($1, $2)
        ON CONFLICT (player, created_on)
        DO UPDATE
        SET
            experience = COALESCE(history.experience + $2)
        WHERE history.player = $1;
        `,
            values: [player.username, diff],
        })

        await client.query('COMMIT')
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    }
}

const updateDatabase = async (client: PoolClient) => {
    logger.info('Checking for updates...')

    let responsePlayers = undefined
    let responseLeaderboards = undefined

    try {
        responsePlayers = await nodeFetch('https://play.retro-mmo.com/players.json')
        responseLeaderboards = await nodeFetch('https://play.retro-mmo.com/leaderboards.json')
    } catch (err) {
        logger.error(`Error fetching data from RetroMMO API.\n${err}`)
        return
    }

    const onlinePlayers = await responsePlayers.json()
    const data: Array<RawPlayerData> = await responseLeaderboards.json()
    const notChecked = onlinePlayers

    for (const [index, player] of Object.entries(data)) {
        if (notChecked.includes(player.username)) {
            notChecked.filter((s) => s !== player.username)
        }

        const _player: Player = {
            username: player.username,
            online: onlinePlayers.some((s) => s === player.username),
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
        await executeQueries(client, _player, experience_diff)

        // for (const player of notChecked) {
        //     let response = undefined

        //     try {
        //         response = await nodeFetch(`${process.env.RETRO_API_PLAYER}/${player}.json`)
        //     } catch (err) {
        //         logger.error(`Error fetching data from RetroMMO API.\n${err}`)
        //         return
        //     }

        //     const data: RawPlayerData = await response.json()

        //     const _player: Player = {
        //         username: data.username,
        //         online: true,
        //         total_experience: Number(data.experience),
        //     }

        //     const index = current_leaderboards.findIndex(_player)
        //     if (current_leaderboards.f) current_leaderboards[index] = _player
        // }
    }
}

runner()
