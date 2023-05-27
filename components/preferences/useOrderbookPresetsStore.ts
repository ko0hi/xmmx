import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export type OrderbookConfig = { exchangeId: string; symbol: string }

const useOrderbookPresetsStore = defineStore(
  'orderbookPresetsStore',
  () => {
    const orderbookPresets = ref<Record<string, OrderbookConfig[]>>({})

    const getPreset = (key: string) => orderbookPresets.value[key]
    const setPreset = (key: string, config: OrderbookConfig[]) => (orderbookPresets.value[key] = config)
    const popPreset = (key: string) => delete orderbookPresets.value[key]
    const hasPreset = (key: string) => orderbookPresets.value.hasOwnProperty(key)
    const editPresetKey = (oldKey: string, newKey: string) => {
      setPreset(newKey, orderbookPresets.value[oldKey])
      popPreset(oldKey)
    }

    return { orderbookPresets: readonly(orderbookPresets), getPreset, setPreset, popPreset, hasPreset, editPresetKey }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)

export default useOrderbookPresetsStore
