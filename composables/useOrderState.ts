import useCcxtClient from '~/composables/useCcxtClient'
import { ExchangeOptions } from '~/utils/ccxt/types'
import { Ref } from 'vue'
import { useDialog } from 'naive-ui'

const useOrders = (exchangeId: string | Ref<string>, exchangeOptions: ExchangeOptions | Ref<ExchangeOptions> = {}) => {
  const { client } = useCcxtClient(exchangeId, exchangeOptions)
  const orderState = computed(() => client.value.getOrderStateFromSocket())
  const dialog = useDialog()

  onMounted(async () => {
    await client.value.initializeOrders().catch(error => {
      dialog.error({
        title: `${error.statusCode}: Failed to initialize your orders`,
        content: error.data,
      })
    })
    await client.value.watchOrders(() => triggerRef(orderState))
    triggerRef(orderState)
  })

  return { orderState }
}

export default useOrders
