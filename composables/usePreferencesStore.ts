import { defineStore } from 'pinia'
import { ref } from 'vue'

const usePreferencesStore = defineStore(
  'preferencesStore',
  () => {
    const discordWebhookUrl = ref<string>('hello')

    return { discordWebhookUrl }
  },
  {
    persist: {
      storage: localStorage,
      debug: true,
    },
  }
)

export default usePreferencesStore
