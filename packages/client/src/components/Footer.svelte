<footer>
    <div id="wrapper">
        <div>
            <a href="https://github.com/robertwayne/petrock">GitHub</a>
            -
            <a href="https://retro-mmo.com">RetroMMO</a>
        </div>
        <div>(c) 2021 <span id="name">&nbsp;Rob Wagner</span></div>
        <div id="notice">petrock.gg is not affiliated with RetroMMO.</div>
    </div>
</footer>

<style>
    footer {
        background-color: var(--theme-primary-shadow);
    }



    footer div {
        display: flex;
        justify-content: center;
    }

    div a {
        font-weight: bold;
        padding: 0 5px;
        color: var(--theme-primary-accent);
        text-decoration: none;
    }

    div a:hover {
        color: var(--theme-primary-text);
    }

    #wrapper {
        display: flex;
        flex-direction: column;
        padding: 20px 0;
    }

    #notice {
        font-style: italic;
    }

    #name {
        font-weight: bold;
    }
</style>
