<script>
    import '/static/css/themes.css'
    import '/static/css/global.css'
    import Router from 'svelte-spa-router'
    import Nav from './components/Nav.svelte'
    import Footer from './components/Footer.svelte'
    import BottomNav from './components/BottomNav.svelte'
    import { routes } from './routeHandler'
</script>

<div id="container">
    <nav id="top-nav">
        <Nav />
    </nav>
    <main>
        <Router {routes} />
    </main>
    <nav id="bottom-nav">
        <BottomNav />
    </nav>
    <footer>
        <Footer />
    </footer>
</div>

<style>
    #container {
        display: grid;
        grid-template-rows: 35px auto 100px;
        grid-template-areas:
            'nav'
            'main'
            'footer';
        height: 100vh;
    }

    #top-nav {
        grid-area: nav;
        max-height: 35px;
    }

    #bottom-nav {
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
        #container {
            display: grid;
            grid-template-rows: 35px auto 100px;
            grid-template-areas:
                'nav'
                'main'
                'footer';
            height: 100vh;
        }

        #bottom-nav {
            visibility: hidden;
        }

        footer {
            visibility: visible;
        }
    }
</style>
