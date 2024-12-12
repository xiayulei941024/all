<template>
  <a-card class="release-wrap" :bordered="false">
    <div class="release-news">
      <div class="release-title">待发布新闻（{{ releaselist.length }}）</div>
      <div class="release-content">
        <slot :datalist="releaselist">
          <div class="placeholder">
            <span class="draw-icon"></span>
            <span>请在左侧选择需要发布新闻</span>
          </div>
        </slot>
      </div>
      <div v-show="releaselist.length" style="padding: 16px">
        <a-button type="primary" block @click="publish"> 发布设置 </a-button>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/news-store'

const router = useRouter()
const newsStore = useNewsStore()
const { releaselist } = storeToRefs(newsStore)

const publish = () => {
  router.push({
    path: '/news-publish-list',
  })
}
onMounted(() => {
  newsStore.fetchReleaseList()
})
</script>
<style lang="less" scoped>
.release-wrap {
  &:deep(.ant-card-body) {
    padding: 0;
  }
}
.release-news {
  width: 320px;
  height: calc(100vh - 128px);
  display: flex;
  flex-direction: column;

  .release-title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    padding: 16px;
  }
  .release-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    padding: 0 16px;
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
  .draw-icon {
    width: 24px;
    height: 24px;
    background-image: url('@/assets/no-data.svg');
    background-size: contain;
  }
  .placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
