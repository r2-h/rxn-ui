<script setup lang="ts">
import { usePopoverContext } from './context'

const { popoverId } = usePopoverContext()
</script>

<template>
  <button :popovertarget="popoverId" :style="{ anchorName: `--${popoverId}` }">
    <slot />
  </button>
</template>
