import { Leaderboard } from "../interfaces/Leaderboard"
import { Player } from "../interfaces/Player"
import { get } from "svelte/store"
import { leaderboard } from "../stores"
import { relativeTimeFromDates } from "./time"
import { set } from "idb-keyval"

/** Fetches current leaderboard data, maps it to players, and pushes it to
 * an array. */
export const getLeaderboardData = async (page = 1): Promise<number> => {
    const leaderboardStore = get(leaderboard)

    // const response = await fetch(
    //     `${import.meta.env.VITE_API_URL}/leaderboards?page=${page}&sort=${
    //         leaderboardStore.sortBy
    //     }&order=${leaderboardStore.orderBy ? "desc" : "asc"}`
    // )
    const response = await fetch(`${import.meta.env.VITE_API_URL}/leaderboards`)
    if (!response) return page

    const json = await response.json()
    if (json && json.length > 0) {
        const players: Array<Player> = json.entries
        const temporaryLeaderboard: Array<Player> = []

        for (const [i, player] of players.entries()) {
            const entry: Player = {
                place: i + 1,
                username: player.username,
                online: player.online,
                experience: player.experience,
                dailyExperience: player.dailyExperience,
                weeklyExperience: player.weeklyExperience,
                monthlyExperience: player.monthlyExperience,
                lastModified: relativeTimeFromDates(
                    new Date(player.lastModified || 0)
                ),
            }
            temporaryLeaderboard.push(entry)
        }

        set("leaderboard", temporaryLeaderboard)
        leaderboardStore.data = temporaryLeaderboard

        return page++
    }

    return page
}
