<template>
  <div class="filter-wrapper">
    <a-select v-model:value="filterModel.orderTime" class="news-filter" :bordered="false">
      <template #placeholder><span>时间排序</span></template>
      <a-select-option :value="1">时间升序</a-select-option>
      <a-select-option :value="0">时间降序</a-select-option>
    </a-select>
    <a-select
      v-model:value="filterModel.timeRange"
      class="news-filter"
      :bordered="false"
      @select="value => (modalVisible = value === 'custom')"
    >
      <template #placeholder><span>时间范围</span></template>
      <a-select-option :value="null">全部</a-select-option>
      <a-select-option value="lastweek">上周</a-select-option>
      <a-select-option value="custom">自定义</a-select-option>
    </a-select>
    <a-select v-model:value="filterModel.addMode" class="news-filter" :bordered="false">
      <template #placeholder><span>添加方式</span></template>
      <a-select-option :value="null">全部</a-select-option>
      <a-select-option :value="1">手动添加</a-select-option>
      <a-select-option :value="0">系统生成</a-select-option>
    </a-select>
    <a-select v-model:value="filterModel.isPublished" class="news-filter" :bordered="false">
      <template #placeholder><span>发布状态</span></template>
      <a-select-option :value="null">全部</a-select-option>
      <a-select-option :value="1">已发布</a-select-option>
      <a-select-option :value="0">未发布</a-select-option>
    </a-select>
    <a-modal
      v-model:visible="modalVisible"
      title="自定义时间"
      @ok="setCustomTime"
      @cancel="filterModel.timeRange = undefined"
    >
      <a-range-picker v-model:value="customTime" :disabled-date="disabledDate" />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
type RangeValue = [Dayjs, Dayjs]
const modalVisible = ref<boolean>(false)
const customTime = ref<RangeValue>()

const filterModel = reactive({
  orderTime: 0,
  timeRange: undefined,
  addMode: undefined,
  isPublished: undefined,
})

const setCustomTime = () => {
  filterModel.timeRange = customTime.value?.map(it => it.format('YYYY-MM-DD')).join('~')
  modalVisible.value = false
}

const emits = defineEmits<{
  (e: 'update:value', value: object): void
}>()

const disabledDate = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day')
}

watch(filterModel, value => {
  const data = { ...value }
  const timeRange = data.timeRange
  if (timeRange === 'lastweek') {
    const fromTime = dayjs().subtract(1, 'week').startOf('week')
    const endTime = dayjs().subtract(1, 'week').endOf('week')
    data.fromTime = fromTime.format('YYYY-MM-DD')
    data.endTime = endTime.format('YYYY-MM-DD')
  }

  if (timeRange?.indexOf?.('~') > -1) {
    const [fromTime, endTime] = timeRange.split('~')
    data.fromTime = fromTime
    data.endTime = endTime
  }

  if (timeRange === 'custom') {
    return
  }

  delete data.timeRange

  emits('update:value', data)
})
</script>
<style lang="less" scoped>
.filter-wrapper {
  display: flex;
  user-select: none;
}
.ant-select.news-filter {
  width: auto;
  &:deep(.ant-select-selector) {
    padding-left: 8px;
  }
  &:deep(.ant-select-selection-placeholder) {
    color: rgba(0, 0, 0, 0.85);
  }
  &:deep(.ant-select-selector:hover) {
    .ant-select-selection-placeholder {
      color: #008bd6;
    }
  }
  &:deep(.ant-select-selection-item) {
    color: #008bd6;
    font-weight: bold;
  }
}
</style>
