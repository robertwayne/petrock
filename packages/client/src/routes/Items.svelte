<script lang="ts">
    import Results from '../components/Results.svelte'
    import ItemSearch from '../components/ItemSearch.svelte'
</script>

<div>
    <div class='inner'>
        <ItemSearch />
    </div>

    <div>
        <Results />
    </div>

</div>

<style>
    .inner {
        padding: 10px;
    }
</style>
