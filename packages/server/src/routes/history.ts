import { FastifyInstance, FastifyRequest } from 'fastify'

type HistoryRequest = FastifyRequest<{
    Querystring: {
        username: string
        all: string
        tooltip: string
    }
}>

/** Returns a specific players' experience from the history table. */
export const routeHistory = async (app: FastifyInstance): Promise<void> => {
    app.get('/history', {}, async (request: HistoryRequest) => {
        const client = await app.pg.connect()

        if (request.query.all) {
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
        } else if (request.query.tooltip) {
            const { rows } = await client.query(
                `
                SELECT 
                    h.player, h.experience, p.last_modified, to_char(h.created_on, 'mm-dd-yyyy') AS created_on,
                    lw.experience AS last_weeks_experience, lm.experience AS last_months_experience
                FROM history h
                INNER JOIN players p ON p.username = h.player
                CROSS JOIN LATERAL get_last_week_experience($1) lw
                CROSS JOIN LATERAL get_last_month_experience($1) lm
                WHERE h.player = $1
                ORDER BY h.created_on DESC;
                `,
                [request.query.username]
            )

            client.release()

            return { ...rows[0], yesterdays_experience: rows[1]?.experience || 0 }
        } else {
            const { rows } = await client.query(
                `
                SELECT 
                    p.username, h.experience, to_char(h.created_on, 'mm-dd-yyyy') AS created_on
                FROM history h
                INNER JOIN players p ON (h.player = p.username)
                WHERE h.player = $1 AND h.created_on = CURRENT_DATE
                `,
                [request.query.username]
            )

            client.release()

            return rows.length > 0
                ? rows[0]
                : {
                      error: 'No results found.',
                  }
        }
    })
}
