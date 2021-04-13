import { FastifyInstance, FastifyRequest } from 'fastify'

type HistoryRequest = FastifyRequest<{
    Querystring: {
        username: string
    }
}>

/** Returns a specific players' experience from the history table. */
export const routeHistory = async (app: FastifyInstance): Promise<void> => {
    app.get('/history', {}, async (request: HistoryRequest) => {
        const client = await app.pg.connect()

        const { rows } = await client.query(
            `
            SELECT 
                p.username, h.experience
            FROM history h
            INNER JOIN players p ON (h.player = p.username)
            WHERE h.player = $1 AND h.created_on = CURRENT_DATE;
            `,
            [request.query.username]
        )

        client.release()

        return rows.length > 0 ? rows[0] : {
            error: 'No results found.'
        }
    })
}
