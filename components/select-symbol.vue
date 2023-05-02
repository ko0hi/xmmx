<script setup lang="ts">
import useMarkets from '~/composables/useMarkets'
import { computed, onMounted, Ref, ref } from 'vue'

const { initMarket, listAvailableMarkets } = useMarkets()

const props = defineProps<{ modelValue: Ref; exchangeId: string; exchangeOptions?: object }>()

const availableSymbols = ref<string[]>([])
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const selected = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  },
})
onMounted(async () => {
  await initMarket(props.exchangeId, props.exchangeOptions)
  availableSymbols.value = listAvailableMarkets(props.exchangeId)
})

const options = computed(() => availableSymbols.value.map(item => ({ label: item, value: item })))
</script>

<template>
  <div v-if="availableSymbols">
    <n-select v-model="selected" :options="options" filterable> </n-select>
  </div>
</template>
