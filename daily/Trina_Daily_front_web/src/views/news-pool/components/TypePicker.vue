<template>
  <div class="type-picker">
    <a-button
      v-for="item in newsTypeOptions"
      :key="item.value"
      :type="value === item.value ? 'link' : 'text'"
      class="type-item"
      @click="() => (newsType = item.value)"
    >
      {{ item.label }}({{ item.count }})
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRef } from 'vue'
import { useVModel } from '@vueuse/core'
import { useNewsStore } from '@/stores/news-store'
const newsStore = useNewsStore()
const props = withDefaults(
  defineProps<{
    value: number | undefined
    stats: object
  }>(),
  {
    value: -1,
    stats: () => ({}),
  }
)
// defineEmits<{
//   (e: 'update:value', value: string): void
// }>()
const newsType = useVModel(props, 'value')

const stats = toRef(props, 'stats')

const newsTypeOptions = computed(() => {
  const newsCats = [{ label: '全部', value: -1, key: 'all', count: 0 }, ...newsStore.newsCatagory]
  const sum = newsCats.reduce((current, next) => {
    next.count = stats.value[next.key] || 0
    return (current += next.count)
  }, 0)
  newsCats[0].count = sum
  return newsCats
})
</script>
<style lang="less" scoped>
.type-picker {
  display: flex;
  user-select: none;
  flex-wrap: wrap;

  .type-item {
    padding-left: 8px;
  }
  &:deep(.ant-btn-link) {
    color: #008bd6;
    font-weight: bold;
  }

  &:deep(.ant-btn-text:hover) {
    color: #28a5de;
    background: none;
  }
}
</style>
