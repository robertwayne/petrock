<script lang="ts">
    import { getLeaderboardData } from "../utils/getLeaderboardData"
    import { leaderboard } from "../stores"

    type SortType = "exp" | "day" | "week" | "month"

    /** Requests a sorted copy of the leaderboard data from the API. */
    async function sort(column: SortType) {
        switch (column) {
            case "exp": {
                const element = document.getElementById("default-header")
                if (element) setCaretState(element)
                break
            }
            case "day": {
                const element = document.getElementById("day-header")
                if (element) setCaretState(element)
                break
            }
            case "week": {
                const element = document.getElementById("week-header")
                if (element) setCaretState(element)
                break
            }
            case "month": {
                const element = document.getElementById("month-header")
                if (element) setCaretState(element)
                break
            }
        }

        $leaderboard.sortBy = column
        $leaderboard.orderBy = !$leaderboard.orderBy

        // Fetch the new data.
        await getLeaderboardData()
    }

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
</script>

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

<style>
    th {
        background-color: var(--theme-primary-shadow);
    }

    tr:nth-child(odd) {
        background-color: var(--theme-primary-shadow);
    }
</style>
