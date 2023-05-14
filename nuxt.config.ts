// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@element-plus/nuxt'],
  runtimeConfig: {
    public: {
      ccxtServerUrl: process.env.CCXT_SERVER_URL || 'http://localhost:3001',
    },
  },
  tailwindcss: {
    cssPath: '@assets/scss/tailwind.scss',
    configPath: 'tailwind.config',
  },
  ssr: false,
})
