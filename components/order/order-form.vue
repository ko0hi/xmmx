<script setup lang="ts">
import useAvailableExchanges from '~/composables/useAvailableExchanges'
import { ref } from 'vue'
import useAvailableSymbols from '~/composables/useAvailableSymbols'
import useCurrencyIcon from '~/composables/useCurrencyIcon'

const props = defineProps<{ exchangeId: string; symbol?: string; side?: 'BUY' | 'SELL' }>()

const exchangeId = ref(props.exchangeId)
const symbol = ref(props.symbol)
const side = ref(props.side)
const type = ref()
const size = ref()
const price = ref()
const triggerPrice = ref()
const reduceOnly = ref(false)
const postOnly = ref(false)

const slotArgs = computed(() => ({
  exchange: exchangeId.value,
  symbol: symbol.value,
  side: side.value,
  type: type.value,
  size: size.value,
  price: price.value,
  triggerPrice: triggerPrice.value,
  reduceOnly: reduceOnly.value,
  postOnly: postOnly.value,
}))

const { exchangeSelectOptionsForNaiveUi } = useAvailableExchanges()
const { symbolSelectOptionsForNaiveUi } = useAvailableSymbols(exchangeId)
const { client, getTickSize, getLotSize } = useCcxtClient(exchangeId)

const onSubmit = async (s: string) => {
  side.value = s

  await client.value.order({
    symbol: symbol.value,
    type: type.value,
    side: side.value,
    amount: size.value,
    price: price.value,
    triggerPrice: triggerPrice.value,
    reduceOnly: reduceOnly.value,
    postOnly: postOnly.value,
  })
}
</script>

<template>
  <n-form label-placement="left" label-align="right">
    <n-form-item label="exchange">
      <slot name="exchange" :config="slotArgs">
        <n-select v-model:value="exchangeId" :options="exchangeSelectOptionsForNaiveUi" filterable />
      </slot>
    </n-form-item>
    <n-form-item label="symbol">
      <slot name="symbol" :config="slotArgs">
        <n-select
          v-model:value="symbol"
          :options="symbolSelectOptionsForNaiveUi"
          :render-label="
            option =>
              h('div', { class: 'flex items-center gap-2' }, [
                h('img', { src: useCurrencyIcon(option.label).iconPath, class: 'w-3' }),
                h('span', {}, option.label),
              ])
          "
          filterable
        />
      </slot>
    </n-form-item>
    <n-form-item label="Type">
      <slot name="type" :config="slotArgs">
        <n-select
          v-model:value="type"
          :options="[
            { label: 'Limit', value: 'limit' },
            { label: 'Market', value: 'market' },
            { label: 'StopLimit', value: 'stopLimit' },
            { label: 'StopMarket', value: 'stopMarket' },
          ]"
          filterable
        />
      </slot>
    </n-form-item>
    <n-form-item label="Price">
      <slot name="price" :config="slotArgs">
        <n-input-number v-model:value="price" :step="getTickSize(symbol)" :disabled="!symbol && !side" />
      </slot>
    </n-form-item>
    <n-form-item label="Size">
      <slot name="size" :config="slotArgs">
        <n-input-number v-model:value="size" :step="getLotSize(symbol)" :disabled="!symbol && !side" />
      </slot>
    </n-form-item>
    <n-form-item label="Trigger Price">
      <slot name="triggerPrice" :config="slotArgs">
        <n-input-number v-model:value="triggerPrice" :step="getTickSize(symbol)" :disabled="!symbol && !side" />
      </slot>
    </n-form-item>
    <n-form-item label="Reduce Only">
      <slot name="reduceOnly" :config="slotArgs">
        <n-checkbox v-model:checked="reduceOnly" />
      </slot>
    </n-form-item>
    <n-form-item label="Post Only">
      <slot name="postOnly" :config="slotArgs">
        <n-checkbox v-model:checked="postOnly" />
      </slot>
    </n-form-item>
  </n-form>
  <div class="flex m-5">
    <n-button class="rounded-md w-16 side-button-buy" type="success" @click="onSubmit('buy')">BUY </n-button>
    <n-button class="rounded-md w-16 side-button-sell" type="error" @click="onSubmit('sell')">SELL </n-button>
  </div>
</template>

<style lang="scss">
button.n-button.n-button--success-type.n-button--medium-type.side-button-buy {
  background-color: #18a058;
}

button.n-button.n-button--error-type.n-button--medium-type.side-button-sell {
  background-color: #d03050;
}
</style>
