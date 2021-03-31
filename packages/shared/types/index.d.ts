export interface Query {
    sort?: string
    asc?: string
}

interface Player {
    username: string
    place?: number
    total_experience?: number
    daily_experience?: number
    weekly_experience?: number
    monthly_experience?: number
}
