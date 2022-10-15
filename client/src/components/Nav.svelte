<script lang="ts">
    import { Link } from "svelte-navigator"
</script>

<nav class="font-[14pt] flex h-full max-h-9 flex-row px-2 py-1">
    <h1
        id="logo"
        class="max-content absolute top-[-3px] flex pl-2 text-[22pt] font-bold"
    >
        <Link to="/">
            Pet<span id="logo-highlight">Rock</span></Link
        >
    </h1>

    <ul class="flex grow flex-row justify-end text-xl">
        <li class="px-4 hover:text-blue-500 hover:duration-300">
            <Link to="/">Leaderboard</Link>
        </li>
        <li class="px-4 hover:text-blue-500 hover:duration-300">
            <Link to="/tracker">XP Tracker</Link>
        </li>
    </ul>
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
                var(--theme-primary) 22%,
                var(--theme-primary-shadow) 0
            );
        }
    }

    @media (min-width: 1440px) {
        nav {
            background: linear-gradient(
                15deg,
                var(--theme-primary) 15%,
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
