<script lang="ts">
    import PageHeader from "../components/PageHeader.svelte"
    import { onMount } from "svelte"
    import { url } from "../constants"
    import { expPreviousExperience } from "../stores"
    import { expPerHour, expThisSession } from "../stores"
    import { fade } from "svelte/transition"
    import type { RawPlayerData } from "../../../shared/types"

    let username = ""
    let expInterval: NodeJS.Timer
    let sessionDuration = 0
    let sessionLog: Array<string> = []
    let requestTimer = 0
    let sessionLogUpdated = false

    const loadPlayer = async () => {
        sessionDuration = Math.floor(performance.now() / 1000)

        let response = undefined
        requestTimer++

        // only make a GET request every 30 seconds; we still want to update the timer though
        if (requestTimer < 5) return
        requestTimer = 0

        try {
            response = await fetch(`${url}/api/v1/history?username=${username}`)
        } catch (err) {
            document
                .getElementById("username-input")
                ?.classList.add("tracker-error")
            clearInterval(expInterval)
            return
        }

        if (!response) return

        const data: RawPlayerData = await response.json()

        if ($expPreviousExperience === 0) {
            $expPreviousExperience = data.experience
        }

        if ($expPreviousExperience != data.experience) {
            const diff = data.experience - $expPreviousExperience
            $expThisSession = diff

            // if ($expThisSession != diff) {
            //     sessionLog = [...sessionLog, `+${diff}xp`]
            //     sessionLogUpdated = true
            // }
        }

        $expPerHour = Math.floor(
            Math.min(0, ($expThisSession / sessionDuration) * 3600)
        )
    }

    onMount(async () => {
        document
            .getElementById("start-button")
            ?.addEventListener("click", (e) => {
                const input: HTMLInputElement = document.getElementById(
                    "username-input"
                ) as HTMLInputElement
                username = input.value

                if (username.length < 3) return

                expInterval = setInterval(loadPlayer, 1000)

                input.blur()
                input.disabled = true
                input.value = `Tracking ${input.value}...`
                input.classList.add("tracker-active")
            })

        document.getElementById("new-session-button")
        document.getElementById("save-session-button")
        document.getElementById("load-previous-session-button")

        document.addEventListener("submit", (e) => {
            e.preventDefault()
        })

        return () => {
            clearInterval(expInterval)
            sessionDuration = 0
        }
    })
</script>

<div>
    <PageHeader
        header="Experience Tracker"
        subheader="Easily track your experience per hour!"
    />
    <div class="wrapper" in:fade={{ duration: 500 }}>
        <form>
            <label for="text" />
            <input
                id="username-input"
                on:submit={loadPlayer}
                type="text"
                name="Username"
                placeholder="Enter username..."
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
            />
            <button id="start-button">Track</button>
        </form>
        <div id="sub-buttons">
            <button id="new-button">New Session</button>
            <button id="save-button" disabled>Save Session</button>
            <button id="previous-button" disabled>Previous Session</button>
        </div>
        <div class="data-labels">
            XP Per Hour: {$expPerHour.toLocaleString()}
        </div>
        <div class="data-labels">
            Total XP Gained: {$expThisSession.toLocaleString()}
        </div>
        <div class="data-labels">
            Session Length: {new Date(sessionDuration * 1000)
                .toISOString()
                .substr(11, 8)}
        </div>
        <div id="log">{sessionLog}</div>
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .data-labels {
        font-size: 18pt;
    }

    /* We mark these global to prevent Svelte from 
    complaining about unassigned CSS tags. */
    :global(.tracker-active) {
        border: 3px solid var(--theme-primary-green) !important;
        font-style: italic;
    }

    :global(.tracker-error) {
        border: 3px solid var(--theme-primary-red) !important;
        font-style: italic;
    }

    button {
        outline: none;
        border: none;
        background-color: var(--theme-primary-shadow);
        color: var(--theme-primary-text);
        font-weight: bold;
        font-size: 12pt;
    }

    #start-button {
        width: 30%;
    }

    button:hover {
        background-color: var(--theme-primary-accent);
        color: var(--theme-primary-shadow);
        cursor: pointer;
    }

    button:disabled:hover {
        background-color: var(--theme-primary-shadow);
        color: var(--theme-primary-text);
        cursor: not-allowed;
    }

    button:active {
        transition-duration: 150ms;
        background-color: var(--theme-primary-shadow);
        color: var(--theme-primary-text);
    }

    #sub-buttons button {
        padding: 10px;
    }

    #sub-buttons {
        display: flex;
        column-gap: 2px;
        padding-bottom: 20px;
    }

    #log {
        padding: 10px;
        background-color: var(--theme-primary-shadow);
        color: var(--theme-primary-text);
        min-width: 100vw;
        height: 300px;
    }

    @media (min-width: 720px) {
        #log {
            min-width: 600px;
        }
    }

    form {
        padding-bottom: 10px;
        display: flex;
        flex-direction: row;
    }

    input {
        font-size: 18pt;
        width: 100%;
        height: 40px;
        border: none;
        background-color: var(--theme-primary-lighter);
        color: var(--theme-primary-shadow);
        padding: 10px;
    }

    input::placeholder {
        color: var(--theme-primary-shadow);
        opacity: 0.8;
        font-style: italic;
    }
</style>
