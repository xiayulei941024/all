<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="h5-wrap article">
    <div class="news-detail leading-24">
      <p class="news-title text-20 font-semibold leading-28 color-85" v-html="titleTpl"></p>
      <p class="comming-source color-65 text-14">
        <img v-if="logoUrl" class="source-logo" :src="logoUrl" :alt="siteName" />
        <span v-html="siteName"></span>
      </p>
      <div class="news-summary color-45">
        <MultiLineSpread :line="2">
          <div v-html="abstractRealTpl"></div>
        </MultiLineSpread>
      </div>
      <div class="news-content color-65 leading-24">
        <div v-html="contentTpl"></div>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MultiLineSpread } from '@/components/MultiLineEllipsis'
import { markDownToHtml } from '@/api/news'
import { getLogoUrlByName } from '@/utils/logo-util'

const route = useRoute()
const contentTpl = ref()
const abstractRealTpl = ref()
const titleTpl = ref()
const siteName = ref('')
const addModel = ref(0)

const logoUrl = computed(() => {
  const key = siteName.value.replace(/.+>(.+)<.+/g, '$1')
  return getLogoUrlByName(key)
})

onMounted(() => {
  markDownToHtml(route.params.id).then(res => {
    titleTpl.value = res.data.title
    abstractRealTpl.value = res.data.abstractReal
    contentTpl.value = res.data.markContent
    siteName.value = res.data.siteName
    addModel.value = res.data.addModel
  })
})
</script>
<style scoped lang="less">
.h5-wrap {
  flex: 1;
  overflow: auto;
  max-width: 520px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  word-break: break-all;
  height: calc(100vh - 128px);

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
  }
  .comming-source {
    display: flex;
    align-items: center;
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
