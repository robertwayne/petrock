import { FastifyInstance, FastifyRequest } from 'fastify'

type HistoryRequest = FastifyRequest<{
    Querystring: {
        username: string
    }
}>

export const routeHistory = async (app: FastifyInstance): Promise<void> => {
    app.get('/history', {}, async (request: HistoryRequest) => {
        const client = await app.pg.connect()
        console.log('REQUESTTTTTTTTTTTTTTTTTTTTTTTTTTT')

        const { rows } = await client.query(
            `
            SELECT 
                p.username, h.experience
            FROM history h
            INNER JOIN players p ON (h.player = p.username)
            WHERE h.player = $1;
            `, [request.query.username]
        )

        client.release()

        return rows
    })
}
