import { Player } from "../../../shared/aaa"
import { PoolClient } from "node-postgres"
import { pool } from "../../src/db/connection"
import { readFileSync } from "fs"

interface HistoricRecords {
    time: number
    experience: number
}

interface RawJSON {
    username: string
    history: Array<HistoricRecords>
}

const runner = async (): Promise<void> => {
    const client: PoolClient = await pool.connect()
    await processRawHistoryFile(client)

    console.info("Finished processing data.")
    process.exit()
}

const processRawHistoryFile = async (client: PoolClient) => {
    const data = readFileSync(
        "./packages/tools/process-raw-history/raw_history.json",
        "utf-8"
    )
    const parsed: RawJSON = JSON.parse(data)

    for (const [_, player] of Object.entries(parsed)) {
        let _player: Player = {
            username: player.username,
        }

        let history: HistoricRecords = player.history
        for (const [i, record] of Object.entries(history).reverse()) {
            let index = Number(i)
            if (index === 0) {
                _player.experience = record.experience
            } else {
                _player.experience =
                    record.experience - player.history[index - 1].experience
            }

            _player.created_on = new Date(record.time)

            console.log(
                `Starting query ${index + 1}/${player.history.length} for ${
                    _player.username
                }.`
            )
            await client.query({
                name: "add-old-history",
                text: `
                INSERT INTO history (player, experience, created_on)
                VALUES ($1, $2, $3)
                ON CONFLICT (player, created_on)
                DO NOTHING;
                `,
                values: [
                    _player.username,
                    _player.experience,
                    _player.created_on,
                ],
            })
            console.log(`Added historical node for ${_player.created_on}.`)
        }
    }
}

runner()
