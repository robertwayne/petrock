import Home from './routes/Home.svelte'
import { wrap } from 'svelte-spa-router/wrap'

export const routes = {
    '/': Home,
    '/items': wrap({
        asyncComponent: () => import('./routes/Items.svelte')
    }),
    '*': wrap({
        asyncComponent: () => import('./routes/NotFound.svelte')
    })
}