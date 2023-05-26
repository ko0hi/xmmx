import { computed, ComputedRef, readonly, Ref, watch } from 'vue'
import { castToRef } from '~/utils/vue/cast'
import createClient from '~/utils/ccxt'
import CcxtClient from '~/utils/ccxt/ccxtClient'
import useMarkets from '~/components/trading/useMarkets'
import { Market } from '~/utils/ccxt/types'

const useCcxtClient = (
  exchangeId: string | Ref<string>
): {
  client: ComputedRef<CcxtClient>
  exchangeIdRef: Readonly<Ref<string>>
  findMarket: (symbol: string) => Market | null
  getLotSize: (symbol: string) => number | null
  getTickSize: (symbol: string) => number | null
  listAvailableMarkets: () => string[]
} => {
  const exchangeIdRef = castToRef(exchangeId)

  const { initMarket, findMarket, listAvailableMarkets, getTickSize, getLotSize } = useMarkets()

  const client = computed(() => createClient(exchangeIdRef.value))

  // exchangeが変更されるたびに参照market情報を追加する。
  watch(
    [exchangeIdRef],
    async () => {
      if (exchangeIdRef.value) {
        await initMarket(exchangeIdRef.value)
      }
    },
    { immediate: true }
  )

  return {
    client,
    exchangeIdRef: readonly(exchangeIdRef),
    findMarket: (symbol: string) => findMarket(exchangeIdRef.value, symbol),
    getLotSize: (symbol: string) => getLotSize(exchangeIdRef.value, symbol),
    getTickSize: (symbol: string) => getTickSize(exchangeIdRef.value, symbol),
    listAvailableMarkets: () => listAvailableMarkets(exchangeIdRef.value),
  }
}

export default useCcxtClient
