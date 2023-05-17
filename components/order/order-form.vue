<script setup lang="ts">
import useCurrencyIcon from '~/composables/useCurrencyIcon'
import useOrderForm from '~/composables/useOrderForm'

const props = defineProps<{ exchangeId: string; symbol?: string; side?: 'BUY' | 'SELL' }>()

const {
  exchangeId,
  symbol,
  side,
  type,
  size,
  price,
  triggerPrice,
  reduceOnly,
  postOnly,
  requiredFields,
  exchangeSelectOptionsForNaiveUi,
  symbolSelectOptionsForNaiveUi,
  tickSize,
  lotSize,
} = useOrderForm()

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

onBeforeMount(() => {
  exchangeId.value = props.exchangeId

  if (props.symbol) {
    symbol.value = props.symbol
  }
  if (props.side) {
    side.value = props.side
  }
})

const onSubmit = async (s: string) => {
  side.value = s

  const { client } = useCcxtClient(exchangeId)

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
    <slot name="exchange" :config="slotArgs">
      <n-form-item label="Exchange">
        <n-select v-model:value="exchangeId" :options="exchangeSelectOptionsForNaiveUi" filterable />
      </n-form-item>
    </slot>
    <slot name="symbol" :config="slotArgs">
      <n-form-item label="Symbol">
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
      </n-form-item>
    </slot>
    <slot name="type" :config="slotArgs">
      <n-form-item label="Type">
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
      </n-form-item>
    </slot>
    <slot name="price" :config="slotArgs">
      <n-form-item v-if="requiredFields.includes('price')" label="Price">
        <n-input-number v-model:value="price" :step="tickSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="size" :config="slotArgs">
      <n-form-item v-if="requiredFields.includes('size')" label="Size">
        <n-input-number v-model:value="size" :step="lotSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="triggerPrice" :config="slotArgs">
      <n-form-item v-if="requiredFields.includes('triggerPrice')" label="Trigger Price">
        <n-input-number v-model:value="triggerPrice" :step="tickSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="reduceOnly" :config="slotArgs">
      <n-form-item label="Reduce Only">
        <n-checkbox v-model:checked="reduceOnly" />
      </n-form-item>
    </slot>
    <slot name="postOnly" :config="slotArgs">
      <n-form-item v-if="type === 'limit' || type === 'stopLimit'" label="Post Only">
        <n-checkbox v-model:checked="postOnly" />
      </n-form-item>
    </slot>
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
