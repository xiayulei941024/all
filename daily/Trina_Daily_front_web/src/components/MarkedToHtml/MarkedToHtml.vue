<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="content"
    v-html="DOMPurify.sanitize(marked.parse(text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '').replace(/\u002D/g, '')))"
  ></div>
</template>
<script lang="ts" setup>
import { marked } from 'marked'
import DOMPurify from 'dompurify'
defineProps<{ text: string }>()
</script>
<style lang="less" scoped>
.content {
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0px;
}
</style>
