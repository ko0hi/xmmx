<script setup lang="ts">
const config = ref()
</script>

<template>
  <div class="flex">
    <orderbook-sidebyside-with-form v-model="config" />
  </div>
</template>

<style scoped></style>
