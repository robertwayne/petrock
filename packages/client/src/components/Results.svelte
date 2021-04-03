<script lang="ts">
    import { onMount } from 'svelte'
    import { url } from '../constants'
    import type { Item } from '../../../shared/types'

    $: items = []
    
    async function getItemList() {
        let response: Response | undefined

        try {
            response = await fetch(`${url}/api/v1/items`)
        } catch (err) {
            const subheader: HTMLElement = document.getElementById('disconnect-error') as HTMLElement
            subheader.classList.remove('hidden')
            return
        }

        if (!response) return

        const data: Array<Item> = await response.json()
        console.log(data)
    }

    onMount(async () => {
        await getItemList()
    })
</script>

<div id="wrapper">
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Level</th>
                <th>Slot</th>
                <th>Classes</th>
            </tr>
        </thead>
        <tbody>
            {#each items as item}
                <tr>
                    <td>
                        <span>{item.icon}</span>
                        {item.name}</td
                    >
                    <td>{item.level}</td>
                    <td>{item.slot}</td>
                    <td>{item.classes}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    #wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: var(--theme-primary-shadow);
        border-radius: 6px;
    }

    table {
        width: 100%;
        text-align: left;
        padding: 10px;
    }

    tr:after {
        border-bottom: 1px solid var(--theme-primary-text);
    }

    td {
        font-size: 14pt;
        padding: 3px 0;
    }
</style>
