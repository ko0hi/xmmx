import { ComputedRef, Ref } from 'vue'
import { castToRef } from '~/utils/vue/cast'
import createClient from '~/utils/ccxt'
import CcxtClient from '~/utils/ccxt/ccxtClient'
import useMarkets from '~/composables/useMarkets'
import { Market } from 'ccxt'

const useCcxtClient = (
  exchangeId: string | ComputedRef<string>,
  exchangeOptions: object | ComputedRef<object> = {}
): {
  exchangeIdRef: Readonly<Ref<string>>
  exchangeOptionsRef: Readonly<Ref<object>>
  client: ComputedRef<CcxtClient>
  findMarket: (symbol: string) => Market | null
  listAvailableMarkets: () => string[]
  getTickSize: (symbol: string) => number | null
} => {
  const exchangeIdRef = castToRef(exchangeId)
  const exchangeOptionsRef = castToRef(exchangeOptions)

  const { initMarket, findMarket, listAvailableMarkets, getTickSize } = useMarkets()

  const client = computed(() => createClient(exchangeIdRef.value, exchangeOptionsRef.value))

  onMounted(async () => {
    await initMarket(exchangeIdRef.value, exchangeOptionsRef.value)
  })

  // exchangeが変更されるたびに参照market情報を追加する。
  watch(
    [exchangeIdRef, exchangeOptionsRef],
    async () => {
      await initMarket(exchangeIdRef.value, exchangeOptionsRef.value)
    },
    { immediate: true }
  )

  return {
    exchangeIdRef: readonly(exchangeIdRef),
    exchangeOptionsRef: readonly(exchangeOptionsRef),
    client,
    findMarket: (symbol: string) => findMarket(exchangeIdRef.value, symbol),
    listAvailableMarkets: () => listAvailableMarkets(exchangeIdRef.value),
    getTickSize: (symbol: string) => getTickSize(exchangeIdRef.value, symbol),
  }
}

export default useCcxtClient
