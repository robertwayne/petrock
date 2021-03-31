import * as fastify from 'fastify'
import { FastifyReply, FastifyRequest } from 'fastify'
import fastifyStatic from 'fastify-static'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyPostgres from 'fastify-postgres'
import * as path from 'path'
import { DB_CONNECTION_STRING } from './db'
import type { Query } from '../../shared/types'

// @ts-ignore
const app: FastifyInstance = fastify.fastify({ logger: true })

app.register(fastifyStatic, {
    root: path.resolve('../client/build'),
})

if (process.env.NODE_ENV === 'development') {
    app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                'default-src': '*',
            },
        },
    })
} else {
    app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                'default-src': ["'self'"],
                'font-src': ["'self'", 'fonts.gstatic.com', 'data:'],
                'object-src': ["'none'"],
                'style-src': ["'self'", 'fonts.googleapis.com'],
                'style-src-elem': ["'self'", 'fonts.googleapis.com'],
                'connect-src': ["'self'", 'https://*'],
            },
        },
    })
}

app.register(fastifyCors, {
    origin: 'https://petrock.gg',
})

app.register(fastifyPostgres, {
    connectionString: DB_CONNECTION_STRING,
})

const options: fastify.RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                sort: {
                    type: 'string',
                },
                asc: {
                    type: 'string',
                },
            },
        },
    },
}

app.get(
    '/',
    async (_: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
        return res.sendFile('index.html')
    }
)

app.get<Query>('/api/v1/update', options, async (request, _) => {
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
        default: {
            sortBy = 'total_experience'
            break
        }
    }

    let sortAsc: string
    switch (request.query.asc) {
        case 'true': {
            sortAsc = 'ASC'
            break
        }
        default: {
            sortAsc = 'DESC'
            break
        }
    }

    const { rows } = await client.query(
        `
        SELECT p.username, lb.total_experience, lb.daily_experience, lb.weekly_experience, lb.monthly_experience
        FROM leaderboards lb
        INNER JOIN players p ON (lb.player = p.username)
        ORDER BY lb.${sortBy} ${sortAsc};
        `
    )

    client.release()

    return rows
})

const start = async () => {
    try {
        await app.listen(3000)
        app.log.info(`Server listening on ${app.server.address().port}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()
