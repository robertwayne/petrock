export interface Player {
    username: string
    place?: number
    online?: boolean
    experience?: number
    daily_experience?: number
    weekly_experience?: number
    monthly_experience?: number
    created_on?: string | Date
    last_modified?: string
}

export interface RawPlayerData {
    username: string
    experience: number
}

export interface Item {
    name: string
    description?: string
    level?: number
    slot?: string
    type: string
    consumable?: boolean
    usable_by?: string
    strength?: number
    intelligence?: number
    agility?: number
    defense?: number
    wisdom?: number
    luck?: number
    can_sell: boolean
    sell_price?: number
    icon: string
}
