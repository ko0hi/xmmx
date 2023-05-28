import { ref } from 'vue'
import useOrderbookPresetsStore, { OrderbookConfig } from '~/components/preferences/useOrderbookPresetsStore'
import FormedOrderbook from '~/components/trading/formed-orderbook.vue'
import { v4 as uuid4 } from 'uuid'
import { storeToRefs } from 'pinia'

const useOrderbookList = () => {
  const { orderbookPresets } = storeToRefs(useOrderbookPresetsStore())
  const { getPreset, hasPreset, setPreset } = useOrderbookPresetsStore()

  const orderbookList = ref<
    {
      component: typeof FormedOrderbook
      key: string
      props: OrderbookConfig
    }[]
  >([])

  const resetOrderbookList = () => (orderbookList.value = [])

  const addOrderbook = (config: OrderbookConfig = { exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' }) => {
    console.log(config)
    orderbookList.value.push({ component: FormedOrderbook, key: uuid4(), props: config })
    console.log(orderbookList.value)
  }

  const deleteOrderbook = (key: string) => {
    orderbookList.value = orderbookList.value.filter(item => item.key !== key)
  }

  const deleteAllOrderbooks = () => {
    orderbookList.value = orderbookList.value.slice(0, 1)
  }

  const saveCurrentList = (name?: string) =>
    setPreset(
      typeof name == 'string' ? name : uuid4(),
      orderbookList.value.map(item => item.props)
    )

  const initWithPreset = (key: string) => {
    if (hasPreset(key)) {
      resetOrderbookList()
      getPreset(key)?.map(addOrderbook)
    } else {
      console.error(`No preset with key ${key} found: ${orderbookPresets}`)
    }
  }

  return {
    orderbookList,
    addOrderbook,
    deleteOrderbook,
    deleteAllOrderbooks,
    saveCurrentList,
    initWithPreset,
  }
}

export default useOrderbookList
