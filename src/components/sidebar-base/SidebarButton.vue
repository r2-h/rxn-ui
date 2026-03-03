<script setup lang="ts">
import ChevronDoubleIcon from '@/assets/ChevronDoubleIcon.vue'

import ButtonBase from '../button-base/ButtonBase.vue'
import type { SidebarButtonEmit, SidebarButtonProps } from './types'

const { isExpanded } = defineProps<SidebarButtonProps>()
const emit = defineEmits<SidebarButtonEmit>()

function toggleSidebar() {
  emit('update:isExpanded', !isExpanded)
}
</script>

<template>
  <ButtonBase
    variant="ghost"
    shape="shape-icon"
    :class="['shrink-btn', { 'is-expanded': isExpanded }]"
    @click="toggleSidebar"
  >
    <ChevronDoubleIcon />
  </ButtonBase>
</template>

<style scoped>
.shrink-btn {
  position: absolute;
  z-index: 1;
  top: 1.2rem;
  background-color: inherit;
  transition: opacity 150ms ease-in-out;
  & svg {
    stroke-width: 2px;
  }
}

.shrink-btn.is-expanded {
  &:hover:not(:disabled) {
    background-color: var(--hover-background);
  }
}
</style>
