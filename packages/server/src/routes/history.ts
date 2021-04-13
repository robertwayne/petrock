import { FastifyInstance, FastifyRequest } from 'fastify'

type HistoryRequest = FastifyRequest<{
    Querystring: {
        username: string
        all: boolean
    }
}>

/** Returns a specific players' experience from the history table. */
export const routeHistory = async (app: FastifyInstance): Promise<void> => {
    app.get('/history', {}, async (request: HistoryRequest) => {
        const client = await app.pg.connect()

        if (!request.query.all) {
            const { rows } = await client.query(
                `
                SELECT 
                    p.username, h.experience, to_char(h.created_on, 'mm-dd-yyyy') AS created_on
                FROM history h
                INNER JOIN players p ON (h.player = p.username)
                WHERE h.player = $1 AND h.created_on = CURRENT_DATE;
                `,
                [request.query.username]
            )

            client.release()

            return rows.length > 0
                ? rows[0]
                : {
                      error: 'No results found.',
                  }
        } else {
            const { rows } = await client.query(
                `
                SELECT 
                    h.player, h.experience, to_char(h.created_on, 'mm-dd-yyyy') AS created_on
                FROM history h
                WHERE h.player = $1
                ORDER BY h.created_on DESC;
                `,
                [request.query.username]
            )
    
            client.release()
    
            return rows
        }
    })
}
