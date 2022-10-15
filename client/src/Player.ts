export interface Player {
    username: string
    place?: number
    online?: boolean
    experience?: number
    daily_experience?: number
    yesterdays_experience?: number
    weekly_experience?: number
    last_weeks_experience?: number
    monthly_experience?: number
    last_months_experience?: number
    created_on?: string | Date
    last_modified?: string
    highest_experience_single_day?: number
}
