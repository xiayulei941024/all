export interface ActionBtnType {
  text: string // 按钮文本
  confirm?: boolean // 是否需要确认
  confirmText?: string // 确认文本
  iconSlotName?: string // 按钮图标slot name
  btnAttrs?: Record<string, any> // 按钮属性
  permissions?: string[] // 权限标识
  show?: (record: any) => boolean // 按钮显示条件
  event?: (record: any) => void // 按钮点击事件
}
