<template>
  <a-drawer v-model:visible="drawerOpen" title="详情" width="720" :closable="false" :z-index="999" destroy-on-close>
    <template #extra><CloseOutlined @click="drawerOpen = false" /></template>
    <div class="news-detail detail-wrapper">
      <div class="title" v-html="detail.title"></div>
      <div class="tips">
        <img
          v-if="detail.addMode === 0 && detail.siteName"
          class="source-logo"
          :src="getLogoUrlByName(detail.siteName)"
          :alt="detail.siteName"
        />
        <span class="comming-source">{{ detail.siteName }}</span>
        <span class="create-date">{{ detail.createTime }}</span>
        <span class="link-source">
          <a
            :herf="detail.sourceUrl"
            v-if="detail.newUrl || detail.sourceUrl"
            target="_blank"
            @click="() => openNewWindow(detail.newUrl || detail.sourceUrl)"
          >
            原文链接
          </a>
        </span>
      </div>
      <div class="overview">
        <MultiLineSpread :line="2">
          <span v-html="detail.abstractReal || '摘要未生成'"></span>
        </MultiLineSpread>
      </div>
      <MarkedToHtml v-if="detail.addMode === 0" :text="detail.markContent" />
      <div v-else>{{ detail.markContent }}</div>
    </div>

    <template #footer>
      <a-space v-if="hasPermission('news:pool:edit')" style="float: right; padding: 0 12px">
        <a-button v-show="detail.isSelect === 0" :loading="loading" @click="() => addRelease(detail.id)">
          加入待发布
        </a-button>
        <a-popconfirm title="确定移除此新闻吗？" @confirm="() => removeRelease(detail.id)">
          <a-button v-show="detail.isSelect === 1" :icon="h(MinusCircleOutlined)" :loading="loading"> 移除 </a-button>
        </a-popconfirm>
        <a-button @click="emits('edit', detail)">编辑</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { h } from 'vue'
import { CloseOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import MarkedToHtml from '@/components/MarkedToHtml'
import { MultiLineSpread } from '@/components/MultiLineEllipsis'
import { useNewsStore } from '@/stores/news-store'
import { useAuthorize } from '@/hooks/permission'
import { getLogoUrlByName } from '@/utils/logo-util'

const { hasPermission } = useAuthorize()
const newsStore = useNewsStore()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'edit', value: object): void
}>()
const detail = ref<object>()
const drawerOpen = ref<boolean>(false)
const loading = ref()
const { addToRelease, removeFromRelease } = newsStore

const addRelease = async id => {
  loading.value = true
  const isSuccess: boolean = await addToRelease(id)
  loading.value = false

  if (isSuccess) {
    detail.value.isSelect = 1
    emits('update')
    drawerOpen.value = false
  }
}

const removeRelease = async id => {
  loading.value = true
  const isSuccess: boolean = await removeFromRelease(id)
  loading.value = false

  if (isSuccess) {
    detail.value.isSelect = 0
    emits('update')
    drawerOpen.value = false
  }
}

const openNewWindow = url => window.open(url, '_blank')

defineExpose({
  open(data) {
    detail.value = data
    drawerOpen.value = true
  },
  update(data) {
    data && (detail.value = data)
  },
})
</script>
<style lang="less" scoped>
.detail-wrapper {
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}
.tips {
  margin: 16px 0;
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
.create-date {
  color: rgba(0, 0, 0, 0.45);
  margin: 0 16px;
}
.overview {
  padding: 16px;
  background: #f5f6f6;
  line-height: 26px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 24px;
}
</style>
