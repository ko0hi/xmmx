import { computed, ref, shallowRef } from 'vue'
import { OrderbookConfig } from '~/components/preferences/useOrderbookPresetsStore'
import OrderbookSidebysideWithForm from '~/components/trading/orderbook-sidebyside-with-form.vue'
import { v4 as uuid4 } from 'uuid'

const useOrderbookList = () => {
  const orderbookList = ref<
    {
      component: typeof OrderbookSidebysideWithForm
      key: string
      props?: OrderbookConfig
    }[]
  >([])

  const orderbookConfigs = ref<OrderbookConfig[]>([
    { exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC' },
    { exchangeId: 'binancecoinm', symbol: 'BTC/USD:BTC-230630' },
    { exchangeId: 'binanceusdm', symbol: 'ETH/USDT:USDT' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH' },
    { exchangeId: 'binancecoinm', symbol: 'ETH/USD:ETH-230630' },
  ])

  const addOrderbook = (config?: OrderbookConfig) => {
    orderbookList.value.push({ component: OrderbookSidebysideWithForm, key: uuid4(), props: config })
  }

  const deleteOrderbook = (key: string) => {
    orderbookList.value = orderbookList.value.filter(item => item.key !== key)
  }

  return {
    orderbookList,
    addOrderbook,
    deleteOrderbook,
  }
}

export default useOrderbookList
