import type { Player } from '../../shared/types'

// This is used to avoid CLS (Cumulative Laushout Shift) during initial page render. This is dummy data pulled from the database, but will align the leaderboard tables.
export const preloadData: Array<Player> = []

for (let i = 0; i < 100; i++) {
    let player: Player = {
        place: i + 1,
        username: '',
        experience: 0,
        daily_experience: 0,
        weekly_experience: 0,
        monthly_experience: 0,
        last_modified: '',
    }
    preloadData.push(player)
}
