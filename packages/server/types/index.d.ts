import { FastifyRequest } from 'fastify'

export type Player = {
    username: string
    experience: number
}

export type RawPlayerData = {
    username: string
    experience: number
}

export interface Query {
    sort?: string
    asc?: string
}
