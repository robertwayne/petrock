<script>
    import '/static/css/themes.css'
    import Nav from './components/Nav.svelte'
    import Leaderboard from './components/Leaderboard.svelte'
    import Footer from './components/Footer.svelte'
</script>

<div class="container">
    <nav>
        <Nav />
    </nav>
    <header />
    <main>
        <Leaderboard />
    </main>
    <footer>
        <Footer />
    </footer>
</div>

<style>
    :global(*, html, body) {
        margin: 0;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    :global(body) {
        line-height: 1.5;
        background-color: var(--theme-primary);
        color: var(--theme-primary-text);
        font-family: var(--font-primary);
    }

    :global(main) {
        grid-area: main;
        display: flex;
        padding: 0;
        flex-direction: column;
        justify-content: center;
        height: max-content;
        width: 100vw;
    }

    @media (min-width: 720px) {
        :global(main) {
            padding: 0 10%;
        }
    }

    :global(#logo-highlight) {
        color: var(--theme-primary-accent);
    }

    :global(a) {
        text-decoration: underline dotted var(--theme-primary-lighter) 1px;
        color: inherit;
    }

    :global(a:hover) {
        color: var(--theme-primary-accent);
        font-weight: bold;
    }

    .container {
        display: grid;
        grid-template-rows: 35px auto 100px;
        grid-template-areas:
            'nav'
            'main'
            'footer';
    }
</style>
