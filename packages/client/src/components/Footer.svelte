<div id="wrapper">
    <div>
        <a href="https://github.com/robertwayne/petrock" target="_blank" rel="noopener">GitHub</a>
        -
        <a href="https://retro-mmo.com" target="_blank" rel=noopener>RetroMMO</a>
    </div>
    <div>(c) 2021 <span id="name">&nbsp;Rob Wagner</span></div>
    <div id="notice">petrock.gg is not affiliated with RetroMMO.</div>
</div>

<style>
    #wrapper div {
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
        grid-area: footer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: var(--theme-primary-shadow);
        padding: 20px 0;
    }

    #notice {
        font-style: italic;
    }

    #name {
        font-weight: bold;
    }
</style>
