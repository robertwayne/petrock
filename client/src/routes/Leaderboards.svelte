<script lang="ts">
    import { onDestroy, onMount } from "svelte"
    import { preloadData } from "../utils/preload"
    import { get } from "idb-keyval"
    import { fade } from "svelte/transition"
    import { leaderboard } from "../stores"
    import LeaderboardHeader from "../components/LeaderboardHeader.svelte"
    import LeaderboardBody from "../components/LeaderboardBody.svelte"
    import { getLeaderboardData } from "../utils/getLeaderboardData"
    import { TICK_RATE } from "../utils/constants"

    onMount(async () => {
        const data = await get("leaderboard")
        data ? ($leaderboard.data = data) : ($leaderboard.data = preloadData)

        await getLeaderboardData()
        $leaderboard.updateTimer = setInterval(getLeaderboardData, TICK_RATE)
    })

    onDestroy(async () => {
        clearInterval($leaderboard.updateTimer)
        $leaderboard.updateTimer = undefined
    })
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
            <LeaderboardHeader />
            <LeaderboardBody />
        </table>
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
</style>
