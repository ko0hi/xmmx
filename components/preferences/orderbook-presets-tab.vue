<script setup lang="ts">
import useOrderbookPresetsStore from '~/components/preferences/useOrderbookPresetsStore'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { OnClickOutside } from '@vueuse/components'

const newPresetNameRef = ref('')
const updatePresetNameRef = ref('')
const editingTabNameRef = ref('')

const { orderbookPresets } = storeToRefs(useOrderbookPresetsStore())
const { updateKey, popPreset } = useOrderbookPresetsStore()

const emits = defineEmits<{
  clickPreset: (value: string) => void
  saveOrderbooks: (value: string) => void
}>()

const resetRefs = () => {
  editingTabNameRef.value = ''
  updatePresetNameRef.value = ''
  newPresetNameRef.value = ''
}
</script>

<template>
  <div class="flex flex-wrap gap-0.5">
    <div
      v-for="preset in orderbookPresets"
      :key="preset.key"
      class="border border-b-0 border-green-600 py-1 px-2 w-32 h-8 rounded-t-md items-center cursor-pointer hover:bg-green-100 text-overflow overflow-hidden"
      @click="editingTabNameRef === '' ? emits('clickPreset', preset.key) : null"
    >
      <!-- presetの名前を変更中 -->
      <OnClickOutside v-if="editingTabNameRef === preset.key" @trigger="resetRefs">
        <input
          v-model="updatePresetNameRef"
          @change="
            () => {
              updateKey(editingTabNameRef, updatePresetNameRef)
              resetRefs()
            }
          "
        />
      </OnClickOutside>
      <!-- preset選択 or preset削除 or preset名変更 -->
      <div v-else class="flex justify-between items-center">
        <p class="font-mono text-sm truncate">
          {{ preset.key }}
        </p>
        <div class="flex gap-1">
          <font-awesome-icon
            class="cursor-pointer text-gray-200 hover:text-gray-500 text-sm"
            :icon="['fas', 'pen']"
            @click="
              () => {
                updatePresetNameRef = preset.key
                editingTabNameRef = preset.key
              }
            "
          />
          <font-awesome-icon
            class="cursor-pointer text-gray-200 hover:text-gray-500 text-sm"
            :icon="['fas', 'floppy-disk']"
            @click="emits('saveOrderbooks', preset.key)"
          />
          <font-awesome-icon
            class="cursor-pointer text-gray-200 hover:text-gray-500 text-sm"
            :icon="['fas', 'trash']"
            @click="popPreset(preset.key)"
          />
        </div>
      </div>
    </div>
    <!-- 現在の状態をpresetに登録 -->
    <div
      class="border border-b-0 border-green-600 py-1 px-2 w-32 h-8 text-center rounded-t-md cursor-pointer hover:bg-green-100 text-overflow overflow-hidden"
    >
      <input
        v-model="newPresetNameRef"
        class="w-full text-center"
        placeholder="register"
        @change="
          () => {
            emits('saveOrderbooks', newPresetNameRef)
            resetRefs()
          }
        "
      />
    </div>
  </div>
</template>
