<script lang="ts">
    import { onMount } from 'svelte'
    import { leaderboard, sortBy, orderBy, updateTimer } from '../stores'
    import { preloadData } from '../preload'
    import type { Player } from '../../../shared/types'
    import { tickRate, url } from '../constants'

    // we do this to avoid large CLS (Cumulative Layout Shift) issues on initial page load
    $leaderboard = preloadData

    async function getLeaderboardData() {
        const response: Response = await fetch(`${url}/api/v1/leaderboards?sort=${$sortBy}&order=${$orderBy ? 'desc' : 'asc'}`)
        const data: Array<Player> = await response.json()

        let _leaderboard: Array<Player> = []
        for (let i = 0; i < 100; i++) {
            let _player: Player = {
                place: i + 1,
                username: data[i].username,
                online: data[i].online,
                total_experience: data[i].total_experience,
                daily_experience: data[i].daily_experience,
                weekly_experience: data[i].weekly_experience,
                monthly_experience: data[i].monthly_experience,
            }
            _leaderboard.push(_player)
        }
        $leaderboard = _leaderboard
    }

    console.log($leaderboard)

    onMount(
        async (): Promise<void> => {
            await getLeaderboardData()
            $updateTimer = setInterval(getLeaderboardData, tickRate)
        }
    )

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

    async function sort(column: string): Promise<void> {
        clearInterval($updateTimer)

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
        $sortBy = column
        $orderBy = !$orderBy
        await getLeaderboardData()
        $updateTimer = setInterval(getLeaderboardData, tickRate)
    }
</script>

<div id="wrapper">
    <h1>Leaderboards</h1>
    <span id="subheader">This page updates in real time.</span>
    <span id="subheader-2">Beta: Daily/Weekly/Monthly values may not be 100% accurate<br>as I am currently modifying database queries often.</span>
    <table id="leaderboard">
        <thead>
            <tr>
            
                <th>Rank</th>
                <th>Player</th>
                <th on:click={(e) => sort('exp')}>Experience<i id="default-header" class="headers icofont-caret-down" /></th
                >
                <th on:click={(e) => sort('day')}>Today<i id="day-header" class="headers icofont-caret-down" /></th>
                <th on:click={(e) => sort('week')}>This Week<i id="week-header" class="headers icofont-caret-down" /></th>
                <th on:click={(e) => sort('month')}>This Month<i id="month-header" class="headers icofont-caret-down" /></th
                >
            </tr>
        </thead>
        <tbody>
            {#each $leaderboard as player}
            <tr id="place-{String(player.place)}">
                <td>{player.place}</td>
                <td id={player.online ? 'username' : ''}>
                    <span class='{player.online ? ' online-marker' : ''}' />{player.username}</td>
                <td>{player.total_experience?.toLocaleString()}</td>
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
        background-color: rgb(80, 177, 80);
        border-radius: 50%;
        display: inline-block;
        margin: 0 8px 2px 0;
    }

    #username {
        padding-right: 14px;
    }

    #subheader {
        font-style: italic;
        color: var(--theme-primary-text);
        opacity: 0.6;
        margin-top: -4px;
    }

    #subheader-2 {
        font-style: italic;
        color: var(--theme-primary-text);
        opacity: 0.6;
        padding: 0 0 4% 0;
        margin-top: -4px;
        text-align: center;
    }

    #wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    h1 {
        display: flex;
        justify-content: center;
        font-size: 36pt;
        padding: 1% 0 0 0;
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

    #top-scores {
        display: flex;
        justify-content: center;
        padding: 3% 0;
    }

    #place-1 {
        font-weight: bold;
        color: #d8b041;
    }

    #place-2 {
        font-weight: bold;
        color: #727271;
    }

    #place-3 {
        font-weight: bold;
        color: #8b633c;
    }

    table {
        font-size: 14pt;
        border-spacing: 0;
        border-collapse: collapse;
    }

    @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
        table, thead, tbody, th, td, tr {
            display :block
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
            border-bottom: 1px solid ;
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

        td:nth-of-type(1):before { content: "Rank" }
        td:nth-of-type(2):before { content: "Player" }
        td:nth-of-type(3):before { content: "Total Experience" }
        td:nth-of-type(4):before { content: "Daily Experience" }
        td:nth-of-type(5):before { content: "Weekly Experience" }
        td:nth-of-type(6):before { content: "Monthly Experience" }
    }

    th {
        background-color: var(--theme-primary-shadow);
    }

    tr:nth-child(odd) {
        background-color: var(--theme-primary-shadow);
    }
</style>
