<template>
  <a-card>
    <div class="page page-card-content">
      <span class="success-icon"></span>
      <p class="success-title">发布成功</p>
      <p class="success-info">{{ text[route.query.state](route.query.waitPubTime) }}</p>
      <a-space>
        <a-button @click="backToList">返回列表</a-button>
        <a-button type="primary" @click="viewPrevious">查看往期发布</a-button>
      </a-space>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
defineOptions({ name: 'ResultPage' })
const router = useRouter()
const route = useRoute()

const text = [
  time => `新闻将于${time}发布，在此之前你仍可以对此新闻进行修改，你可以在“往期发布”中查看或修改此新闻。`,
  () => '新闻发布成功，用户可在天讯中接收并查看本期内容。你可以在“往期发布”中查看查看此新闻。',
]

const backToList = () => {
  router.replace('/news-pool')
}

const viewPrevious = () => {
  router.replace('/news-pubed')
}
</script>
<style lang="less" scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .success-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 20px;
    background-image: url(@/assets/success.svg);
    background-repeat: no-repeat;
    background-size: contain;
  }
  .success-title {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
  }
  .success-info {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 24px;
    margin-bottom: 24px;
  }
}
</style>
