<template>
  <div :style="style" class="multi-line-ellipsis">
    <slot>{{ props.text }}</slot>
    <span class="show-more" :style="{ background: bgColor }">
      <span class="color-primary" @click.stop="spread">
        {{ isSpread ? '收起' : '展开' }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'MultiLineEllipsis' })
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  lines: {
    type: Number,
    default: 2, // 默认显示两行
  },
  bgColor: {
    type: String,
    default: '#f5f6f5',
  },
  style: {
    type: Object,
    default() {
      return {}
    },
  },
})
const isSpread = ref(false)
const spread = () => {
  isSpread.value = !isSpread.value
}
const style = computed(() => {
  return isSpread.value ? { ...props.style } : { ...props.style, '-webkit-line-clamp': props.lines }
})
</script>

<style scoped>
.multi-line-ellipsis {
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.show-more {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #f5f6f5;
  cursor: pointer;
}
</style>
