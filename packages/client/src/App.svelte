<script lang="ts">
    import { Router } from "svelte-navigator"
    import LazyRoute from "./components/LazyRoute.svelte"
    import Footer from "./components/Footer.svelte"
    import Nav from "./components/Nav.svelte"

    const routes = {
        "/": () => import("./routes/Leaderboard.svelte"),
        "/tracker": () => import("./routes/Tracker.svelte"),
    }
</script>

<div id="app" class="flex h-full w-full flex-col">
    <Router primary={false}>
        <Nav />
    </Router>

    <main class="flex w-full flex-grow justify-center">
        <Router>
            {#each Object.entries(routes) as [path, component]}
                <LazyRoute {path} {component}>Loading...</LazyRoute>
            {/each}
            <LazyRoute
                path="*"
                component={() => import("./routes/NotFound.svelte")}
            />
        </Router>
    </main>

    <Footer />
</div>
