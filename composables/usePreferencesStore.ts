import { defineStore } from 'pinia'
import { ref } from 'vue'

const usePreferencesStore = defineStore(
  'preferencesStore',
  () => {
    const discordWebhookUrl = ref<string>('YOUR_WEBHOOK_URL')

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
