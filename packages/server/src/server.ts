import * as fastify from 'fastify'
import * as path from 'path'
import pino from 'pino'
import fastifyStatic from 'fastify-static'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyPostgres from 'fastify-postgres'
import dotenv from 'dotenv'
import { FastifyReply, FastifyRequest } from 'fastify'
import { connectionOptions } from './db/connection'
import { logOptions } from '../../shared/logging'
import { routeLeaderboard } from './routes/leaderboard'
import { routeItems } from './routes/items'
import { routeHistory } from './routes/history'

dotenv.config()

const logger = pino(logOptions)

// @ts-ignore
export const app: FastifyInstance = fastify.fastify({ logger })

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
    origin: process.env.NODE_ENV === 'production' ? 'https://petrock.gg' : '*',
})

app.register(fastifyPostgres, {
    ...connectionOptions,
})

app.register(routeLeaderboard, { prefix: '/api/v1' })
app.register(routeItems, { prefix: '/api/v1' })
app.register(routeHistory, { prefix: '/api/v1' })

app.get(
    '/',
    async (_: FastifyRequest, res: FastifyReply): Promise<FastifyReply> => {
        return res.sendFile('index.html')
    }
)

const start = async () => {
    try {
        await app.listen(process.env.SERVER_PORT)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()
