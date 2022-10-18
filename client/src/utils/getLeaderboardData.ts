import { API_URL } from "./constants"
import { Leaderboard } from "../interfaces/Leaderboard"
import { Player } from "../interfaces/Player"
import { get } from "svelte/store"
import { leaderboard } from "../stores"
import { relativeTimeFromDates } from "./time"
import { set } from "idb-keyval"

/** Fetches current leaderboard data, maps it to players, and pushes it to
 * an array. */
export const getLeaderboardData = async (page: number = 1): Promise<number> => {
    console.log("CALLED")
    const leaderboardStore = get(leaderboard)

    let response
    try {
        response = await fetch(
            `${API_URL}/leaderboards?page=${page}&sort=${leaderboardStore.sortBy}&order=${
                leaderboardStore.orderBy ? "desc" : "asc"
            }`
        )
    } catch (error) {
        return page
    }

    let data
    try {
        data = await response.json()
    } catch (error) {
        return page
    }

    const players: Array<Player> = data
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
            lastModified: relativeTimeFromDates(new Date(player.lastModified || 0)),
        }
        temporaryLeaderboard.push(entry)
    }

    set("leaderboard", temporaryLeaderboard)
    leaderboardStore.data = temporaryLeaderboard

    return page++
}
