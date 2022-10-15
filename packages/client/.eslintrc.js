module.exports = {
    env: {
        browser: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: ["svelte3", "@typescript-eslint"],
    overrides: [
        {
            files: ["*.ts"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
            ],
            rules: {
                "@typescript-eslint/array-type": [
                    "error",
                    {
                        default: "generic",
                    },
                ],
                "no-undef": "off",
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-empty-function": "off",
            },
        },
        {
            files: ["*.svelte"],
            processor: "svelte3/svelte3",
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
            ],
            rules: {
                "@typescript-eslint/array-type": [
                    "error",
                    {
                        default: "generic",
                    },
                ],
                "no-undef": "off",
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-empty-function": "off",
            },
        },
    ],
    rules: {},
    settings: {
        "svelte3/typescript": require("typescript"),
    },
}
