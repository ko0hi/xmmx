import { defineStore } from 'pinia'
import { computed, onMounted, readonly, Ref, triggerRef } from 'vue'
import useCcxtClient from '~/components/trading/useCcxtClient'
import { useMessage } from 'naive-ui'

const useOrderStore = (exchangeId: string | Ref<string>) => {
  return defineStore(`${exchangeId}OrderStore`, () => {
    const { client } = useCcxtClient(exchangeId)
    const orderState = computed(() => client.value.getOrderStateFromSocket())
    const msg = useMessage()
    onMounted(async () => {
      console.log(`OnMounted useOrderStore: ${exchangeId}`)
      await client.value.initializeOrders().catch(error => {
        // FIXME
        msg.warning(`${error.statusCode}: Failed to initialize your orders`)
        // dialog.error({
        //   title: `${error.statusCode}: Failed to initialize your orders`,
        //   content: error.data,
        // })
      })
      await client.value.watchOrders(() => triggerRef(orderState))
      triggerRef(orderState)
    })

    return {
      orderState: readonly(orderState),
    }
  })()
}

export default useOrderStore
