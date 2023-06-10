import { computed, ComputedRef, readonly, ref, Ref, watch } from 'vue'
import { castToRef } from '~/utils/vue/cast'
import createClient from '~/utils/ccxt'
import CcxtClient from '~/utils/ccxt/ccxtClient'
import useMarkets from '~/composables/useMarkets'
import { Market } from '~/utils/ccxt/types'

const useCcxtClient = (
  exchangeId: string | Ref<string>
): {
  client: ComputedRef<CcxtClient>
  exchangeIdRef: Readonly<Ref<string>>
  isPrivateApiAvailable: Readonly<Ref<boolean>>
  findMarket: (symbol: string) => Market | null
  getLotSize: (symbol: string) => number | null
  getTickSize: (symbol: string) => number | null
  listAvailableMarkets: () => string[]
} => {
  const exchangeIdRef = castToRef(exchangeId)
  const isPrivateApiAvailable = ref(false)

  const { initMarket, findMarket, listAvailableMarkets, getTickSize, getLotSize } = useMarkets()

  const client = computed(() => createClient(exchangeIdRef.value))

  // exchangeが変更されるたびに参照market情報を追加する。
  watch(
    [exchangeIdRef],
    async () => {
      if (exchangeIdRef.value) {
        await initMarket(exchangeIdRef.value)
      }
      isPrivateApiAvailable.value = await client.value.isPrivateApiAvailable()
    },
    { immediate: true }
  )

  return {
    client,
    exchangeIdRef: readonly(exchangeIdRef),
    isPrivateApiAvailable: readonly(isPrivateApiAvailable),
    findMarket: (symbol: string) => findMarket(exchangeIdRef.value, symbol),
    getLotSize: (symbol: string) => getLotSize(exchangeIdRef.value, symbol),
    getTickSize: (symbol: string) => getTickSize(exchangeIdRef.value, symbol),
    listAvailableMarkets: () => listAvailableMarkets(exchangeIdRef.value),
  }
}

export default useCcxtClient
