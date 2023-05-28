import { ref } from 'vue'
import useOrderbookPresetsStore, { OrderbookConfig } from '~/components/preferences/useOrderbookPresetsStore'
import OrderbookSidebysideWithForm from '~/components/trading/orderbook-sidebyside-with-form.vue'
import { v4 as uuid4 } from 'uuid'
import { storeToRefs } from 'pinia'

const useOrderbookList = () => {
  const { orderbookPresets } = storeToRefs(useOrderbookPresetsStore())
  const { getPreset, hasPreset, setPreset } = useOrderbookPresetsStore()

  const orderbookList = ref<
    {
      component: typeof OrderbookSidebysideWithForm
      key: string
      props: OrderbookConfig
    }[]
  >([])

  const resetOrderbookList = () => (orderbookList.value = [])

  const addOrderbook = (config: OrderbookConfig = { exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' }) => {
    orderbookList.value.push({ component: OrderbookSidebysideWithForm, key: uuid4(), props: config })
  }

  const deleteOrderbook = (key: string) => {
    orderbookList.value = orderbookList.value.filter(item => item.key !== key)
  }

  const saveCurrentList = (name?: string) => {
    setPreset(
      typeof name == 'string' ? name : uuid4(),
      orderbookList.value.map(item => item.props)
    )

    console.log(orderbookPresets)
  }

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
    saveCurrentList,
    initWithPreset,
  }
}

export default useOrderbookList
