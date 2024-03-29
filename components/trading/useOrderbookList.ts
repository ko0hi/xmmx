import { reactive, Ref, ref } from 'vue'
import useOrderbookPresetsStore, { OrderbookConfig } from '~/components/preferences/useOrderbookPresetsStore'
import FormedOrderbook from '~/components/trading/formed-orderbook.vue'
import { v4 as uuid4 } from 'uuid'

const useOrderbookList = () => {
  const orderbookList = ref<
    {
      component: typeof FormedOrderbook
      key: string
      config: Ref<OrderbookConfig>
    }[]
  >([])

  const resetOrderbookList = () => (orderbookList.value = [])

  const addOrderbook = (config: OrderbookConfig = { exchangeId: 'binanceusdm', symbol: 'BTC/USDT:USDT' }) => {
    orderbookList.value.push({
      component: FormedOrderbook,
      key: uuid4(),
      config: reactive(config),
    })
  }

  const deleteOrderbook = (key: string) => {
    orderbookList.value = orderbookList.value.filter(item => item.key !== key)
  }

  const deleteAllOrderbooks = () => {
    orderbookList.value = orderbookList.value.slice(0, 1)
  }

  const reloadAllOrderbooks = () => {
    const tmp = orderbookList.value
    resetOrderbookList()
    tmp.map(item => addOrderbook(item.config))
  }

  const saveCurrentList = (name?: string) => {
    const { setPreset } = useOrderbookPresetsStore()
    const configToSave = orderbookList.value.map(item => item.config)
    console.log(`Saving current list as ${name}`, configToSave)
    setPreset(typeof name == 'string' ? name : uuid4(), configToSave)
  }

  const initWithPreset = (key: string) => {
    const { orderbookPresets, getPreset, hasPreset } = useOrderbookPresetsStore()
    if (hasPreset(key)) {
      resetOrderbookList()
      const preset = getPreset(key)
      if (preset) {
        console.log(`Initialize orderbook list with ${key}`, preset)
        preset.map(addOrderbook)
      }
    } else {
      console.error(`No preset with key ${key} found: ${orderbookPresets}`)
    }
  }

  return {
    orderbookList,
    addOrderbook,
    deleteOrderbook,
    deleteAllOrderbooks,
    reloadAllOrderbooks,
    saveCurrentList,
    initWithPreset,
  }
}

export default useOrderbookList
