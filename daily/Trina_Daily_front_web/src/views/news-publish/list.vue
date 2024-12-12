<template>
  <div class="release-page">
    <NoData>
      <a-card v-if="hasData" class="page-content">
        <div class="card-content">
          <div style="width: 415px">
            <a-steps :current="0"> <a-step title="发布内容" /><a-step title="发布设置" /> </a-steps>
          </div>
          <div class="release-list">
            <a-spin :spinning="loading">
              <div v-for="it in newsCatagory" :key="it.key">
                <p v-if="classified[it.value].length" class="class-title">
                  {{ it.label }} ({{ classified[it.value].length }})
                </p>
                <ReleaseItem
                  v-for="(x, y) in classified[it.value].sort((a, b) => a.orderNews - b.orderNews)"
                  :key="x.id"
                  :data="x"
                  :index="y"
                  @edit="() => editRef.open(x)"
                  @update="fetchReleaseList"
                  @detail="() => detailRef.open(x)"
                >
                  <template v-if="classified[it.value].length > 1" #arrow>
                    <span
                      class="up-arrow"
                      :class="{ disabled: y === 0 }"
                      @click="() => y !== 0 && move(-1, x.id, classified[it.value])"
                    ></span>
                    <span
                      class="down-arrow"
                      :class="{ disabled: y === classified[it.value].length - 1 }"
                      @click="() => y !== classified[it.value].length - 1 && move(1, x.id, classified[it.value])"
                    ></span>
                  </template>
                </ReleaseItem>
              </div>
            </a-spin>
          </div>
          <!-- 添加新闻 -->
          <NewsEdit ref="editRef" @update="data => [fetchReleaseList(), detailRef.update(data)]" />

          <!-- 新闻详情 -->
          <NewsDetail ref="detailRef" @edit="data => editRef.open(data)" @update="fetchReleaseList" />
        </div>
        <template #actions>
          <a-space>
            <!-- <a-button @click="back">取消</a-button> -->
            <a-button @click="goPreview">预览</a-button>
            <a-button type="primary" @click="next">下一步</a-button>
          </a-space>
        </template>
      </a-card>
    </NoData>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NewsEdit from '../news-pool/components/NewsEdit.vue'
import ReleaseItem from '../news-pool/components/ReleaseItem.vue'
import NewsDetail from '../news-pool/components/NewsDetail.vue'
import NoData from './components/NoData.vue'
import { useNewsStore } from '@/stores/news-store'
import { useRouter } from 'vue-router'
defineOptions({ name: 'NewsPublishList' })

const newsStore = useNewsStore()
const router = useRouter()
const { newsCatagory, fetchReleaseList, updateOrder } = newsStore
const { classified } = storeToRefs(newsStore)
const editRef = ref()
const detailRef = ref()
const loading = ref(false)
const hasData = ref(true)
const next = () => {
  router.push({
    path: '/news-publish-setting',
  })
}
const back = () => {
  router.go(-1)
}

const move = (step, id, list) => {
  const idx = list.findIndex(it => it.id === id)
  const [former, latter] = [idx, idx + step].sort()
  const temp = [list[former], list[latter]]
  list[latter] = temp[0]
  list[former] = temp[1]
  const ordered = list.map((it, index) => ({ id: it.id, orderNews: index }))
  updateOrder(ordered)
}

onMounted(() => {
  loading.value = true
  fetchReleaseList()
    .then(list => {
      hasData.value = !!list.length
    })
    .finally(() => {
      loading.value = false
    })
})

const goPreview = () => {
  router.push({ path: '/preview/list' })
}
</script>
<style lang="less" scoped>
.release-page {
  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 128px);
  }
  :deep(.ant-card-body) {
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
}
.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .ant-form-item {
    margin-bottom: 16px;
  }
  .release-list {
    width: 100%;
    max-width: 720px;
  }
  .class-title {
    margin: 24px 0 0;
    color: rgba(0, 0, 0, 0.45);
  }
  .up-arrow,
  .down-arrow {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url('@/assets/circle-arrow.svg');
    background-size: contain;
    opacity: 0.45;

    &.disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
  }
  .down-arrow {
    transform: rotate(180deg);
  }
}
</style>
