<script lang="ts">
    import { onDestroy, onMount } from "svelte"
    import { preloadData } from "../preload"
    import { relativeTimeFromDates } from "../time"
    import { get, set } from "idb-keyval"
    import { fade } from "svelte/transition"
    import type { Player } from "../interfaces/Player"
    import { leaderboard } from "../stores"

    // Milliseconds per refresh
    const tickRate = import.meta.env.TICK_RATE
    // API base URL
    const url = import.meta.env.API_URL

    /** Calculates the experience needed for a given player to reach the next
     * rank. Used when displaying the on-hover tooltip. */
    const getExperienceToNextRank = async (
        player: Player,
        rank: number
    ): Promise<number> => {
        if (!$leaderboard.data || !player) return 0

        const experience = $leaderboard.data[rank - 1].experience || 0
        return experience - (player.experience || 0)
    }

    /** Fetches a specific players data (by username). Used when displaying the
     * on-hover tooltip. */
    const loadPlayerData = async (username: string) => {
        const data = await get("player")

        // If player data is already in our cache, load that instead of
        // fetching it again.
        if (data?.player === username) {
            $leaderboard.targetPlayer = data
            return
        }

        // Clear the target player data.
        clearLoadedPlayerData()

        $leaderboard.fetchDataDelay = setTimeout(async () => {
            const response = await fetch(
                `${url}/history?username=${username}&tooltip=true`
            )
            if (!response) return

            const player: Player = await response.json()
            set("player", player)
            $leaderboard.targetPlayer = player
        }, 10000)
    }

    const clearLoadedPlayerData = () => {
        $leaderboard.targetPlayer = undefined
        clearTimeout($leaderboard.fetchDataDelay)
    }

    /** Fetches current leaderboard data, maps it to players, and pushes it to
     * an array. */
    const getLeaderboardData = async () => {
        const response = await fetch(
            `${url}/leaderboards?sort=${$leaderboard.sortBy}&order=${
                $leaderboard.orderBy ? "desc" : "asc"
            }`
        )

        if (!response) {
            clearInterval($leaderboard.updateTimer)
            return
        }

        const players: Array<Player> = await response.json()

        const temporaryLeaderboard: Array<Player> = []
        for (let i = 0; i < 100; i++) {
            const player: Player = {
                place: i + 1,
                username: players[i].username,
                online: players[i].online,
                experience: players[i].experience,
                dailyExperience: players[i].dailyExperience,
                weeklyExperience: players[i].weeklyExperience,
                monthlyExperience: players[i].monthlyExperience,
                lastModified: relativeTimeFromDates(
                    new Date(players[i].lastModified || 0)
                ),
            }
            temporaryLeaderboard.push(player)
        }

        set("leaderboard", temporaryLeaderboard)
        $leaderboard.data = temporaryLeaderboard
    }

    onMount(async () => {
        const data = await get("leaderboard")
        data ? ($leaderboard.data = data) : ($leaderboard.data = preloadData)

        await getLeaderboardData()
        $leaderboard.updateTimer = setInterval(getLeaderboardData, tickRate)
    })

    onDestroy(async () => {
        clearInterval($leaderboard.updateTimer)
        $leaderboard.updateTimer = undefined
    })

    /** Toggles caret icons between up and down, across table headers, based on
     * the current state.
     */
    function setCaretState(element: HTMLElement) {
        for (let el of Array.from(document.getElementsByClassName("headers"))) {
            if (el !== element) {
                el.classList.remove("icofont-caret-up")
                el.classList.add("icofont-caret-down")
            }
        }

        if (element.classList.contains("icofont-caret-down")) {
            element.classList.remove("icofont-caret-down")
            element.classList.add("icofont-caret-up")
        } else {
            element.classList.remove("icofont-caret-up")
            element.classList.add("icofont-caret-down")
        }
    }

    /** Requests a sorted copy of the leaderboard data from the API. */
    async function sort(column: string) {
        clearInterval($leaderboard.updateTimer)

        const setCaret = (el: HTMLElement) => {
            setCaretState(el)
        }

        switch (column) {
            case "exp": {
                const element = document.getElementById("default-header")
                if (element) setCaret(element)
                break
            }
            case "day": {
                const element = document.getElementById("day-header")
                if (element) setCaret(element)
                break
            }
            case "week": {
                const element = document.getElementById("week-header")
                if (element) setCaret(element)
                break
            }
            case "month": {
                const element = document.getElementById("month-header")
                if (element) setCaret(element)
                break
            }
        }
        $leaderboard.sortBy = column
        $leaderboard.orderBy = !$leaderboard.orderBy
        await getLeaderboardData()
        $leaderboard.updateTimer = setInterval(getLeaderboardData, tickRate)
    }
</script>

<div class="flex w-full flex-col items-center justify-center">
    <div
        class="h-max-content flex w-full flex-col items-center justify-center pt-4"
    >
        <h2 class="text-bold text-5xl">Leaderboards</h2>
        <span id="subheader" class="pb-8 italic"
            >This page updates in real time.</span
        >
    </div>

    <div
        class="flex w-full flex-col justify-center text-center md:w-[80%]"
        in:fade={{ duration: 500 }}
    >
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th on:click={(e) => sort("exp")}
                        >Experience<i
                            id="default-header"
                            class="icofont-caret-down relative py-6 px-4"
                        /></th
                    >
                    <th on:click={(e) => sort("day")}
                        >Today<i
                            id="day-header"
                            class="icofont-caret-down relative py-6 px-4"
                        /></th
                    >
                    <th on:click={(e) => sort("week")}
                        >This Week<i
                            id="week-header"
                            class="icofont-caret-down relative py-6 px-4"
                        /></th
                    >
                    <th on:click={(e) => sort("month")}
                        >This Month<i
                            id="month-header"
                            class="icofont-caret-down relative py-6 px-4"
                        /></th
                    >
                </tr>
            </thead>
            <tbody>
                {#each $leaderboard.data as player, i}
                    <tr>
                        <td>{player.place}</td>
                        <td
                            class="username-cell {player.online
                                ? 'is-online'
                                : ''}"
                        >
                            <div class={player.online ? " online-marker" : ""}>
                                <div class="online-tooltip">Online!</div>
                            </div>
                            <div
                                on:mouseleave={() => clearLoadedPlayerData()}
                                on:mouseenter={() =>
                                    loadPlayerData(player.username)}
                                id="username"
                                class="relative inline-block"
                            >
                                {player.username}
                                <div
                                    id="profile-tooltip"
                                    class="profile-tooltip"
                                >
                                    <div class="profile-inner">
                                        <div class="strong">
                                            {player.username}
                                        </div>

                                        <hr />

                                        {#if $leaderboard.targetPlayer !== undefined}
                                            <div>
                                                {#if i > 0}
                                                    {#await getExperienceToNextRank(player, i)}
                                                        Calculating...
                                                    {:then exp}
                                                        Next Rank: {exp.toLocaleString()}
                                                    {/await}
                                                {/if}
                                            </div>
                                            <div>
                                                Yesterday: {$leaderboard.targetPlayer.yesterdaysExperience?.toLocaleString()}
                                            </div>
                                            <div>
                                                Last Week: {$leaderboard.targetPlayer.lastWeeksExperience?.toLocaleString()}
                                            </div>
                                            <div>
                                                Last Month: {$leaderboard.targetPlayer.lastMonthsExperience?.toLocaleString()}
                                            </div>
                                        {:else}
                                            <div>Loading data...</div>
                                        {/if}

                                        <div id="last-seen" class="pt-4">
                                            {#if player.online}
                                                Online now!
                                            {:else}
                                                Last seen {player.lastModified}
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>{player.experience?.toLocaleString()}</td>
                        <td>{player.dailyExperience?.toLocaleString()}</td>
                        <td>{player.weeklyExperience?.toLocaleString()}</td>
                        <td>{player.monthlyExperience?.toLocaleString()}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .online-marker {
        height: 7px;
        width: 7px;
        background-color: var(--theme-primary-green);
        border-radius: 50%;
        display: inline-block;
        margin: 0 2px 2px 0;
        position: relative;
    }

    .online-tooltip {
        display: none;
        width: max-content;
        background-color: var(--theme-primary-accent);
        color: var(--theme-primary-shadow);
        font-weight: bold;
        font-size: 12pt;
        text-align: center;
        padding: 0 6px;
        border-radius: 6px;
        position: absolute;
        z-index: 2;
        top: -20px;
        right: 0px;
    }

    .is-online {
        padding-right: 14px;
    }

    .profile-tooltip {
        display: none;
        width: 250px;
        height: max-content;
        background-color: rgba(var(--theme-primary-shadow-rgb), 0.9);
        color: var(--theme-primary-text);
        font-weight: bold;
        font-size: 12pt;
        text-align: center;
        padding: 0 6px;
        border: 1px solid var(--theme-primary-text);
        border-radius: 6px;
        position: absolute;
        z-index: 2;
        top: 100%;
        left: 0;
    }

    .profile-inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2px;
    }

    .profile-inner hr {
        display: flex;
        align-self: center;
        border: none;
        width: 90%;
        border-bottom: 1px solid var(--theme-primary-text);
        opacity: 0.5;
        margin-bottom: 4px;
    }

    #last-seen {
        color: var(--theme-primary-lighter);
        font-size: 10pt;
    }

    @keyframes fade_in_display {
        0% {
            opacity: 0;
            transform: scale(0);
        }

        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (min-width: 720px) {
        #username:hover .profile-tooltip {
            display: revert;
            animation-name: fade_in_display;
            animation-duration: 250ms;
            animation-fill-mode: forwards;
        }

        .online-marker:hover .online-tooltip {
            display: revert;
            animation: fade_in_display 250ms;
        }
    }

    tbody > tr:nth-child(1) {
        font-weight: bold;
        color: #d8b041;
    }

    tbody > tr:nth-child(2) {
        font-weight: bold;
        color: #727271;
    }

    tbody > tr:nth-child(3) {
        font-weight: bold;
        color: #8b633c;
    }

    table {
        font-size: 14pt;
        border-spacing: 0;
        border-collapse: collapse;
    }

    th {
        background-color: var(--theme-primary-shadow);
    }

    tr:nth-child(odd) {
        background-color: var(--theme-primary-shadow);
    }
</style>
