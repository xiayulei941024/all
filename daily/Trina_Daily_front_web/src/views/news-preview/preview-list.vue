<template>
  <div class="h5-wrap">
    <header class="page-header">
      <p class="font-semibold text-20 color-85">
        {{ title || '天合日报 I (NO.07) \n\r 2024.08.05-08.11' }}
      </p>
      <p class="sub-info flex items-center color-45">
        <Eye class="mr-8" />
        <span class="mr-24">{{ readNum || 0 }}人阅读</span>
        <Clock class="mr-8" />
        <span>{{ pubTime || '--' }}</span>
      </p>
    </header>
    <section class="page-title flex items-center justify-center">
      <span class="block sm"></span>
      <span class="block"></span>
      <h2 class="page-title-text">今日要闻</h2>
      <span class="block"></span>
      <span class="block sm"></span>
    </section>
    <article class="news-list flex flex-col">
      <NewsItem v-for="(x, y) in datalist" :key="x.id" :data="x" :sn="y + 1" />
    </article>
    <div style="color: #008bd6; text-align: center">--Powered by AI--</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import NewsItem from './news-item.vue'
import { useNewsStore } from '@/stores/news-store'
import Eye from '@/assets/eye.svg'
import Clock from '@/assets/clock-gray.svg'
import { showNews, pubedDetailApi } from '@/api/news'
import { useRoute } from 'vue-router'
const route = useRoute()
const newsStore = useNewsStore()
const title = ref()
const readNum = ref()
const pubTime = ref()
const isFromPubed = computed(() => route.path.startsWith('/news-pubed'))
const datalist = ref([])

const listClassify = list => {
  const classified = list.reduce(
    (base, it) => {
      base[it.classReal]?.push(it)
      return base
    },
    { 1: [], 2: [], 3: [], 4: [], 0: [] }
  )
  const ret = newsStore.newsCatagory.map(cat => classified[cat.value].sort((a, b) => a.orderNews - b.orderNews))
  return ret.flat()
}

onMounted(() => {
  if (isFromPubed.value) {
    pubedDetailApi(route.query.id).then(res => {
      datalist.value = listClassify(res.data.list)
      title.value = res.data.title
      readNum.value = res.data.readNum
      pubTime.value = res.data.pubTime
    })
  } else {
    if (!newsStore.releaselist.length) {
      newsStore.fetchReleaseList().then(list => (datalist.value = listClassify(list)))
    } else {
      datalist.value = listClassify(newsStore.releaselist)
    }
    showNews().then(res => {
      title.value = res.data.title
      readNum.value = res.data.readNum
      pubTime.value = res.data.pubTime
    })
  }
})
</script>
<style scoped lang="less">
.h5-wrap {
  flex: 1;
  overflow: auto;
  max-width: 520px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0px;
  }
}
.page-header {
  .sub-info {
    margin-top: 12px;
    font-size: 14px;
  }
}
.page-title {
  margin-top: 24px;
  column-gap: 16px;
  .page-title-text {
    display: inline-block;
    font-family: HYYaKuHei;
    font-size: 28px;
    font-weight: bold;
    line-height: 36px;
    color: #008bd6;
    border-top: 1px solid #008bd6;
    border-bottom: 1px solid #008bd6;
    padding: 4px 0;
    margin: 0;
  }

  .block {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #008bd6;
    transform: rotate(45deg);
  }
  .block.sm {
    width: 8px;
    height: 8px;
    background: rgba(0, 139, 214, 0.45);
  }
}

.news-list {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  // padding-bottom: 35px;
}
</style>
