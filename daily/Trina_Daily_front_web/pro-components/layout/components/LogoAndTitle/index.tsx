import type { VueNodeOrRender } from '#/types'
import type { Slots } from 'vue'
import type { MenuHeaderRender } from '../../renderTypes'
import { getVueNode, getRender } from '../../utils'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import './index.less'

export const defaultRenderLogo = (logo: VueNodeOrRender | (() => VueNodeOrRender)): VueNodeOrRender => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />
  }
  if (typeof logo === 'function') {
    return logo()
  }
  return logo
}

export const defaultRenderLogoAndTitle = (
  props: SiderMenuProps,
  slots: Slots,
  renderKey = 'menuHeaderRender'
): VueNodeOrRender => {
  if (props.layout === 'mix' && renderKey === 'menuHeaderRender') {
    return null
  }

  const renderFunction = getRender<MenuHeaderRender>(props, slots, renderKey)
  if (renderFunction === false) {
    return null
  }

  const logRender = getRender<VueNodeOrRender>(props, slots, 'logo')
  const logoDom = defaultRenderLogo(logRender)

  const titleRender = getVueNode(props.title, slots.title)
  const titleDom = (
    <h1 style={{ marginBottom: 0, fontSize: '14px', whiteSpace: 'nowrap' }}>{titleRender ?? 'Ball Cat'}</h1>
  )

  if (renderFunction) {
    // when collapsed, no render title
    return renderFunction(props, logoDom, props.collapsed ? null : titleDom)
  }

  return (
    <a style={{ display: 'flex', alignItems: 'center' }}>
      {logoDom}
      <span style={{ color: '#f0f0f0', margin: '0 16px' }}>|</span>
      {props.collapsed ? null : titleDom}
    </a>
  )
}
