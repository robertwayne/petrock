<script lang='ts'>
    export let error_label: string
</script>

<div id="disconnect-error" class='hidden'>{error_label}<br />Please reload the page to reconnect.</div>

<style>
    #disconnect-error {
        color: rgb(199, 45, 45);
        font-weight: bold;
        font-size: 16pt;
        text-align: center;
    }

    .hidden {
        display: none;
    }
</style>