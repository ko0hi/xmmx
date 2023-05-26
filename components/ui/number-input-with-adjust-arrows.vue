<script setup lang="ts">
defineProps<{ modelValue: number }>()
const emits = defineEmits(['clickDecrement', 'clickIncrement', 'update:modelValue'])
</script>

<template>
  <div class="flex justify-around">
    <button class="n-button flex-none w-1/4" @click="emits('clickDecrement')">↓</button>
    <input :value="modelValue" class="text-center w-1/2" @change="emits('update:modelValue')" />
    <button class="n-button flex-none w-1/4" @click="emits('clickIncrement')">↑</button>
  </div>
</template>

<style scoped></style>
