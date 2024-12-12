<template>
  <div class="news-overview" @click="() => emits('detail', data)">
    <div class="news-title">
      <NewsTag :cat="data.classReal ?? data.classModel" />
      <span class="news-title-txt" v-html="data.title"></span>
    </div>
    <div class="news-content" v-html="data.abstractReal"></div>
    <div class="news-footer">
      <div class="footer-info">
        <img
          v-if="data.addMode === 0 && data.siteName"
          class="source-logo"
          :src="getLogoUrlByName(data.siteName)"
          :alt="data.siteName"
        />
        <img v-else class="source-logo" src="@/assets/trinasolar-logo.png" />
        <span class="comming-source">{{ renderSource(data) }}</span>
        <span class="create-date">{{ data.createTime }}</span>
      </div>
      <div class="operation" @click="e => e.stopPropagation()">
        <span v-if="data.isPublished" class="pub-status">{{ data.pubTime }} 已发布</span>

        <a-popconfirm
          title="确定移除此新闻吗？"
          @confirm="() => removeFromRelease(data.id).then(isSuccess => isSuccess && emits('update'))"
        >
          <a-button v-if="hasPermission('news:pool:edit')" v-show="data.isSelect === 1" type="link">
            <template #icon>
              <custom-icon>
                <icon-remove></icon-remove>
              </custom-icon>
            </template>
            移除
          </a-button>
        </a-popconfirm>
        <a-button
          v-if="hasPermission('news:pool:edit')"
          v-show="data.isSelect !== 1"
          type="link"
          @click="() => addToRelease(data.id).then(isSuccess => isSuccess && emits('update'))"
        >
          <template #icon>
            <custom-icon>
              <icon-add></icon-add>
            </custom-icon>
          </template>
          加入待发布
        </a-button>
        <a-button v-if="hasPermission('news:pool:edit')" type="link" @click="() => emits('edit', data)">
          <template #icon>
            <custom-icon>
              <icon-edit></icon-edit>
            </custom-icon>
          </template>
          编辑
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NewsTag from './NewsTag.vue'
import { useNewsStore } from '@/stores/news-store'
import { useAuthorize } from '@/hooks/permission'
import CustomIcon from '@ant-design/icons-vue'
import IconAdd from '@/assets/btn-add.svg'
import IconEdit from '@/assets/btn-edit.svg'
import IconRemove from '@/assets/btn-remove.svg'
import { getLogoUrlByName } from '@/utils/logo-util'

const { hasPermission } = useAuthorize()
const newsStore = useNewsStore()
const { addToRelease, removeFromRelease } = newsStore
defineProps<{ data: object }>()
const emits = defineEmits<{
  (e: 'update'): void
  (e: 'detail', value: object): void
  (e: 'edit', value: object): void
}>()

const renderSource = (data): string => {
  if (data.siteName && data.opPerson) {
    return `${data.siteName} · 由${data.opPerson}更新`
  }
  if (data.addMode === 1) {
    return `由${data.opPerson || '--'}更新`
  }
  if (data.addMode === 0) {
    return data.siteName || '--'
  }
  return '--'
}
</script>
<style lang="less" scoped>
.news-overview {
  line-height: 22px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  cursor: pointer;
  &:hover .news-title-txt {
    color: @primary-color;
  }
  .news-title-txt {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .news-content {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
  }
  .pub-status {
    color: rgba(0, 0, 0, 0.45);
  }
  .comming-source {
    color: rgba(0, 0, 0, 0.65);
    margin-right: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .create-date {
    color: rgba(0, 0, 0, 0.45);
    margin-right: 16px;
  }
  .footer-info {
    display: flex;
    align-items: center;
    line-height: 22px;
    flex: 1;
    overflow: hidden;
  }
  .source-logo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin-right: 8px;
    object-fit: contain;
  }
  .news-footer {
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .footer-info {
      flex: 1;
    }

    &:deep(.ant-btn) {
      height: 22px;
      padding: 0;
      margin-left: 16px;
    }
  }
}
</style>
