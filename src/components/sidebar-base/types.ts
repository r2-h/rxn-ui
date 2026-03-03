import type { CSSProperties, Component } from 'vue'

export type SidebarProps = {
  maxWidth?: number
  currentWidth?: number
  withResize?: boolean
  defaultExpandButton?: DefaultSidebarBtnProps
  defaultHideButton?: DefaultSidebarBtnProps
  side?: 'left' | 'right'
} & SidebarButtonProps

export type DefaultSidebarBtnProps = {
  class?: string
  style?: CSSProperties
  show?: boolean
  icon?: Component
}

export type SidebarEmits = SidebarButtonEmit & {
  (evt: 'update:currentWidth', currentWidth: number): void
}

export type SidebarButtonProps = {
  isExpanded: boolean
}
export type SidebarButtonEmit = (evt: 'update:isExpanded', isExpanded: boolean) => void
