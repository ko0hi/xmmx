import { Ref } from 'vue'
import { toRef } from '@vueuse/shared'
export const castToRef = <T>(value: T | Ref<T>): Ref<T> => (isRef(value) ? value : toRef(value))
