import { Leaderboard } from "./interfaces/Leaderboard"
import type { Writable } from "svelte/store"
import { writable } from "svelte/store"

// Leaderboards
export const leaderboard = writable<Leaderboard>({
    targetPlayer: undefined,
    data: [],
    sortBy: "exp",
    orderBy: true,
    updateTimer: 0,
    fetchDataDelay: 0,
})

// Experience Tracker
export const expPerHour: Writable<number> = writable(0)
export const expPreviousExperience: Writable<number> = writable(0)
export const expThisSession: Writable<number> = writable(0)
export const expSessionDuration: Writable<number> = writable(0)
