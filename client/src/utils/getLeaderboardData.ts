import { Leaderboard } from "../interfaces/Leaderboard"
import { Player } from "../interfaces/Player"
import { get } from "svelte/store"
import { leaderboard } from "../stores"
import { relativeTimeFromDates } from "./time"
import { set } from "idb-keyval"

/** Fetches current leaderboard data, maps it to players, and pushes it to
 * an array. */
export const getLeaderboardData = async (page = 0): Promise<number> => {
    const leaderboardStore = get(leaderboard)

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/leaderboards?page=${page}`
    )
    if (!response) return 0

    const json = await response.json()
    if (json && json.entries.length > 0) {
        const players: Array<Player> = json.entries
        const temporaryLeaderboard: Array<Player> = []

        for (const [_, player] of players.entries()) {
            const entry: Player = {
                rank: player.rank,
                username: player.username,
                online: player.online,
                experience: player.experience,
                dailyExperience: player.dailyExperience || 0,
                weeklyExperience: player.weeklyExperience || 0,
                monthlyExperience: player.monthlyExperience || 0,
                lastModified: relativeTimeFromDates(
                    new Date(player.lastModified || 0)
                ),
            }
            temporaryLeaderboard.push(entry)
        }

        set("leaderboard", temporaryLeaderboard)
        leaderboardStore.data = temporaryLeaderboard
        leaderboard.update((leaderboard) => {
            return leaderboard
        })

        return page
    }

    return page
}
