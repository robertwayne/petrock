import { API_URL } from "./constants"
import { Player } from "../interfaces/Player"
import { set } from "idb-keyval"

/** Fetches the current online player list. */
export const getOnlinePlayersList = async () => {
    const response = await fetch(`${API_URL}/online}`)

    if (response.ok) {
        const players: Array<string> = await response.json()
        set("online", players)
        return players
    } else {
        return []
    }
}
