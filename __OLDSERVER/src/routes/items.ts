import { FastifyInstance, FastifyRequest } from "fastify"

type ItemsRequest = FastifyRequest<{
    Querystring: {
        order: string
        asc: string
        search: string
        slot: string
        type: string
        classes: string
        level: number
    }
}>

/** Returns items based on query params from the items table. */
export const routeItems = async (app: FastifyInstance): Promise<void> => {
    app.get("/items", {}, async (request: ItemsRequest) => {
        const client = await app.pg.connect()

        const { rows } = await client.query(
            `
            SELECT 
                i.name, i.name, i.description, i.level, i.slot, i.type, i.consumable, i.usable_by,
                i.strength, i.intelligence, i.agility, i.defense, i.wisdom, i.luck, i.can_sell, i.sell_price,
                i.icon
            FROM items i;
            `
        )

        client.release()

        return rows
    })
}
