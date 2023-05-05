// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@element-plus/nuxt'],
  runtimeConfig: {
    binance: {
      apiKey: process.env.XMMX_BINANCE_API_KEY,
      secret: process.env.XMMX_BINANCE_SECRET_KEY,
    },
  },
  tailwindcss: {
    cssPath: '@assets/scss/tailwind.scss',
    configPath: 'tailwind.config',
  },
  ssr: false,
})
