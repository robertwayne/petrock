<script lang="ts">
    import { onMount } from 'svelte'
    import { url } from '../constants'
    import type { Item } from '../../../shared/types'
    import { ItemSlot, ItemType } from '../enums'
    import { items } from '../stores'

    const getSlot = (slot: unknown) => {
        switch (slot) {
            case ItemSlot.HEAD: {
                return 'Head'
            }
            case ItemSlot.BODY: {
                return 'Body'
            }
            case ItemSlot.MAIN_HAND: {
                return 'Main-Hand'
            }
            case ItemSlot.OFF_HAND: {
                return 'Off-Hand'
            }
            case ItemSlot.MASK: {
                return 'Mask'
            }
            case ItemSlot.OUTFIT: {
                return 'Outfit'
            }
            case ItemSlot.CLOTHES_DYE: {
                return 'Clothes Dye'
            }
            case ItemSlot.HAIR_DYE: {
                return 'Hair Dye'
            }
            default: {
                return 'Unknown'
            }
        }
    }

    const getType = (itemType: unknown) => {
        switch (itemType) {
            case ItemType.EQUIPMENT: {
                return 'Equipment'
            }
            case ItemType.COSMETIC: {
                return 'Cosmetic'
            }
            case ItemType.CONSUMABLE: {
                return 'Consumable'
            }
            case ItemType.MISC: {
                return 'Misc'
            }
            default: {
                return 'Unknown'
            }
        }
    }

    const getLevel = (itemLevel: unknown) => {
        switch (itemLevel) {
            case null:
                return ''
            default:
                return itemLevel
        }
    }

    async function getItemList() {
        let response: Response | undefined

        try {
            response = await fetch(`${url}/api/v1/items`)
        } catch (err) {
            const subheader: HTMLElement = document.getElementById('disconnect-error') as HTMLElement
            subheader.classList.remove('hidden')
            $items = []
            return
        }

        if (!response) return

        const data: Array<Item> = await response.json()
        let _items: Array<Item> = []

        for (const [index, item] of Object.entries(data)) {
            let str
            let _item: Item = {
                name: item.name,
                slot: getSlot(item.slot),
                type: getType(item.type),
                usable_by: item.usable_by,
                level: item.level,
                icon: item.icon,
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
            {#if !$items}
                <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Slot</th>
                    <th>Type</th>
                </tr>
            {/if}
        </thead>
        <tbody>
            <div id="disconnect-error" class="hidden">
                There was a problem connecting to the database. Try reloading the page.
            </div>
            {#each $items as item}
                <tr>
                    <td>
                        <span>{item.icon}</span>
                        <a href="#/not-implemented">{item.name}</a></td
                    >
                    <td>{item.level}</td>
                    <td>{item.slot}</td>
                    <td>{item.type}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    #disconnect-error {
        text-align: center;
    }

    .hidden {
        display: none;
    }

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
        border-spacing: 0;
        border-collapse: separate;
    }

    tr:after {
        border-bottom: 1px solid var(--theme-primary-text);
    }

    tr:nth-child(even) {
        background-color: var(--theme-primary);
    }

    td {
        font-size: 14pt;
        padding: 3px 0;
    }

    td a {
        text-decoration: none;
        font-weight: bold;
        color: var(--theme-primary-accent);
    }

    td a:hover {
        text-decoration: underline;
    }
</style>
