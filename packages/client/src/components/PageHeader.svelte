<script lang="ts">
    import Disconnected from './Disconnected.svelte'
    export let header: string
    export let subheader: string = ''
</script>

<div>
    <span id="page-header">{header}</span>
    <Disconnected error_label="LOST CONNECTION" />
    <span id="page-subheader">{subheader}</span>
</div>

<style>
    #page-header {
        display: flex;
        justify-content: center;
        font-size: 30pt;
        font-weight: bold;
        padding: 1% 0 0 0;
        height: max-content;
    }

    @media (min-width: 720px) {
        #page-header {
            font-size: 36pt;
        }
    }

    #page-subheader {
        display: flex;
        justify-content: center;
        font-style: italic;
        color: var(--theme-primary-text);
        opacity: 0.7;
        margin-top: -4px;
        height: max-content;
        padding: 0 0 4% 0;
    }
</style>
