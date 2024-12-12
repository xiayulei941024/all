<template>
  <a-tooltip :title="props.text">
    <template #title>
      <div v-html="props.text"></div>
    </template>
    <div :style="{ '-webkit-line-clamp': props.lines }" class="multi-line-ellipsis">
      <slot>{{ props.text }}</slot>
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MultiLineEllipsis',
})

// 定义 props
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  lines: {
    type: Number,
    default: 2, // 默认显示两行
  },
})
</script>

<style scoped>
.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
