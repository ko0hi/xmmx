import usePreferencesStore from '~/composables/usePreferencesStore'
import { useMessage } from 'naive-ui'

const useDiscordWebhook = () => {
  const msg = useMessage()
  const post = async (message: string) => {
    const url = usePreferencesStore().discordWebhookUrl
    if (!url) {
      throw new Error('Discord webhook URL is not set')
    }
    await $fetch(url, { method: 'POST', body: JSON.stringify({ content: message }) })
  }

  return { post }
}

export default useDiscordWebhook
