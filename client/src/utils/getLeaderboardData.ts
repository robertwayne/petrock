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

    for (let i = 0; i < 100; i++) {
        const player: Player = {
            place: i + 1,
            username: players[i].username,
            online: players[i].online,
            experience: players[i].experience,
            dailyExperience: players[i].dailyExperience,
            weeklyExperience: players[i].weeklyExperience,
            monthlyExperience: players[i].monthlyExperience,
            lastModified: relativeTimeFromDates(new Date(players[i].lastModified || 0)),
        }
        temporaryLeaderboard.push(player)
    }

    set("leaderboard", temporaryLeaderboard)
    leaderboardStore.data = temporaryLeaderboard

    return page++
}
