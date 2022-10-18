<script lang="ts">
    import { Link } from "svelte-navigator"
    import ChangeLog from "./ChangeLog.svelte"
    import { displayChangeLog } from "../stores"
</script>

<nav class="font-[14pt] mb-2 flex h-full max-h-9 flex-row px-2 py-1">
    <h1 id="logo" class="max-content absolute top-[-3px] flex pl-2 text-[26pt]">
        <Link to="/">
            Pet<span id="logo-highlight">Rock</span></Link
        >
    </h1>

    <ul class="invisible flex grow flex-row justify-end text-xl md:visible">
        <li class="px-3">
            <button class="btn">
                <Link to="/">Leaderboard</Link>
            </button>
        </li>
        <li class="px-3">
            <button class="btn">
                <Link to="/tracker">XP Tracker</Link>
            </button>
        </li>
        <li class="px-3">
            <button class="btn" on:click={() => ($displayChangeLog = true)}
                >Change Log</button
            >
        </li>
    </ul>

    {#if $displayChangeLog}
        <ChangeLog />
    {/if}
</nav>

<style>
    @media (min-width: 720px) {
        nav {
            visibility: visible;
            background: linear-gradient(
                15deg,
                var(--theme-primary) 28%,
                var(--theme-primary-shadow) 0
            );
        }
    }

    @media (min-width: 1000px) {
        nav {
            background: linear-gradient(
                15deg,
                var(--theme-primary) 21%,
                var(--theme-primary-shadow) 0
            );
        }
    }

    @media (min-width: 1440px) {
        nav {
            background: linear-gradient(
                15deg,
                var(--theme-primary) 17%,
                var(--theme-primary-shadow) 0
            );
        }
    }

    @media (min-width: 2000px) {
        nav {
            background: linear-gradient(
                15deg,
                var(--theme-primary) 12%,
                var(--theme-primary-shadow) 0
            );
        }
    }

    @media (min-width: 3000px) {
        nav {
            background: linear-gradient(
                15deg,
                var(--theme-primary) 8%,
                var(--theme-primary-shadow) 0
            );
        }
    }

    nav {
        background-color: var(--theme-primary-shadow);
    }

    #logo-highlight {
        color: var(--theme-primary-accent);
    }

    /* Neccesary to prevent the "Pet" in "PetRock" from highlighting blue. */
    :global(#logo a:hover) {
        color: inherit;
    }
</style>
