<script lang="ts">
    import Disconnected from './Disconnected.svelte'
    export let subheader: string
</script>

<div>
    <h1>Leaderboards</h1>
    <Disconnected error_label="LOST CONNECTION" />
    <span id="subheader">{subheader}</span>
</div>

<style>
    h1 {
        display: flex;
        justify-content: center;
        font-size: 26pt;
        padding: 1% 0 0 0;
        height: max-content;
    }

    #subheader {
        display: flex;
        justify-content: center;
        font-style: italic;
        color: var(--theme-primary-text);
        opacity: 0.7;
        margin-top: -4px;
        height: max-content;
        padding: 0 0 4% 0;
    }

    @media (min-width: 720px) {
        h1 {
            display: flex;
            justify-content: center;
            font-size: 36pt;
            padding: 1% 0 0 0;
            height: max-content;
        }
    }
</style>
