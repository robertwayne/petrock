<script lang="ts">
    import { link, push } from 'svelte-spa-router'
</script>

<div>
    <button on:click={() => push('/')}>Home</button>
    <button on:click={() => push('/not-implemented')}>Database</button>
    <button on:click={() => push('/tracker')}>Tracker</button>
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: space-between;
        height: 75px;
        background-color: var(--theme-primary-text);
        border-collapse: collapse;
    }

    button {
        display: flex;
        flex: 1;
        justify-content: space-between;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--theme-primary);
        background-color: var(--theme-primary-shadow);
        font-weight: bold;
        font-size: 13pt;
        outline: none;
        text-decoration: none;
        color: var(--theme-primary-text)
    }
</style>
