<script lang="ts">
</script>

<div id="wrapper">
    <div id='not-implemented-warning'>This page is incomplete and not working fully. Please check back later.</div>
    <form>
        <div id='name'>
            <label for='search-name'>Name: </label>
            <input name='search-name'>
        </div>

        <div id='level-range'>
            <label for='level-min'>Level: </label>
            <input name='level-min'>
            <span>to</span>
            <label for='level-max'></label>
            <input name='level-max'>
        </div>

    </form>
</div>

<style>
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        width: 100%;
        height: 100%;
    }

    form div {
        display: flex;
        justify-content: center;
        padding: 0 20px;
    }

    input {
        padding: 2px;
        border-radius: 4px;
        background-color: var(--theme-primary-text);
        border: 0px solid #ccc;
        margin: 4px 0;
        height: 25px;
    }

    input:focus {
        box-shadow: 0 0 0 3px black;
        box-shadow: 0 0 0 3px var(--theme-primary-text);
    }

    label {
        padding: 0 10px 0 0;
    }

    #name {
        width: 100%;
    }

    #level-range {
        display: flex;
        flex-direction: row;
    }

    #level-range span {
        padding: 5px 0 0 10px;
    }

    #not-implemented-warning {
        color: rgb(199, 45, 45);
        font-weight: bold;
    }

    #wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
</style>
