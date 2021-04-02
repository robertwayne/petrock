<script>
</script>

<div>
    <h1>Uh oh!</h1>
    <p>That page doesn't seem to exist!</p>
    <br />
    <p><a href="#/">...return home</a></p>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        padding-top: 10%;
    }
    p {
        display: flex;
        justify-content: center;
        font-size: 16pt;
    }

    p > a {
        text-decoration: none;
        color: var(--theme-primary-accent);
    }

    p > a:hover {
        font-weight: bold;
    }
</style>
