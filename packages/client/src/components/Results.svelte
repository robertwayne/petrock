<script lang='ts'>


    // test code; will use database shortly
    $: items = [
        {name: 'Leather Armor', level: 2, slot: 'Body', 
        classes: 'WZ, CL', icon: 'leatherArmor.png'},
        {name: 'Padded Garb', level: 2, slot: 'Body', 
        classes: 'CL', icon: 'paddedGarb.png'},
        {name: 'Tattered Cloak', level: 2, slot: 'Body', 
        classes: 'WZ, CL', icon: 'tatteredCloak.png'},
        {name: 'Leather Cap', level: 1, slot: 'Head', 
        classes: 'WR, WZ, CL', icon: 'leatherCap.png'},
        {name: 'Training Sword', level: 4, slot: 'Main Hand', 
        classes: 'WR', icon: 'trainingSword.png'},
        {name: 'Training Wand', level: 4, slot: 'Main Hand', 
        classes: 'WZ, CL', icon: 'trainingWand.png'},
        {name: 'Oaken Club', level: 2, slot: 'Main Hand', 
        classes: 'WR, CL', icon: 'oakenClub.png'},
        {name: 'Cypress Stick', level: 1, slot: 'Main Hand', 
        classes: 'WZ, CL', icon: 'cypressStick.png'},
    ]
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
                        {item.name}</td>
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
