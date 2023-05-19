import useCcxtClient from '~/composables/useCcxtClient'
import { ExchangeOptions } from '~/utils/ccxt/types'
import { Ref } from 'vue'

const useOrders = (exchangeId: string | Ref<string>, exchangeOptions: ExchangeOptions | Ref<ExchangeOptions> = {}) => {
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
