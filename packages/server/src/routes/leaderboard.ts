import { FastifyInstance, FastifyRequest } from 'fastify'

type LeaderboardRequest = FastifyRequest<{
    Querystring: {
        order: string
        sort: string
    }
}>

/** Returns a the leaderboard table sorted & ordered based on query params. */
export const routeLeaderboard = async (app: FastifyInstance): Promise<void> => {
    app.get('/leaderboards', {}, async (request: LeaderboardRequest) => {
        const client = await app.pg.connect()

        let sortBy: string
        switch (request.query.sort) {
            case 'day': {
                sortBy = 'daily_experience'
                break
            }
            case 'week': {
                sortBy = 'weekly_experience'
                break
            }
            case 'month': {
                sortBy = 'monthly_experience'
                break
            }
            case 'total':
            default: {
                sortBy = 'experience'
                break
            }
        }

        let sortAsc: string
        switch (request.query.order) {
            case 'asc': {
                sortAsc = 'ASC'
                break
            }
            case 'desc':
            default: {
                sortAsc = 'DESC'
                break
            }
        }

        const { rows } = await client.query(
            `
            SELECT 
                p.username, p.online, p.experience, p.last_modified, h.experience AS daily_experience,
                w.experience AS weekly_experience, m.experience AS monthly_experience
            FROM history h
            INNER JOIN players p ON (h.player = p.username)
            CROSS JOIN LATERAL get_current_week_experience(p.username) w
            CROSS JOIN LATERAL get_current_month_experience(p.username) m
            WHERE h.created_on = CURRENT_DATE
            ORDER BY ${sortBy} ${sortAsc}, p.experience DESC, h.player ASC;
            `
        )

        client.release()

        return rows
    })
}
