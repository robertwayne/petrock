<script lang="ts" module>
    import { url } from '../constants'
    import { onMount } from 'svelte'
    import type { Player } from '../../../shared/types'

    interface ProfileParams {
        username: string
    }
    
    export let params: ProfileParams
    let player: Player;

    onMount(async () => {
        let response = undefined

        try {
            response = await fetch(`${url}/api/v1/history?username=${params.username}&tooltip=true`)
        } catch (err) {
            console.log(err)
        }

        if (!response) return

        player = await response.json()
        console.log(player)

    })
</script>

<!-- <div>{#if player}This is {player.username} profile.
    {:else}Loading...
    {/if}</div> -->
