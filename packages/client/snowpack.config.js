/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
    },
    plugins: ['@snowpack/plugin-svelte', '@snowpack/plugin-dotenv', '@snowpack/plugin-typescript'],
    optimize: {
        bundle: true,
        minify: true,
        treeshake: true,
        splitting: false,
        target: 'es2020',
        entrypoints: 'auto',
    },
}
