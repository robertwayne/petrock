<script>
    import { pop } from 'svelte-spa-router'
</script>

<div>
    <h1>Uh oh!</h1>
    <p>That page doesn't seem to exist!</p>
    <br />
    <p><button on:click={pop}>...go back</button></p>
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

    button {
        background: none;
        border: none;
        font-size: 16pt;
    }

    p > button {
        text-decoration: none;
        color: var(--theme-primary-accent);
    }

    p > button:hover {
        font-weight: bold;
        cursor: pointer;
        text-decoration: underline;
    }
</style>
