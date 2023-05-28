import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export type OrderbookConfig = { exchangeId: string; symbol: string }

const useOrderbookPresetsStore = defineStore(
  'orderbookPresetsStore',
  () => {
    const orderbookPresets = ref<{ key: string; config: OrderbookConfig[] }[]>([])

    const getPreset = (key: string) => orderbookPresets.value.find(item => item.key === key)?.config
    const setPreset = (key: string, config: OrderbookConfig[]) =>
      orderbookPresets.value.push({ config: config, key: key })
    const popPreset = (key: string) =>
      (orderbookPresets.value = orderbookPresets.value.filter(item => item.key !== key))
    const hasPreset = (key: string) => orderbookPresets.value.findLast(item => item.key === key) !== undefined
    const updateKey = (oldKey: string, newKey: string) => {
      for (let i = 0; i < orderbookPresets.value.length; i++) {
        if (orderbookPresets.value[i].key === oldKey) {
          orderbookPresets.value[i] = {
            key: newKey,
            config: orderbookPresets.value[i].config,
          }
        }
      }
    }

    return { orderbookPresets, getPreset, setPreset, popPreset, hasPreset, updateKey }
  },
  {
    persist: {
      storage: localStorage,
      debug: true,
    },
  }
)

export default useOrderbookPresetsStore
