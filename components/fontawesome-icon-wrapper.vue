<template>
  <font-awesome-icon :icon="props.icon" />
</template>

<script lang="ts" setup>
const props = defineProps<{ icon: string }>()
</script>
