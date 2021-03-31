<script lang="ts">
    import { onMount } from 'svelte'
    import { leaderboard, sortBy, sortAsc, updateTimer } from '../stores'
    import { preloadData } from '../preload'
    import type { RawPlayerData, Player } from '../../../shared/types'

    // we do this to avoid large CLS (Cumulative Layout Shift) issues on initial page load
    $leaderboard = preloadData
    $sortBy = 'total_experience'

    async function getLeaderboardData() {
        const response: Response = await fetch(`http://localhost:3000/api/v1/update?sort=${$sortBy}&asc=${$sortAsc}`)
        const data: Array<RawPlayerData> = await response.json()

        let _leaderboard: Array<Player> = []
        for (let i = 0; i < 100; i++) {
            let _player: Player = {
                place: i + 1,
                username: data[i].username,
                total_experience: data[i].total_experience,
                daily_experience: data[i].daily_experience,
                weekly_experience: data[i].weekly_experience,
                monthly_experience: data[i].monthly_experience,
            }
            _leaderboard.push(_player)
        }
        $leaderboard = _leaderboard
    }

    onMount(
        async (): Promise<void> => {
            await getLeaderboardData()
            $updateTimer = setInterval(getLeaderboardData, 1000)
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
        $sortAsc = !$sortAsc
        await getLeaderboardData()
        $updateTimer = setInterval(getLeaderboardData, 1000)
    }
</script>

<div id="wrapper">
    <h1>Leaderboards</h1>
    <span id="subheader">This page updates in real time.</span>
    <table id="leaderboard">
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
        {#each $leaderboard as player}
            <tr id="place-{String(player.place)}">
                <td>{player.place}</td>
                <td>{player.username}</td>
                <td>{player.total_experience.toLocaleString()}</td>
                <td>{player.daily_experience.toLocaleString()}</td>
                <td>{player.weekly_experience.toLocaleString()}</td>
                <td>{player.monthly_experience.toLocaleString()}</td>
            </tr>
        {/each}
    </table>
</div>

<style>
    #subheader {
        font-style: italic;
        color: var(--theme-primary-text);
        opacity: 0.6;
        padding: 0 0 4% 0;
        margin-top: -4px;
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
    }

    th {
        background-color: var(--theme-primary-shadow);
    }

    tr:nth-child(odd) {
        background-color: var(--theme-primary-shadow);
    }
</style>
