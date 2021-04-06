import { Writable, writable } from 'svelte/store'
import type { Player, Item } from '../../shared/types'

export const leaderboard: Writable<Array<Player>> = writable([])
export const sortBy: Writable<string> = writable('total')
export const orderBy: Writable<boolean> = writable(true)
export const updateTimer: Writable<number> = writable(0)
export const items: Writable<Array<Item>> = writable([])

export const expPerHour: Writable<number> = writable(0)
export const expPreviousExperience: Writable<number> = writable(0)
export const expThisSession: Writable<number> = writable(0)
export const expTrackerStartTime: Writable<number> = writable(0)
export const expSessionDuration: Writable<number> = writable(0)