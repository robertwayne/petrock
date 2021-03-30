import { Writable, writable } from 'svelte/store'

export const leaderboard:  Writable<Array<Player>> = writable([])
export const sortBy: Writable<string> = writable('')
export const sortAsc: Writable<boolean> = writable(false)
export const updateTimer: Writable<any> = writable([])