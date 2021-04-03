import { FastifyInstance, FastifyRequest } from 'fastify'

// type LeaderboardRequest = FastifyRequest<{
//     Querystring: {
//         order: string
//         sort: string
//     }
//}>

export const routeItems = async (app: FastifyInstance): Promise<void> => {
    app.get('/leaderboards', {}, async (request: FastifyRequest) => {
        const client = await app.pg.connect()

        const { rows } = await client.query(
            `
            SELECT *
            FROM items i;
            `
        )

        client.release()

        return rows
    })
}
