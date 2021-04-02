import { Writable, writable } from 'svelte/store'
import type { Player } from '../../shared/types'

export const leaderboard: Writable<Array<Player>> = writable([])
export const sortBy: Writable<string> = writable('total')
export const orderBy: Writable<boolean> = writable(true)
export const updateTimer: Writable<number> = writable(0)
