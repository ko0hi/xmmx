// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@element-plus/nuxt'],
  tailwindcss: {
    cssPath: '@assets/scss/tailwind.scss',
    configPath: 'tailwind.config',
  },
  ssr: false,
})
