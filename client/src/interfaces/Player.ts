export interface Player {
    username: string
    rank: number
    online: boolean
    experience: number
    dailyExperience?: number
    yesterdaysExperience?: number
    weeklyExperience?: number
    lastWeeksExperience?: number
    monthlyExperience?: number
    lastMonthsExperience?: number
    createdOn?: string | Date
    lastModified?: string
    highestExperienceSingleDay?: number
}
