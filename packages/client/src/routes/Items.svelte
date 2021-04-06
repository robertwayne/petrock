<script lang="ts">
    import Results from '../components/Results.svelte'
    import ItemSearch from '../components/ItemSearch.svelte'
    import PageHeader from '../components/PageHeader.svelte'
</script>

<div>
    <PageHeader header='Item Search' />
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
