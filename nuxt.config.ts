// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: ['@fortawesome/fontawesome-svg-core/styles.css', '@/assets/scss/tailwind-preflight.scss'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {
    public: {
      ccxtServerUrl: process.env.CCXT_SERVER_URL || 'http://localhost:3001',
    },
  },
  tailwindcss: {
    configPath: 'tailwind.config',
  },
  ssr: false,
  imports: {
    autoImport: false,
  },
})
