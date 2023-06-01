import { defineStore, Store } from 'pinia'
import { computed, onMounted, readonly, Ref, triggerRef, unref } from 'vue'
import useCcxtClient from '~/components/trading/useCcxtClient'
import { useMessage } from 'naive-ui'
import useDiscordWebhook from '~/composables/useDiscordWebhook'

// TODO: This is a hack to get the speech synthesis to work
window.speechSynthesis.getVoices()

// 同じ取引所に複数のストアが作成される場合があるので自前でキャッシュする
const storeCache = new Map<string, Store>()

const useOrderStore = (exchangeId: string | Ref<string>) => {
  console.log(`Factory order store for ${unref(exchangeId)}`)

  if (storeCache.has(unref(exchangeId))) {
    console.log(`Reuse order store for ${unref(exchangeId)}`)
    return storeCache.get(unref(exchangeId))
  }

  const store = defineStore(`${exchangeId}OrderStore`, () => {
    console.log(`Define order store for ${unref(exchangeId)}`)
    const { client } = useCcxtClient(exchangeId)
    const orderState = computed(() => client.value.getOrderState())
    const msg = useMessage()

    // TODO: This is a hack to get the speech synthesis to work
    const reported = new Set()
    const { post } = useDiscordWebhook()

    onMounted(async () => {
      await client.value.initializeOrders().then(
        async () => {
          await client.value.watchOrders(() => triggerRef(orderState))
          triggerRef(orderState)
          console.log(`Initialized order store for ${unref(exchangeId)}`)

          // TODO: This is a hack to get the speech synthesis to work
          Object.values(orderState.value).forEach(o => reported.add(o.id))
        },
        error => {
          msg.warning(`Failed to initialize order store for ${unref(exchangeId)} (${error.statusCode}: )`)
        }
      )

      // TODO: This is a hack to get the speech synthesis to work
      setInterval(async () => {
        Object.values(orderState.value)
          .filter(o => o.status === 'closed')
          .filter(o => !reported.has(o.id))
          .forEach(o => {
            if (!reported.has(o.id)) {
              console.log('Execution', o)
              const price = o.average
              const side = o.side === 'buy' ? 'long' : 'short'
              const symbol = o.symbol.split(':')[0].replace('/', '')
              const uttr = new SpeechSynthesisUtterance()
              uttr.lang = 'en-US'
              uttr.rate = 1.25
              const voices = window.speechSynthesis.getVoices()
              uttr.voice =
                voices.find(voice => voice.name === 'Google US English') ||
                voices.find(voice => voice.name === 'Samantha') ||
                null
              uttr.text = `${side.toLocaleUpperCase()}: ${symbol} at ${price} with a lot of ${o.amount}`

              msg.success(uttr.text, { duration: 5000 })
              window.speechSynthesis.speak(uttr)

              post(uttr.text)
            }
            reported.add(o.id)
          })
      }, 3000)
    })

    return {
      orderState: readonly(orderState),
      reload: async () =>
        await client.value.initializeOrders().then(
          () => triggerRef(orderState),
          error => console.error(error)
        ),
    }
  })()

  storeCache.set(unref(exchangeId), store)

  return store
}

export default useOrderStore
