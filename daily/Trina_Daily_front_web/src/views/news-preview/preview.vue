<template>
  <div class="preview-header">
    <a :style="{ display: 'flex', alignItems: 'center' }">
      <img src="@/assets/logo.png" alt="logo" :style="{ height: '28px', marginLeft: '28px' }" />
      <span :style="{ color: '#f0f0f0', margin: '0 10px' }">|</span>
      <h1 :style="{ fontSize: '14px', whiteSpace: 'nowrap' }">{{ projectTitle }}</h1>
    </a>
    <span class="back-btn" @click="() => router.replace('/news-publish-list')">
      <span style="padding-top: 3px"><Bowout /></span> <span>退出预览</span>
    </span>
  </div>
  <div class="html5-preview-wrap">
    <h1 class="header-title font-semibold text-20 leading-28">
      <span v-show="isShowBack" style="position: absolute; left: 24px" @click="() => router.back()">
        <LeftOutlined />
      </span>
      天合日报
    </h1>
    <div class="news-content">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import Bowout from '@/assets/bowout.svg'
import { projectTitle } from '@/config'
defineOptions({ name: 'NewsPreview' })

const router = useRouter()
const isShowBack = computed<boolean>(() => router.currentRoute.value.name === 'preview-detail')
</script>
<style scoped lang="less">
.html5-preview-wrap {
  display: flex;
  flex-direction: column;
  background-image: url(@/assets/phone-head.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: 395px;
  height: calc(100vh - 60px);
  margin: 10px auto;
  border: 10px solid #000;
  border-radius: 54px;
  padding-top: 48px;
  overflow: hidden;
  box-sizing: border-box;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #eee;
  height: 48px;
  color: #3d3d3d;
  font-size: 14px;
}
.header-title {
  position: relative;
  color: #3d3d3d;
  text-align: center;
  padding: 10px;
  margin-bottom: 0;
  border-bottom: 1px solid #eee;
}
.back-btn {
  display: flex;
  align-items: center;
  justify-self: flex-end;
  cursor: pointer;
  align-self: right;
  column-gap: 5px;
}
.news-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
