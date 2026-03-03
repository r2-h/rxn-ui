<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

import SidebarButton from './SidebarButton.vue'
import type { DefaultSidebarBtnProps, SidebarEmits, SidebarProps } from './types'

const MIN_WIDTH = 120

const {
  side = 'left',
  maxWidth = 480,
  currentWidth = 220,
  withResize = false,
  isExpanded,
  ...restProps
} = defineProps<SidebarProps>()
const defaultExpandButton = computed<DefaultSidebarBtnProps>(() => ({
  show: true,
  ...restProps.defaultExpandButton,
}))
const defaultHideButton = computed<DefaultSidebarBtnProps>(() => ({
  show: true,
  ...restProps.defaultHideButton,
}))

const emit = defineEmits<SidebarEmits>()

const isResizing = ref(false)
let animationFrameId: number | null = null

function startResizing() {
  isResizing.value = true

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopResizing)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
function onMouseMove(e: MouseEvent) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  animationFrameId = requestAnimationFrame(() => {
    const newWidth = side === 'left' ? e.clientX : window.innerWidth - e.clientX
    if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
      emit('update:currentWidth', newWidth)
    }
  })
}
function stopResizing() {
  isResizing.value = false

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopResizing)

  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onBeforeUnmount(() => {
  if (withResize) stopResizing()
})
</script>

<template>
  <aside
    :class="['sidebar', side, { resizing: isResizing }, $attrs.class]"
    :style="Object.assign({ width: isExpanded ? `${currentWidth}px` : `0px` }, $attrs.style)"
  >
    <SidebarButton
      v-if="defaultExpandButton.show"
      :class="['expand-button', side]"
      :isExpanded
      :style="defaultExpandButton.style"
      @update:isExpanded="emit('update:isExpanded', $event)"
    />

    <slot />
    <div v-if="withResize && isExpanded" class="resize-handle" @mousedown.prevent="startResizing" />
  </aside>
  <SidebarButton
    v-if="defaultHideButton.show"
    :class="['hide-button', side]"
    :style="defaultHideButton.style"
    :isExpanded
    @update:isExpanded="emit('update:isExpanded', $event)"
  />
</template>

<style scoped>
.sidebar {
  --sidebar-background: light-dark(
    oklch(from var(--background) calc(l * 0.98) c h),
    oklch(from var(--background) calc(l * 1.1) c h)
  );
  --hover-background: light-dark(var(--color-zinc-300), var(--color-zinc-800));
  --surface: var(--sidebar-background);

  position: fixed;
  top: 0;
  height: stretch;
  z-index: 2;
  overflow: hidden;
  container: sidebar / inline-size;
  color: var(--foreground);
  background-color: var(--sidebar-background);
  will-change: width; /* Подсказка браузеру для оптимизации */
  transition: width 0.2s ease;
  &.resizing {
    transition: none;
  }
  &:deep(.shrink-btn) {
    opacity: 0;
  }
  &:hover {
    &:deep(.shrink-btn) {
      opacity: 1;
    }
    .resize-handle {
      background-color: var(--hover-background);
    }
  }
  &:has(.resize-handle:active) {
    .shrink-btn {
      opacity: 1;
    }
  }
}
.sidebar.left {
  left: 0;
  & .resize-handle {
    right: 0;
  }
}
.sidebar.right {
  right: 0;
  & .resize-handle {
    left: 0;
  }
}
@container sidebar (width <= 4.5rem) {
  :deep(.shrink-btn) {
    display: none;
  }
}
.resize-handle {
  position: absolute;
  top: 0;
  width: 0.5rem;
  height: 100%;
  cursor: col-resize;
  transition: background-color 150ms ease-in-out;
  &:active {
    background-color: var(--hover-background);
  }
}
.expand-button.left {
  right: 1rem;
}
.expand-button.right {
  left: 1rem;
  transform: rotate(180deg);
}
.hide-button.left {
  left: 1rem;
  transform: rotate(180deg);
}
.hide-button.right {
  right: 1rem;
}
</style>
