<script lang="ts">
    import { get, set } from "idb-keyval"
    import { afterUpdate } from "svelte"
    import { Player } from "../interfaces/Player"
    import { leaderboard } from "../stores"

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
                `${
                    import.meta.env.VITE_API_URL
                }/history?username=${username}&tooltip=true`
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
</script>

<tbody>
    {#each $leaderboard.data as player, i}
        <tr>
            <td>{player.rank}</td>
            <td class="username-cell {player.online ? 'is-online' : ''}">
                <div class={player.online ? " online-marker" : ""}>
                    <div class="online-tooltip">Online!</div>
                </div>
                <div
                    on:mouseleave={() => clearLoadedPlayerData()}
                    on:mouseenter={() => loadPlayerData(player.username)}
                    id="username"
                    class="relative inline-block"
                >
                    {player.username}
                    <div id="profile-tooltip" class="profile-tooltip">
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

<style>
    :global(.rank1) {
        color: #dbbb3a;
        font-weight: bold;
    }

    :global(.rank2) {
        color: #b8b8b8;
        font-weight: bold;
    }

    :global(.rank3) {
        color: #a67f4f;
        font-weight: bold;
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
</style>
