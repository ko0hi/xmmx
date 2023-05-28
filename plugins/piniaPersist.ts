import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'

export default defineNuxtPlugin(_nuxtApp => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
})
