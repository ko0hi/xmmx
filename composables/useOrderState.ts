import { ComputedRef } from 'vue'
import useCcxtClient from '~/composables/useCcxtClient'
import { ExchangeOptions } from '~/utils/ccxt/types'

const useOrders = (
  exchangeId: string | ComputedRef<string>,
  exchangeOptions: ExchangeOptions | ComputedRef<ExchangeOptions> = {}
) => {
  const { client } = useCcxtClient(exchangeId, exchangeOptions)
  const orderState = computed(() => client.value.getOrderStateFromSocket())

  onMounted(async () => {
    await client.value.initializeOrders()
    await client.value.watchOrders(() => triggerRef(orderState))
    triggerRef(orderState)
  })

  return { orderState }
}

export default useOrders
