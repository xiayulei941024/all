<template>
  <div class="slide-btns">
    <template v-for="(item, index) in showActionBtns.slice(0, showActionBtns.length < 4 ? 3 : 2)" :key="index">
      <a-popconfirm v-if="item.confirm" :title="item.confirmText" @confirm="item.event?.(props.record)">
        <a href="javascript:" v-bind="item.btnAttrs">
          <slot :name="item.iconSlotName"></slot>
          {{ item.text }}
        </a>
      </a-popconfirm>
      <a v-else href="javascript:" v-bind="item.btnAttrs" @click="item.event?.(props.record)">
        <slot :name="item.iconSlotName"></slot>
        {{ item.text }}
      </a>
    </template>

    <a-dropdown v-if="showActionBtns.length > 3" :trigger="['click']">
      <a class="ant-dropdown-link" @click.prevent>···</a>
      <template #overlay>
        <a-menu>
          <template v-for="(item, index) in showActionBtns.slice(2)" :key="index">
            <a-menu-item>
              <a href="javascript:" v-bind="item.btnAttrs" @click="handleActionClick(item)">
                <slot :name="item.iconSlotName"></slot>
                {{ item.text }}
              </a>
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { Modal } from 'ant-design-vue'

import { useAuthorize } from '@/hooks/permission'
import type { ActionBtnType } from './types'

defineOptions({
  name: 'TableOperateButton',
})

// 定义 props
const props = defineProps<{ actionBtns: ActionBtnType[]; record: any }>()
// 鉴权方法
const { hasPermission } = useAuthorize()

const showActionBtns = computed(() => {
  return props.actionBtns.filter(
    item => (!item.permissions || hasPermission(...item.permissions)) && (!item.show || item.show(props.record))
  )
})

// 处理点击事件
const handleActionClick = (item: ActionBtnType) => {
  if (item.confirm) {
    Modal.confirm({
      title: item.confirmText,
      onOk: () => {
        item.event?.(props.record)
      },
    })
  } else {
    item.event?.(props.record)
  }
}
</script>

<style scoped lang="less">
.slide-btns {
  a + a {
    margin-left: 16px;
  }
}
</style>
