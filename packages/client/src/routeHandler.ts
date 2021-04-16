import Home from './routes/Home.svelte'
import { wrap } from 'svelte-spa-router/wrap'

export const routes = {
    '/': Home,
    '/leaderboard': Home,
    '/players/:username': wrap({
        asyncComponent: () => import('./routes/Profile.svelte'),
    }),
    '/items': wrap({
        asyncComponent: () => import('./routes/Items.svelte'),
    }),
    '/classes': wrap({
        asyncComponent: () => import('./routes/Classes.svelte'),
    }),
    '/events': wrap({
        asyncComponent: () => import('./routes/Events.svelte'),
    }),
    '/monsters': wrap({
        asyncComponent: () => import('./routes/Monsters.svelte'),
    }),
    '/skills': wrap({
        asyncComponent: () => import('./routes/Skills.svelte'),
    }),
    '/zones': wrap({
        asyncComponent: () => import('./routes/Zones.svelte'),
    }),
    '/tracker': wrap({
        asyncComponent: () => import('./routes/Tracker.svelte'),
    }),
    '*': wrap({
        asyncComponent: () => import('./routes/NotFound.svelte'),
    }),
}
