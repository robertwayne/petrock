export const tickRate = import.meta.env.TICK_RATE
// export const url = import.meta.env.MODE === 'production' ? import.meta.env.API_BASE_URL : 'http://localhost:3000'
// snowpack v3+ is not setting mode/node_env properly w/ build
// can uncomment when it is fixed...
// see: https://github.com/snowpackjs/snowpack/issues/3053
export const url = 'https://petrock.gg'
