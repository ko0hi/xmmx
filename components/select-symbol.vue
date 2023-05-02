<script setup lang="ts">
import useMarkets from '~/composables/useMarkets'
import { computed, onMounted, Ref, ref } from 'vue'

const { initMarket, getAvailableSymbols } = useMarkets()

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
  availableSymbols.value = getAvailableSymbols(props.exchangeId)
})
</script>

<template>
  <div v-if="availableSymbols">
    <el-select v-model="selected" filterable>
      <el-option v-for="item in availableSymbols" :key="item" :label="item" :value="item">{{ item }}</el-option>
    </el-select>
  </div>
</template>
