<template>
  <div class="news-pubed-preview-list">
    <preview-list></preview-list>
  </div>
</template>

<script lang="ts" setup>
import PreviewList from '../news-preview/preview-list.vue'
</script>

<style lang="less" scoped>
.news-pubed-preview-list {
  height: calc(100vh - 128px);
  max-width: 520px;
  margin: 0 auto;
}
</style>
