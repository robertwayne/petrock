<script lang="ts">
    import { afterUpdate, onDestroy, onMount } from "svelte"
    import { preloadData } from "../utils/preload"
    import { get } from "idb-keyval"
    import { fade } from "svelte/transition"
    import { leaderboard } from "../stores"
    import LeaderboardHeader from "../components/LeaderboardHeader.svelte"
    import LeaderboardBody from "../components/LeaderboardBody.svelte"
    import { getLeaderboardData } from "../utils/getLeaderboardData"
    import { getOnlinePlayersList } from "../utils/getOnlinePlayersList"

    let playersOnline: Array<string> = []
    let showPlayersOnline = false
    let page = 0

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        })
    }

    const getNextPage = async () => {
        const nextPage = page + 1
        page = await getLeaderboardData(nextPage)
        scrollToTop()
    }

    const getPreviousPage = async () => {
        if (page === 0) return
        const previousPage = page - 1
        page = await getLeaderboardData(previousPage)
        scrollToTop()
    }

    onMount(async () => {
        const data = await get("leaderboard")
        data ? ($leaderboard.data = data) : ($leaderboard.data = preloadData)

        await getLeaderboardData()

        $leaderboard.updateTimer = setInterval(
            () => getLeaderboardData(page),
            import.meta.env.VITE_TICK_RATE
        )

        playersOnline = await getOnlinePlayersList()
    })

    onDestroy(async () => {
        clearInterval($leaderboard.updateTimer)
        $leaderboard.updateTimer = undefined
    })

    const colorizeTopRanks = () => {
        for (let i = 0; i <= 3; i++) {
            const element = document.querySelector(`tbody > tr:nth-child(${i})`)
            if (page === 0) {
                element?.classList.add(`rank${i}`)
            } else {
                element?.classList.remove(`rank${i}`)
            }
        }
    }

    afterUpdate(() => {
        colorizeTopRanks()
    })
</script>

<div class="flex w-full flex-col items-center justify-center">
    <div
        class="h-max-content flex w-full flex-col items-center justify-center py-4"
    >
        <h2 class="text-5xl font-bold">Leaderboards</h2>
        <span id="subheader" class="italic"
            >This page updates in real time.</span
        >

        {#if playersOnline.length === 0}
            <span class="p-2 font-bold">No players are currently online.</span>
        {:else}
            <span
                class="relative cursor-default p-2 font-bold"
                on:mouseenter={() => (showPlayersOnline = true)}
                on:mouseleave={() => (showPlayersOnline = false)}
                >{playersOnline.length} players are currently online.
                {#if showPlayersOnline}
                    <div id="playersOnlineList" class="absolute p-2">
                        {playersOnline.join(", ")}
                    </div>
                {/if}
            </span>
        {/if}
    </div>

    <div
        class="flex w-full flex-col justify-center pb-10 text-center md:w-[80%]"
        in:fade={{ duration: 500 }}
    >
        <table>
            <LeaderboardHeader />
            <LeaderboardBody />
        </table>

        <div id="pagination" class="pt-4 font-bold">
            <button class="btn px-2" on:click={getPreviousPage}>
                Previous
            </button>
            <span class="px-2">{page + 1}</span>
            <button class="btn px-2" on:click={getNextPage}> Next </button>
        </div>
    </div>
</div>

<style>
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

    table {
        font-size: 14pt;
        border-spacing: 0;
        border-collapse: collapse;
    }

    #playersOnlineList {
        padding: 4px 6px;
        background-color: var(--theme-primary-shadow);
        border: 1px solid var(--theme-primary-text);
        border-radius: 6px;
        min-width: 200px;
        max-width: 300px;
    }
</style>
