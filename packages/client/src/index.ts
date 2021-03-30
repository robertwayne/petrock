import App from './App.svelte'

export const app = new App({
    target: document.body,
})

if (import.meta.hot) {
    import.meta.hot.accept()
    import.meta.hot.dispose(() => {
        app.$destroy()
    })
}
