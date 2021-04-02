export interface Player {
    username: string
    place?: number
    total_experience?: number
    daily_experience?: number
    weekly_experience?: number
    monthly_experience?: number
}

export interface RawPlayerData {
    username: string
    experience: number
}
