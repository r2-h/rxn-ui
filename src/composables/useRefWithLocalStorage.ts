import { type MaybeRefOrGetter, isRef, onUnmounted, ref, toValue, watch, watchEffect } from 'vue'

export const useRefWithLocalStorage = <T>(
  key: MaybeRefOrGetter<string>,
  initialValue: MaybeRefOrGetter<T>,
) => {
  const valueFromLC: T =
    JSON.parse(localStorage.getItem(toValue(key)) ?? 'null') ?? toValue(initialValue)

  const value = ref(valueFromLC)

  watchEffect(() => localStorage.setItem(toValue(key), JSON.stringify(value.value)))

  if (isRef(initialValue)) {
    watch(initialValue, (v) => {
      value.value = v
    })
  }

  function storageHandler(event: StorageEvent) {
    if (toValue(key) === event.key) {
      value.value = JSON.parse(event.newValue ?? 'null')
    }
  }
  addEventListener('storage', storageHandler)
  onUnmounted(() => removeEventListener('storage', storageHandler))

  return value
}
