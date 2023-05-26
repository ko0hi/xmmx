<script setup lang="ts">
import useCurrencyIcon from '~/components/trading/useCurrencyIcon'
import useOrderForm from '~/components/trading/useOrderForm'
import useOrderFormDialog from '~/components/trading/useOrderFormDialog'
import { h } from 'vue'

const props = withDefaults(
  defineProps<{
    exchangeId: string
    symbol: string
    side?: 'BUY' | 'SELL'
    type?: 'limit' | 'market' | 'stopLimit' | 'stopMarket'
    price?: number
    size?: number
    disableBuy?: boolean
    disableSell?: boolean
  }>(),
  {
    side: null,
    type: null,
    price: null,
    size: null,
    disableBuy: false,
    disableSell: false,
  }
)

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
  isRequiredFieldsFilled,
  parameters,
  exchangeSelectOptionsForNaiveUi,
  symbolSelectOptionsForNaiveUi,
  tickSize,
  lotSize,
} = useOrderForm({
  exchangeId: props.exchangeId,
  symbol: props.symbol,
  side: props.side,
  type: props.type,
  price: props.price,
  size: props.size,
})

const { openOrderConfirmationDialog } = useOrderFormDialog()

const onSubmit = async (s: string) => {
  side.value = s
  openOrderConfirmationDialog({
    exchangeId: exchangeId.value,
    symbol: symbol.value,
    side: side.value,
    type: type.value,
    size: size.value,
    price: price.value,
    triggerPrice: triggerPrice.value,
    reduceOnly: reduceOnly.value,
    postOnly: postOnly.value,
  })
}
</script>

<template>
  <n-form label-placement="left" label-align="right" label-width="100">
    <slot name="exchange" :config="parameters">
      <n-form-item label="Exchange">
        <n-select v-model:value="exchangeId" :options="exchangeSelectOptionsForNaiveUi" filterable />
      </n-form-item>
    </slot>
    <slot name="symbol" :config="parameters">
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
    <slot name="type" :config="parameters">
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
    <slot name="price" :config="parameters">
      <n-form-item v-if="requiredFields.includes('price')" label="Price">
        <n-input-number v-model:value="price" :step="tickSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="size" :config="parameters">
      <n-form-item v-if="requiredFields.includes('size')" label="Size">
        <n-input-number v-model:value="size" :step="lotSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="triggerPrice" :config="parameters">
      <n-form-item v-if="requiredFields.includes('triggerPrice')" label="Trigger Price">
        <n-input-number v-model:value="triggerPrice" :step="tickSize" :disabled="!symbol && !side" />
      </n-form-item>
    </slot>
    <slot name="reduceOnly" :config="parameters">
      <n-form-item label="Reduce Only">
        <n-checkbox v-model:checked="reduceOnly" />
      </n-form-item>
    </slot>
    <slot name="postOnly" :config="parameters">
      <n-form-item v-if="type === 'limit' || type === 'stopLimit'" label="Post Only">
        <n-checkbox v-model:checked="postOnly" />
      </n-form-item>
    </slot>
    <div class="flex justify-center gap-5">
      <n-button
        class="rounded-md"
        size="large"
        type="success"
        :disabled="!isRequiredFieldsFilled || props.disableBuy"
        :class="props.disableBuy ? 'hidden' : ''"
        @click="onSubmit('buy')"
        >BUY
      </n-button>
      <n-button
        class="rounded-md"
        size="large"
        type="error"
        :disabled="!isRequiredFieldsFilled || props.disableSell"
        :class="props.disableSell ? 'hidden' : ''"
        @click="onSubmit('sell')"
        >SELL
      </n-button>
    </div>
  </n-form>
</template>
