import { Writable, writable } from 'svelte/store'
import type { Player, Item } from '../../shared/types'

export const items: Writable<Array<Item>> = writable([])

export const expPerHour: Writable<number> = writable(0)
export const expPreviousExperience: Writable<number> = writable(0)
export const expThisSession: Writable<number> = writable(0)
export const expSessionDuration: Writable<number> = writable(0)
