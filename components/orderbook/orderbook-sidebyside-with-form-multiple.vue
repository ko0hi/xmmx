<script setup lang="ts">
import { OrderbookSidebysideWithForm } from '#components'

const orderbookComponent = shallowRef(OrderbookSidebysideWithForm)
const orderbookList = ref([])

const addOrderbook = () => {
  orderbookList.value.push({ component: orderbookComponent, key: new Date().getTime() })
}

const onDeleteButtonClick = key => {
  orderbookList.value = orderbookList.value.filter(item => item.key !== key)
}

onMounted(() => addOrderbook())
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-5">
      <div v-for="orderbook in orderbookList" :key="orderbook.key">
        <div class="flex justify-end m-0 p-0">
          <n-button quaternary circle size="small" @click="onDeleteButtonClick(orderbook.key)">
            <span class="text-xs">✖</span>
          </n-button>
        </div>
        <component :is="orderbook.component" class="-mt-1" />
      </div>
      <div class="flex m-5 w-48 h-64 items-center justify-center">
        <n-button circle @click="addOrderbook">+</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
