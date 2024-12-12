<template>
  <a-tag :color="conf.color" :style="customStyle">
    {{ conf.label }}
  </a-tag>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useNewsStore } from '@/stores/news-store'
const props = defineProps<{ cat: number | string }>()
const newsStore = useNewsStore()
const conf = computed(() => {
  const ret = newsStore.newsCatagory.find(it => it.value === props.cat)
  return ret ? ret : { color: '#ccc', label: `cat missing ${props.cat}` }
})
const customStyle = {
  height: '22px',
  display: 'inline-flex',
}
</script>
<style lang="less" scoped></style>
