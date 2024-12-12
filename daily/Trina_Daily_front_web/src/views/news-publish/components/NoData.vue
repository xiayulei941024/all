<template>
  <slot>
    <a-card>
      <div class="flex">
        <Placeholder />
        <p class="txt1">待发布内容为空</p>
        <p class="txt2">你还没有添加任何新闻，快去新闻池挑选合适的新闻吧</p>
        <a-button type="primary" @click="navNewsPool">前往新闻池</a-button>
      </div>
    </a-card>
  </slot>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import Placeholder from '@/assets/404.svg'
const navNewsPool = () => {
  router.replace('/news-pool')
}
const router = useRouter()
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 178px);
}

.txt1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.85);
}
.txt2 {
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
