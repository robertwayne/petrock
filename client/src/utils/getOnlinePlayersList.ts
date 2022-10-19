import { set } from "idb-keyval"

/** Fetches the current online player list. */
export const getOnlinePlayersList = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/online`)
    if (!response) return []

    const json: { entries: Array<string> } = await response.json()
    if (json && json.entries.length > 0) {
        set("online", json.entries)
        return json.entries
    }

    return []
}
