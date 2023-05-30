import { defineStore } from 'pinia'
import { computed, onMounted, readonly, Ref, triggerRef, unref } from 'vue'
import useCcxtClient from '~/components/trading/useCcxtClient'
import { useMessage } from 'naive-ui'

const useOrderStore = (exchangeId: string | Ref<string>) => {
  console.log(`Factory order store for ${unref(exchangeId)}`)
  return defineStore(`${exchangeId}OrderStore`, () => {
    console.log(`Define order store for ${unref(exchangeId)}`)
    const { client } = useCcxtClient(exchangeId)
    const orderState = computed(() => client.value.getOrderState())
    const msg = useMessage()
    onMounted(async () => {
      await client.value.initializeOrders().then(
        async () => {
          await client.value.watchOrders(() => triggerRef(orderState))
          triggerRef(orderState)
          console.log(`Initialized order store for ${unref(exchangeId)}`)
        },
        error => {
          msg.warning(`Failed to initialize order store for ${unref(exchangeId)} (${error.statusCode}: )`)
        }
      )
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
}

export default useOrderStore
