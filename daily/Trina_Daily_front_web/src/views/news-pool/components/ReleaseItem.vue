<template>
  <div class="news-overview" :class="{ 'news-overview--brief': brief }" @click="() => emits('detail', data)">
    <div class="news-title">
      <NewsTag v-if="!brief" :cat="data.classReal ?? data.classModel" />

      <span class="news-title-txt multi-ellipsis2">{{ data.title }}</span>
      <span class="news-arrow" @click.stop><slot name="arrow"></slot></span>
    </div>
    <div class="news-content">
      {{ data.abstractReal }}
    </div>
    <div class="extra-info" :class="{ vertical: brief }">
      <div class="comming-source">
        <img
          v-if="data.addMode === 0 && data.siteName"
          class="source-logo"
          :src="getLogoUrlByName(data.siteName)"
          :alt="data.siteName"
        />
        <span class="comming-site">{{ data.siteName }}</span>
        <span v-if="!brief" class="create-time">{{ data.createTime }}</span>
      </div>
      <div class="release-footer">
        <div class="footer-info">
          <span class="create-person">由{{ data.opPerson || ' ? ? ? ' }}添加</span>
        </div>
        <div class="operation" :class="{ brief: brief }" @click="e => e.stopPropagation()">
          <a-popconfirm
            title="确定移除此新闻吗？"
            @confirm="() => removeFromRelease(data.id).then(isSuccess => isSuccess && emits('update'))"
          >
            <a-button v-show="data.isSelect === 1" type="link" size="small">
              <template #icon>
                <custom-icon>
                  <icon-remove></icon-remove>
                </custom-icon>
              </template>
              移除
            </a-button>
          </a-popconfirm>
          <a-button type="link" size="small" @click="() => emits('edit', data)">
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
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/news-store'
import NewsTag from './NewsTag.vue'
import CustomIcon from '@ant-design/icons-vue'
import IconEdit from '@/assets/btn-edit.svg'
import IconRemove from '@/assets/btn-remove.svg'
import { getLogoUrlByName } from '@/utils/logo-util'

const newsStore = useNewsStore()
defineProps<{ data: object; brief?: boolean }>()
const emits = defineEmits<{
  (e: 'update'): void
  (e: 'edit', value: object): void
  (e: 'detail', value: object): void
}>()
const { removeFromRelease } = newsStore
</script>
<style lang="less" scoped>
.news-overview {
  line-height: 22px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  row-gap: 16px;

  .news-title {
    display: flex;
    line-height: 24px;
    .news-arrow {
      display: flex;
      column-gap: 8px;
      align-items: center;
    }
  }
  .news-title-txt {
    flex: 1;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  &:hover .news-title-txt {
    color: @primary-color;
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
  .extra-info {
    display: flex;
  }
  .vertical {
    flex-direction: column;
    row-gap: 12px;
  }

  .release-footer {
    display: flex;
    color: rgba(0, 0, 0, 0.45);
    &:deep(.ant-btn-link) {
      font-size: 14px;
    }
  }
  .brief {
    &:deep(.ant-btn-link) {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
  .footer-info,
  .comming-source {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
  }
  .source-logo {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin-right: 8px;
    object-fit: contain;
    vertical-align: middle;
  }
  .comming-site {
    color: rgba(0, 0, 0, 0.65);
    margin-right: 12px;
  }
  .footer-info {
    line-height: 24px;
  }
  .create-person {
    padding-right: 7px;
  }

  &--brief {
    padding: 12px 0;
    row-gap: 12px;
  }
}
</style>
