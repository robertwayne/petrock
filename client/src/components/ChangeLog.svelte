<script lang="ts">
    import { onMount } from "svelte"
    import { ChangeLogEntry } from "../interfaces/ChangeLogEntry"
    import { displayChangeLog } from "../stores"

    let changeLog: Array<ChangeLogEntry> = []

    onMount(async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/changelog`
        )
        if (!response) return

        const json: { entries: Array<ChangeLogEntry> } = await response.json()
        if (json && json.entries.length > 0) {
            changeLog = json.entries
        }
    })
</script>

<div id="changelog" class="absolute right-4 top-12 rounded pb-2 md:w-[400px]">
    <div class="mb-1 flex h-full justify-between">
        <span class="pt-2 pl-2 text-lg font-bold underline">Change Log</span>
        <button
            class="btn pr-2 text-2xl"
            on:click={() => ($displayChangeLog = false)}>✕</button
        >
    </div>

    {#if changeLog.length > 0}
        {#each changeLog as entry}
            <div class="entry pl-2">
                <div class="italic">
                    {new Date(entry.date).toLocaleDateString()}
                </div>
                <div class="pl-8">
                    <ul class="list-disc">
                        {#each entry.changes as change}
                            <li>{change}</li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/each}
    {:else}
        <div class="p-2 italic">No changes to display.</div>
    {/if}
</div>

<style>
    #changelog {
        background-color: var(--theme-primary-shadow);
        border: 1px solid var(--theme-primary-lighter);
    }
</style>
