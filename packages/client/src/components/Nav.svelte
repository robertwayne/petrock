<script lang="ts">
    import { link } from 'svelte-spa-router'
</script>

<nav>
    <div id="wrapper">
        <div class="left"><a href="#/">Pet<span class="logo-highlight">Rock</span></a></div>
        <div class="right">
            <span id="header-small" class="right">Leaderboards</span>
            <ul id="main-menu">
                <li class="menu">
                    <span id="header">Tools<i class="icofont-caret-down" /></span>
                    <ul class="dropdown">
                        <li><a href="/" use:link>Leaderboards</a></li>
                        <li><a href="/tracker" use:link>XP Tracker</a></li>
                    </ul>
                </li>
                <li class="menu">
                    <span id="header" href="#/">Database<i class="icofont-caret-down" /></span>
                    <ul class="dropdown">
                        <li><a href="/classes" use:link>Classes</a></li>
                        <li><a href="/events" use:link>Events</a></li>
                        <li><a href="/items" use:link>Items</a></li>
                        <li><a href="/monsters" use:link>Monsters</a></li>
                        <li><a href="/skills" use:link>Skills</a></li>
                        <li><a href="/zones" use:link>Zones</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    #header {
        font-size: 100%;
        font-family: inherit;
        border: 0;
        padding: 0;
    }

    #header:hover {
        cursor: default;
        font-weight: bold;
        color: var(--theme-primary-accent);
    }

    #main-menu {
        padding-right: 20px;
    }

    .menu {
        padding: 0 30px;
        overflow: hidden;
    }

    .dropdown {
        background-color: var(--theme-primary-shadow);
        position: absolute;
        padding: 3px;
        visibility: hidden;
        flex-direction: column;
        justify-content: left;
        width: 140px;
        height: max-content;
        list-style: none;
        z-index: 2;
    }

    .dropdown li {
        height: max-content;
        padding: 8px 0 0 8px;
    }

    .menu:hover .dropdown {
        visibility: visible;
        border: none;
    }

    nav {
        grid-area: nav;
        overflow: hidden;
        padding: 3px 1%;
        background-color: var(--theme-primary-shadow);
        height: 100%;
    }

    @media (min-width: 720px) {
        nav {
            visibility: visible;
            background: linear-gradient(15deg, var(--theme-primary) 28%, var(--theme-primary-shadow) 0);
        }

        .left {
            font-size: 34pt;
            position: absolute;
            top: -3px;
        }
    }

    @media (min-width: 1000px) {
        nav {
            background: linear-gradient(15deg, var(--theme-primary) 22%, var(--theme-primary-shadow) 0);
        }

        .left {
            font-size: 34pt;
            position: absolute;
            top: -3px;
        }
    }

    @media (min-width: 1440px) {
        nav {
            background: linear-gradient(15deg, var(--theme-primary) 15%, var(--theme-primary-shadow) 0);
        }

        .left {
            font-size: 34pt;
            position: absolute;
            top: -3px;
        }
    }

    #wrapper {
        display: flex;
        flex-direction: row;
        font-size: 14pt;
    }

    .left {
        flex: 1;
        font-weight: bold;
        font-size: 22pt;
        position: absolute;
        top: -3px;
        height: max-content;
    }

    .left a:hover {
        color: inherit;
    }

    .right {
        display: none;
    }

    .logo-highlight {
        color: var(--theme-primary-accent);
    }

    @media (min-width: 720px) {
        .right {
            display: flex;
            flex: 1;
            align-content: center;
        }
    }

    ul {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        list-style: none;
    }

    #header:hover i {
        font-weight: bold;
        color: var(--theme-primary-accent);
    }

    i {
        position: inline-block;
        height: max-content;
        padding: 6px 3px;
        font-size: 14pt;
        color: var(--theme-primary-text);
    }

    a {
        text-decoration: none;
    }
</style>
