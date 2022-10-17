import { Player } from "../interfaces/Player"

// This is used to avoid CLS (Cumulative Laushout Shift) during initial page render. This is dummy data pulled from the database, but will align the leaderboard tables.
export const preloadData: Array<Player> = []

for (let i = 0; i < 100; i++) {
    const player: Player = {
        place: i + 1,
        username: "",
        experience: 0,
        dailyExperience: 0,
        weeklyExperience: 0,
        monthlyExperience: 0,
        lastModified: "",
    }
    preloadData.push(player)
}
