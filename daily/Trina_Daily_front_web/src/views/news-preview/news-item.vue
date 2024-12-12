<template>
  <div class="news-item leading-24" @click="() => readDetail(data.id)">
    <span class="sn-tag">
      <SnL />
      <SnR />
    </span>
    <p class="news-title text-20 font-semibold leading-28 color-85">{{ data.title }}</p>
    <p class="comming-source color-45">
      <img
        v-if="data.addMode === 0 && data.siteName"
        class="source-logo"
        :src="getLogoUrlByName(data.siteName)"
        :alt="data.siteName"
      />
      <span>{{ data.siteName }}</span>
    </p>
    <p class="news-summary color-65 leading-24">{{ data.abstractReal }}</p>
    <p>
      <span class="read-all color-primary">阅读全文</span>
    </p>
    <div class="split-bar flex">
      <span class="bottom-line"></span>
      <span class="flex">
        <Skew />
        <Skew />
        <Skew />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import Skew from '@/assets/skew.svg'
import { objectEntries } from '@vueuse/shared'
import { getLogoUrlByName } from '@/utils/logo-util'

const router = useRouter()
const props = defineProps<{ sn: number; data: object }>()
const snsMap = import.meta.glob('@/assets/[0-9].svg', {})

const svgs = objectEntries(snsMap).reduce((prev, [k, im]) => {
  k = k.replace(/\/src\/assets\/([0-9]).svg/, '$1')
  return { ...prev, [k]: im }
}, {})

const tags = computed(() => String(props.sn).padStart(2, '0').split(''))
const SnL = defineAsyncComponent(svgs[tags.value[0]])
const SnR = defineAsyncComponent(svgs[tags.value[1]])
const readDetail = id => {
  const isPubed = router.currentRoute.value.path.startsWith('/news-pubed')
  const pubedPath = `/news-pubed/period-detail/${id}`
  const currentPath = `/preview/detail/${id}`
  router.push(isPubed ? pubedPath : currentPath)
}
</script>
<style scoped>
p {
  margin: 0;
}
.news-item {
  position: relative;
  margin: 30px 0;
  background-color: #fff;
  cursor: pointer;

  .news-title {
    position: relative;
    z-index: 1;
    margin-bottom: 12px;
    background-color: #fff;
  }
  .news-summary {
    margin: 16px 0;
  }
  .read-all {
    cursor: pointer;
  }
  .split-bar {
    height: 12px;
    column-gap: 14px;
  }
  .bottom-line {
    display: inline-block;
    flex: 1;
    border-bottom: 1px solid #008bd6;
  }
  .sn-tag {
    position: absolute;
    display: flex;
    width: 46px;
    height: 48px;
    margin-top: -28px;
  }
  .source-logo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin-right: 8px;
    object-fit: contain;
    vertical-align: bottom;
  }
}
</style>
