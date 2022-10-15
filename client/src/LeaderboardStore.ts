import { Player } from "./Player"

export interface LeaderboardStore {
    player: Player | undefined
    leaderboard: Array<Player>
    sortBy: string
    orderBy: boolean
    updateTimer?: number
    fetchDataDelay?: number
}
