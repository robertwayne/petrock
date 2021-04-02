<script>
    import '/static/css/themes.css'
    import Router from 'svelte-spa-router'
    import Nav from './components/Nav.svelte'
    import Footer from './components/Footer.svelte'
    import { routes } from './routeHandler'
</script>

<div class="container">
    <nav>
        <Nav />
    </nav>
    <main>
        <Router {routes} />
    </main>
    <footer>
        <Footer />
    </footer>
</div>

<style>
    :global(*, html, body) {
        margin: 0;
        box-sizing: border-box;
    }

    :global(body) {
        line-height: 1.5;
        background-color: var(--theme-primary);
        color: var(--theme-primary-text);
        font-family: var(--font-primary);
    }

    :global(main) {
        grid-area: main;
        padding: 0;
        height: 100%;
    }

    @media (min-width: 720px) {
        :global(main) {
            padding: 0 10% 5% 10%;
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
        height: 100vh;
        overflow: none;
    }

    :global(nav) {
        grid-area: nav;
        max-height: 35px;
    }

    :global(footer) {
        grid-area: footer;
        max-height: 100px;
    }
</style>
