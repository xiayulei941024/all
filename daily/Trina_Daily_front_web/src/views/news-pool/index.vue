<template>
  <div class="news-page">
    <a-card :bordered="false" class="page-content">
      <!-- 搜索 -->
      <a-form :model="formModel" label-align="left">
        <a-form-item label="新闻内容">
          <a-input
            v-model:value="formModel.abstractReal"
            style="margin-left: 8px; width: 280px"
            placeholder="请输入文章摘要或标题"
          >
            <template #prefix><SearchOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="新闻类型">
          <TypePicker v-model:value="formModel.classReal" :stats="statistics" />
        </a-form-item>

        <a-form-item label="筛选条件">
          <FilterItems v-model:value="formModel.filter" />
        </a-form-item>
      </a-form>

      <a-divider style="margin: 4px 0" />

      <a-button
        v-if="hasPermission('news:pool:add')"
        type="dashed"
        style="margin: 12px 0; color: rgba(0, 0, 0, 0.65)"
        :icon="h(PlusOutlined)"
        block
        @click="() => editRef?.open()"
      >
        手动添加新闻
      </a-button>

      <!-- 新闻列表 -->
      <NewsList ref="newslistRef" :search-state="formModel" :request="fetchNewsList">
        <template #default="{ datalist }">
          <NewsItem
            v-for="x in datalist"
            :key="x.id"
            :data="x"
            @edit="() => editRef.open(x)"
            @update="() => [newslistRef.reload(), fetchReleaseList()]"
            @detail="() => detailRef.open(x)"
          />
        </template>
      </NewsList>

      <!-- 添加新闻 -->
      <NewsEdit
        ref="editRef"
        @update="
          data => {
            newslistRef.reload()
            fetchReleaseList()
            detailRef.update(data)
          }
        "
      />

      <!-- 新闻详情 -->
      <NewsDetail
        ref="detailRef"
        @edit="data => editRef.open(data)"
        @update="
          () => {
            newslistRef.reload()
            fetchReleaseList()
          }
        "
      />
    </a-card>
    <!-- 待发布列表 -->
    <ReleaseList v-if="hasPermission('news:pool:edit')">
      <div v-if="releaselist.length">
        <div v-for="(it, index) in newsCatagory" :key="it.key">
          <p
            v-if="classified[it.value].length"
            class="class-title"
            :style="{
              marginTop: index === 0 ? '8px' : '24px',
              marginBottom: 0,
            }"
          >
            {{ it.label }} ({{ classified[it.value].length }})
          </p>
          <ReleaseItem
            v-for="x in classified[it.value]"
            :key="x.id"
            :data="x"
            brief
            @edit="() => editRef.open(x)"
            @update="() => [newslistRef.reload(), fetchReleaseList()]"
            @detail="() => detailRef.open(x)"
          />
        </div>
      </div>
    </ReleaseList>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import type { NewsPool } from './types'
import { PlusOutlined } from '@ant-design/icons-vue'
import TypePicker from './components/TypePicker.vue'
import FilterItems from './components/FilterItems.vue'
import NewsList from './components/NewsList.vue'
import ReleaseList from './components/ReleaseList.vue'
import ReleaseItem from './components/ReleaseItem.vue'
import NewsEdit from './components/NewsEdit.vue'
import NewsItem from './components/NewsItem.vue'
import NewsDetail from './components/NewsDetail.vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useNewsStore } from '@/stores/news-store'
import { newsListApi, selectAllCountClassRealApi } from '@/api/news'
import { useAuthorize } from '@/hooks/permission'
defineOptions({ name: 'NewsPool' })

const { hasPermission } = useAuthorize()
const newsStore = useNewsStore()
const { fetchReleaseList, newsCatagory } = newsStore
const { classified, releaselist } = storeToRefs(newsStore)
const statistics = ref()
const editRef = ref<InstanceType<typeof NewsEdit>>()
const detailRef = ref<InstanceType<typeof NewsDetail>>()
const newslistRef = ref<InstanceType<typeof NewsList>>()
const formModel = reactive<NewsPool>({
  abstractReal: undefined,
  classReal: undefined,
  filter: {},
})

const fetchNewsList = async params => {
  try {
    const res = await newsListApi(params)
    const statsRes = await selectAllCountClassRealApi({ abstractReal: params.abstractReal })
    statistics.value = statsRes.data
    return res
  } catch (err) {
    return []
  }
}
</script>
<style lang="less" scoped>
.news-page {
  display: flex;
  max-height: calc(100vh - 128px);
  // max-width: 1280px;
  // margin: 0 auto;

  .page-content {
    margin-right: 16px;
    flex: 1;
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
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .class-title {
    margin-top: 24px;
    color: rgba(0, 0, 0, 0.45);
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
