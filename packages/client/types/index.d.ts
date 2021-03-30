interface Player extends RawPlayerData {
    place?: number
}

type RawPlayerData = {
    username: string,
    total_experience: number
    daily_experience: number
    weekly_experience: number
    monthly_experience: number
}