import { API_URL } from "./constants"
import { Player } from "../interfaces/Player"
import { get } from "svelte/store"
import { leaderboard } from "../stores"
import { relativeTimeFromDates } from "./time"
import { set } from "idb-keyval"

/** Fetches current leaderboard data, maps it to players, and pushes it to
 * an array. */
export const getLeaderboardData = async () => {
    const leaderboardStore = get(leaderboard)

    const response = await fetch(
        `${API_URL}/leaderboards?sort=${leaderboardStore.sortBy}&order=${
            leaderboardStore.orderBy ? "desc" : "asc"
        }`
    )

    if (!response) {
        clearInterval(leaderboardStore.updateTimer)
        return
    }

    const players: Array<Player> = await response.json()

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
            lastModified: relativeTimeFromDates(
                new Date(players[i].lastModified || 0)
            ),
        }
        temporaryLeaderboard.push(player)
    }

    set("leaderboard", temporaryLeaderboard)
    leaderboardStore.data = temporaryLeaderboard
}
