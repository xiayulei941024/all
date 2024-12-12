<template>
  <div class="pub-list">
    <div>
      <div v-if="loading && pubedlist.length === 0">
        <div class="flex"><a-skeleton-image /><a-skeleton :paragraph="{ rows: 2 }" active /></div>
        <div class="flex"><a-skeleton-image /><a-skeleton :paragraph="{ rows: 2 }" active /></div>
        <div class="flex"><a-skeleton-image /><a-skeleton :paragraph="{ rows: 2 }" active /></div>
      </div>
      <a-spin :spinning="loading && pubedlist.length > 0"><slot :datalist="pubedlist"></slot></a-spin>
    </div>
    <div class="flex justify-end">
      <a-pagination
        v-model:current="current"
        v-model:page-size="pageSize"
        show-size-changer
        :total="total"
        :show-total="total => `共${total}条`"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, toValue } from 'vue'
import debounce from 'lodash.debounce'
const props = defineProps<{ searchState: object; request: (params) => promise }>()
const current = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const pubedlist = ref<array>([])
const loading = ref(false)

const fetchPubedList = reset => {
  const { summary, dateRange } = props.searchState
  const [fromTime, endTime] = dateRange || []
  if (reset) {
    current.value = 1
  }
  const params = {
    current: toValue(current),
    currentSize: toValue(pageSize),
    summary,
    fromTime,
    endTime,
  }
  loading.value = true
  props
    .request(params)
    .then(res => {
      if (res.code === 200) {
        pubedlist.value = res.data.list
        total.value = res.data.total
      }
    })
    .finally(() => {
      loading.value = false
    })
}

watch([current, pageSize], () => fetchPubedList(), { deep: true, immediate: true, flush: 'post' })
watch(
  () => props.searchState.dateRange,
  () => fetchPubedList(true)
)
watch(
  () => props.searchState.summary?.trim(),
  debounce(() => fetchPubedList(true), 300)
)

defineExpose({ reload: fetchPubedList })
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  margin: 16px 0 30px 0;
  &:deep(.ant-skeleton-image) {
    width: 200px;
    height: 80px;
    margin: 12px 12px 0 0;
  }
}

.justify-end {
  justify-content: flex-end;
}

.pub-list {
  max-width: 800px;
  min-height: 300px;
  margin: 0 auto;
}
</style>
