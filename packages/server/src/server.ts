const fastify = require('fastify')({ logger: true })
const path = require('path')
const db = require('./db')
const nodeFetch = require('node-fetch')

let current_standings = []

fastify.register(require('fastify-static'), {
    root: path.resolve('../client/build'),
})

if (process.env.NODE_ENV === 'development') {
    fastify.register(require('fastify-helmet'), {
        contentSecurityPolicy: {
            directives: {
                'default-src': '*',
            },
        },
    })
} else {
    fastify.register(require('fastify-helmet'), {
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

fastify.register(require('fastify-cors'), {
    origin: 'https://petrock.gg',
})

fastify.register(require('fastify-postgres'), {
    connectionString: db.DB_CONNECTION_STRING,
})

fastify.get('/', async (req, res) => {
    return res.sendFile('index.html')
})

fastify.get('/api/v1/update', async (req, res) => {
    const client = await fastify.pg.connect()

    let sortBy: string
    switch (req.query.sort) {
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
    switch (req.query.asc) {
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
        await fastify.listen(3000)
        fastify.log.info(`Server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
