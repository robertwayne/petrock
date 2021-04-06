<script>
    import '/static/css/themes.css'
    import '/static/css/global.css'
    import Router from 'svelte-spa-router'
    import Nav from './components/Nav.svelte'
    import Footer from './components/Footer.svelte'
    import { routes } from './routeHandler'
    import BottomNav from './components/BottomNav.svelte'
</script>

<div class="container">
    <nav class="top-nav">
        <Nav />
    </nav>
    <main>
        <Router {routes} />
    </main>
    <nav class="bottom-nav">
        <BottomNav />
    </nav>
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
    }

    .top-nav {
        grid-area: nav;
        max-height: 35px;
    }

    .bottom-nav {
        grid-area: footer;
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    footer {
        grid-area: footer;
        visibility: hidden;
    }

    @media (min-width: 720px) {
        .container {
            display: grid;
            grid-template-rows: 35px auto 100px;
            grid-template-areas:
                'nav'
                'main'
                'footer';
            height: 100vh;
        }

        .bottom-nav {
            visibility: hidden;
        }

        footer {
            visibility: visible;
        }
    }
</style>
