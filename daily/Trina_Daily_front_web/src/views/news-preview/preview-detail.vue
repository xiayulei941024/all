<template>
  <article class="h5-wrap article">
    <div class="news-detail leading-24">
      <p class="news-title text-20 font-semibold leading-28 color-85">
        {{ detailInfo.title }}
      </p>
      <p class="comming-source color-65">
        <img
          v-if="detailInfo.addMode === 0 && detailInfo.siteName"
          class="source-logo"
          :src="getLogoUrlByName(detailInfo.siteName)"
          :alt="detailInfo.siteName"
        />
        <span class="text-14">{{ detailInfo.siteName }}</span>
      </p>
      <p class="news-summary color-45"><MultiLineSpread :line="2" :text="detailInfo.abstractReal" /></p>
      <div class="news-content color-65 leading-24">
        <MarkedToHtml :text="detailInfo.markContent || ''" />
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNewsStore } from '@/stores/news-store'
import MarkedToHtml from '@/components/MarkedToHtml'
import { MultiLineSpread } from '@/components/MultiLineEllipsis'
import { getLogoUrlByName } from '@/utils/logo-util'

const newsStore = useNewsStore()
const route = useRoute()
const { releaselist } = storeToRefs(newsStore)
const detailInfo = computed(() => releaselist.value.find(it => String(it.id) === route.params.id) || {})

onMounted(() => {
  if (!releaselist.length) {
    newsStore.fetchReleaseList()
  }
})
</script>
<style scoped lang="less">
.h5-wrap {
  flex: 1;
  overflow: auto;
  max-width: 520px;
  min-width: 100%;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  word-break: break-all;
  &::-webkit-scrollbar {
    width: 0px;
  }
  .news-title {
    margin-bottom: 12px;
  }
  .news-summary {
    background: #f5f6f6;
    line-height: 26px;
    margin: 24px 0;
    padding: 8px;
    border-radius: 4px;
  }
  .source-logo {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin-right: 8px;
    object-fit: contain;
    vertical-align: middle;
  }
}
.header-title {
  color: #3d3d3d;
  text-align: center;
  margin-top: 20px;
  position: relative;
}
</style>
