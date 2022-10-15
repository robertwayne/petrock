import { Player } from "../../shared/types"

export interface ILeaderboardStore {
    player: Player | undefined
    leaderboard: Array<Player>
    sortBy: string
    orderBy: boolean
    updateTimer?: NodeJS.Timer
    fetchDataDelay?: NodeJS.Timer
}
