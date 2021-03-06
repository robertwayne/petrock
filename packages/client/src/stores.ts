import type { Item } from '../../shared/types'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

export const items: Writable<Array<Item>> = writable([])

export const expPerHour: Writable<number> = writable(0)
export const expPreviousExperience: Writable<number> = writable(0)
export const expThisSession: Writable<number> = writable(0)
export const expSessionDuration: Writable<number> = writable(0)
