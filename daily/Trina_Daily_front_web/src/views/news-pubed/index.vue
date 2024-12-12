<template>
  <div class="pubed-page">
    <a-card :bordered="false" class="card-content">
      <template #title>
        <div class="flex">
          <span class="pubed-title">共发布 {{ total }} 期</span>
          <div class="flex">
            <a-range-picker v-model:value="formModel.dateRange" class="field-item" value-format="YYYY-MM-DD" />
            <a-input v-model:value="formModel.summary" class="field-item" placeholder="请输入文章摘要或标题" />
          </div>
        </div>
      </template>
      <!-- 新闻列表 -->
      <PubList ref="pubedList" :search-state="formModel" :request="fetchPubList">
        <template #default="{ datalist }">
          <PubItem v-for="x in datalist" :key="x.id" :data="x" @update="() => [pubedList.reload()]" />
        </template>
      </PubList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PubList from './components/PubList.vue'
import PubItem from './components/PubItem.vue'
import { selectPublishApi } from '@/api/news'
defineOptions({ name: 'NewsPubed' })

const pubedList = ref<array>()
const total = ref<number>()

const formModel = reactive({
  dateRange: undefined,
  summary: undefined,
})

const fetchPubList = async params => {
  try {
    const res = await selectPublishApi(params)
    total.value = res.data.total
    return res
  } catch (err) {
    return []
  }
}
</script>
<style lang="less" scoped>
.pubed-page {
  max-height: calc(100vh - 128px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(31, 31, 31, 0.2);
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
  }
  .card-content {
    flex: 1;
  }
  .flex {
    display: flex;
    column-gap: 12px;
  }
  .field-item {
    width: 280px;
  }
  .pubed-title {
    flex: 1;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
