<script lang="ts">
    import { onMount } from 'svelte'
    import { url } from '../constants'
    import type { Item } from '../../../shared/types'
    import { items } from '../stores'
    
    async function getItemList() {
        let response: Response | undefined

        try {
            response = await fetch(`http://localhost:3000/api/v1/items`)
        } catch (err) {
            const subheader: HTMLElement = document.getElementById('disconnect-error') as HTMLElement
            subheader.classList.remove('hidden')
            return
        }

        if (!response) return

        const data: Array<Item> = await response.json()
        let _items: Array<Item> = []
        
        for (const [index, item] of Object.entries(data)) {
            let _item: Item = {
                name: item.name,
                slot: item.slot,
                usable_by: item.usable_by,
                level: item.level,
                icon: item.icon
            }

            _items.push(_item)
        }
        $items = _items
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
            {#each $items as item}
                <tr>
                    <td>
                        <span>{item.icon}</span>
                        <a href="#/not-implemented">{item.name}</a></td
                    >
                    <td>{item.level}</td>
                    <td>{item.slot}</td>
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

    td a {
        text-decoration: none;
        color: var(--theme-primary-accent)
    }
</style>
