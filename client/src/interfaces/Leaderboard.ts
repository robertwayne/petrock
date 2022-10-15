import { Player } from "./Player"

export interface Leaderboard {
    targetPlayer: Player | undefined
    data: Array<Player>
    sortBy: string
    orderBy: boolean
    updateTimer?: number
    fetchDataDelay?: number
}
