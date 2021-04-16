<script lang="ts">
    import PageHeader from './PageHeader.svelte'
    import { onDestroy, onMount } from 'svelte'
    import { preloadData } from '../preload'
    import { tickRate, url } from '../constants'
    import { relativeTimeFromDates } from '../time'
    import { get, set } from 'idb-keyval'
    import type { Player } from '../../../shared/types'

    interface LeaderboardComponentStore {
        player: Player | undefined
        leaderboard: Array<Player>
        sortBy: string
        orderBy: boolean
        updateTimer: number
        fetchDataDelay: number
    }

    const stores: LeaderboardComponentStore = {
        player: undefined,
        leaderboard: [],
        sortBy: 'exp',
        orderBy: true,
        updateTimer: 0,
        fetchDataDelay: 0,
    }

    const getExperienceToNextRank = async (player: Player, currentRank: number) => {
        if (stores.leaderboard && player) {
            return stores.leaderboard[currentRank - 1].experience! - player.experience!
        } else {
            return 0
        }
    }

    const loadPlayerData = async (username: string) => {
        let data = await get('player')

        if (data?.player === username) {
            stores.player = data
        } else {
            clearLoadedPlayerData()

            stores.fetchDataDelay = setTimeout(async () => {
                let response: Response | undefined
                try {
                    response = await fetch(`${url}/api/v1/history?username=${username}&tooltip=true`)
                } catch (err) {
                    return
                }

                if (!response) return

                const data: Player = await response.json()

                set('player', data)
                stores.player = data
            }, 500)
        }
    }

    const clearLoadedPlayerData = async () => {
        stores.player = undefined
        clearTimeout(stores.fetchDataDelay)
    }

    /** Fetches current leaderboard data, maps it to players, and pushes it to a reactive array. */
    const getLeaderboardData = async () => {
        let response: Response | undefined

        try {
            response = await fetch(
                `${url}/api/v1/leaderboards?sort=${stores.sortBy}&order=${stores.orderBy ? 'desc' : 'asc'}`
            )
        } catch (err) {
            const subheader: HTMLElement = document.getElementById('disconnect-error') as HTMLElement
            subheader.classList.remove('hidden')
            clearInterval(stores.updateTimer)
            return
        }

        if (!response) return

        const data: Array<Player> = await response.json()

        let tmp_leaderboard: Array<Player> = []
        for (let i = 0; i < 100; i++) {
            let player: Player = {
                place: i + 1,
                username: data[i].username,
                online: data[i].online,
                experience: data[i].experience,
                daily_experience: data[i].daily_experience,
                weekly_experience: data[i].weekly_experience,
                monthly_experience: data[i].monthly_experience,
                last_modified: relativeTimeFromDates(new Date(data[i].last_modified!)),
            }
            tmp_leaderboard.push(player)
        }

        set('leaderboard', tmp_leaderboard)
        stores.leaderboard = tmp_leaderboard
    }

    onMount(
        async (): Promise<void> => {
            let data = await get('leaderboard')
            if (data) {
                stores.leaderboard = data
            } else {
                stores.leaderboard = preloadData
            }

            await getLeaderboardData()
            stores.updateTimer = setInterval(getLeaderboardData, tickRate)
        }
    )

    onDestroy(
        async (): Promise<void> => {
            clearInterval(stores.updateTimer)
            stores.updateTimer = 0
        }
    )

    /** Toggles caret icons between up and down, across table headers, based
     * on the current state.
     */
    function setCaretState(el: HTMLElement) {
        let cls = el.classList

        let elArray = document.getElementsByClassName('headers')
        for (let _el of elArray) {
            if (_el !== el) {
                _el.classList.remove('icofont-caret-up')
                _el.classList.add('icofont-caret-down')
            }
        }

        if (cls.contains('icofont-caret-down')) {
            cls.remove('icofont-caret-down')
            cls.add('icofont-caret-up')
        } else {
            cls.remove('icofont-caret-up')
            cls.add('icofont-caret-down')
        }
    }

    /** Requests a sorted copy of the leaderboard data from the API. */
    async function sort(column: string): Promise<void> {
        clearInterval(stores.updateTimer)

        const setCaret = (el: HTMLElement) => {
            setCaretState(el)
        }

        switch (column) {
            case 'exp': {
                let el = document.getElementById('default-header')
                if (el) setCaret(el)
                break
            }
            case 'day': {
                let el = document.getElementById('day-header')
                if (el) setCaret(el)
                break
            }
            case 'week': {
                let el = document.getElementById('week-header')
                if (el) setCaret(el)
                break
            }
            case 'month': {
                let el = document.getElementById('month-header')
                if (el) setCaret(el)
                break
            }
        }
        stores.sortBy = column
        stores.orderBy = !stores.orderBy
        await getLeaderboardData()
        stores.updateTimer = setInterval(getLeaderboardData, tickRate)
    }
</script>

<div id="wrapper">
    <PageHeader header="Leaderboards" subheader="This page updates in real-time." />
    <table id="leaderboard">
        <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th on:click={(e) => sort('exp')}
                    >Experience<i id="default-header" class="headers icofont-caret-down" /></th
                >
                <th on:click={(e) => sort('day')}>Today<i id="day-header" class="headers icofont-caret-down" /></th>
                <th on:click={(e) => sort('week')}
                    >This Week<i id="week-header" class="headers icofont-caret-down" /></th
                >
                <th on:click={(e) => sort('month')}
                    >This Month<i id="month-header" class="headers icofont-caret-down" /></th
                >
            </tr>
        </thead>
        <tbody>
            {#each stores.leaderboard as player, i}
                <tr>
                    <td>{player.place}</td>
                    <td class="username-cell {player.online ? 'is-online' : ''}">
                        <div class={player.online ? ' online-marker' : ''}>
                            <div class="online-tooltip">Online!</div>
                        </div>
                        <div
                            on:mouseleave={() => clearLoadedPlayerData()}
                            on:mouseenter={() => loadPlayerData(player.username)}
                            id="username"
                            class="username"
                        >
                            {player.username}
                            <div id="profile-tooltip" class="profile-tooltip">
                                <div class="profile-inner">
                                    <div class="strong">{player.username}</div>

                                    <hr />

                                    {#if stores.player !== undefined}
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
                                            Yesterday: {stores.player.yesterdays_experience?.toLocaleString()}
                                        </div>
                                        <div>
                                            Last Week: {stores.player.last_weeks_experience?.toLocaleString()}
                                        </div>
                                        <div>
                                            Last Month: {stores.player.last_months_experience?.toLocaleString()}
                                        </div>
                                    {:else}
                                        <div>Loading data...</div>
                                    {/if}

                                    <div id="last-seen">
                                        {#if player.online}
                                            Online now!
                                        {:else}
                                            Last seen {player.last_modified}
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>{player.experience?.toLocaleString()}</td>
                    <td>{player.daily_experience?.toLocaleString()}</td>
                    <td>{player.weekly_experience?.toLocaleString()}</td>
                    <td>{player.monthly_experience?.toLocaleString()}</td>
                </tr>
            {/each}
        </tbody>
    </table>
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
        padding-top: 4px;
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
        .username:hover .profile-tooltip {
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

    .username {
        display: inline-block;
        position: relative;
    }

    #wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    #leaderboard {
        width: 100%;
        text-align: center;
    }

    @media (min-width: 1600px) {
        #leaderboard {
            width: 80%;
        }
    }

    .headers {
        position: relative;
        padding: 6px 4px;
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

    @media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
        table,
        thead,
        tbody,
        th,
        td,
        tr {
            display: block;
        }

        thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
        }

        tr {
            border: 1px solid #000;
        }

        td {
            border: none;
            border-bottom: 1px solid;
            position: relative;
            padding-left: 50%;
        }

        td:before {
            position: absolute;
            top: 6px;
            left: 6px;
            padding-right: 10px;
            white-space: nowrap;
        }

        td:nth-of-type(1):before {
            content: 'Rank';
        }
        td:nth-of-type(2):before {
            content: 'Player';
        }
        td:nth-of-type(3):before {
            content: 'Total Experience';
        }
        td:nth-of-type(4):before {
            content: 'Daily Experience';
        }
        td:nth-of-type(5):before {
            content: 'Weekly Experience';
        }
        td:nth-of-type(6):before {
            content: 'Monthly Experience';
        }
    }

    th {
        background-color: var(--theme-primary-shadow);
    }

    tr:nth-child(odd) {
        background-color: var(--theme-primary-shadow);
    }
</style>
