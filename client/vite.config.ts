import * as dotenv from "dotenv"

import { defineConfig } from "vitest/config"
import { svelte } from "@sveltejs/vite-plugin-svelte"

dotenv.config()

export default ({ mode }) => {
    return defineConfig({
        base: "/",
        plugins: [svelte()],
        build: {
            outDir: process.env.BUILD_PATH || "dist",
            emptyOutDir: true,
            minify: "terser",
            terserOptions: {
                format: {
                    comments: false,
                },
            },
        },
        optimizeDeps: {
            exclude: ["svelte-navigator"],
        },
        server: {
            https: false,
            port: 3000,
            host: "127.0.0.1",
        },
        define: {
            "import.meta.vitest": false,
        },
        test: {
            includeSource: ["src/**/*.ts"],
            globals: true,
            environment: "happy-dom",
        },
    })
}
