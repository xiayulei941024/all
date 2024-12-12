<template>
  <a-drawer
    v-model:visible="drawerOpen"
    class="news-edit-drawer"
    :class="{
      'news-edit-drawer--narrow': layout === 'narrow',
    }"
    :title="mode === 'create' ? '手动添加新闻' : '编辑新闻'"
    :width="layout === 'narrow' ? 552 : 900"
    :closable="false"
    destroy-on-close
  >
    <template #extra><CloseOutlined @click="drawerOpen = false" /></template>
    <div class="edit-wrapper">
      <div class="edit-form">
        <a-form
          ref="formRef"
          :model="formState"
          name="news-edit"
          layout="vertical"
          :validate-messages="{ required: '请输入${label}' }"
        >
          <a-form-item v-show="false" name="id">
            <a-input v-model:value="formState.id" placeholder="请输入" />
          </a-form-item>
          <a-form-item name="title" label="新闻标题" :rules="[{ required: true }]">
            <a-textarea v-model:value="formState.title" placeholder="请输入" />
          </a-form-item>
          <a-form-item name="classReal" label="新闻标签" :rules="[{ required: true, message: '请选择新闻标签' }]">
            <a-select v-model:value="formState.classReal" :options="newsStore.newsCatagory"></a-select>
          </a-form-item>
          <a-form-item name="siteName" label="新闻来源">
            <a-input
              v-model:value="formState.siteName"
              :disabled="mode === 'edit' && layout === 'wide'"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item v-if="mode === 'edit' && layout === 'wide'" name="sourceUrl" label="新闻网址">
            <a-input v-model:value="formState.sourceUrl" disabled placeholder="请输入" />
          </a-form-item>
          <a-form-item v-else name="newUrl" label="新闻网址">
            <a-input v-model:value="formState.newUrl" placeholder="请输入" />
          </a-form-item>
          <a-form-item name="abstractReal" label="新闻摘要" :rules="[{ required: true }]">
            <a-textarea v-model:value="formState.abstractReal" placeholder="请输入" :autosize="{ minRows: 5 }" />
            <template #extra><span style="float: right; font-size: 14px">建议200字以内</span></template>
          </a-form-item>
          <a-form-item v-if="layout === 'narrow'" name="markContent" label="新闻正文">
            <a-textarea v-model:value="formState.markContent" :autosize="{ minRows: 5 }" placeholder="请输入" />
          </a-form-item>
        </a-form>
      </div>
      <div v-if="layout === 'wide'" ref="scrollRef" class="mark-content">
        <div class="content-title">正文内容</div>
        <MarkedToHtml :text="formState.markContent" />
      </div>
    </div>
    <template #footer>
      <a-space style="float: right; padding: 0 12px">
        <a-button @click="drawerOpen = false">取消</a-button>
        <a-button type="primary" :loading="loading" @click="mode === 'create' ? createNews() : updateNews()">
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useNewsStore } from '@/stores/news-store'
import { insertNewsApi, updateNewsApi } from '@/api/news'
import { message } from 'ant-design-vue'
import MarkedToHtml from '@/components/MarkedToHtml'

const emits = defineEmits<{
  (e: 'update', value?: object): void
}>()
const newsStore = useNewsStore()

const drawerOpen = ref<boolean>(false)
const formRef = ref()
const scrollRef = ref()
const currentData = ref()
const loading = ref<boolean>(false)
const formState = reactive({
  title: '',
  classReal: undefined,
  siteName: '',
  sourceUrl: '',
  newUrl: '',
  abstractReal: '',
  markContent: '',
})
const addMode = ref(null)

const mode = computed<'edit' | 'create'>(() => {
  return currentData.value !== undefined ? 'edit' : 'create'
})

const layout = computed<'wide' | 'narrow'>(() => {
  // addMode 系统：0 手动：1
  if (currentData.value?.addMode === 0 && mode.value === 'edit') {
    return 'wide'
  }
  return 'narrow'
})

const createNews = async () => {
  try {
    loading.value = true
    const values = await formRef.value.validateFields()
    await insertNewsApi({ ...values, addMode: 1 })
    message.success('新闻已创建')
    emits('update')
    drawerOpen.value = false
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}

const updateNews = async () => {
  try {
    loading.value = true
    const values = (await formRef.value.validateFields()) || {}
    const attrs = ['title', 'classReal', 'siteName', 'sourceUrl', 'newUrl', 'abstractReal', 'markContent']
    // 手动添加, 没有值传空格到api
    if (addMode.value == 1) {
      attrs.map(attr => {
        if (values.hasOwnProperty(attr)) {
          values[attr] = values[attr] || ' '
        }
      })
    }

    await updateNewsApi(values)
    message.success('新闻已更新')
    emits('update', { ...currentData.value, ...values })
    drawerOpen.value = false
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}

const norimailzeText = (text: string) => {
  return text.replace(/<span style='color: red;'>|<\/span>/g, '')
}

defineExpose({
  async open(data) {
    currentData.value = data
    drawerOpen.value = true

    if (data) {
      formState.id = data.id
      formState.title = norimailzeText(data.title)
      formState.classReal = data.classReal
      formState.siteName = data.siteName
      formState.sourceUrl = data.sourceUrl
      formState.newUrl = data.newUrl
      formState.abstractReal = norimailzeText(data.abstractReal)
      formState.markContent = data.markContent
      addMode.value = data.addMode

      // reset drawer
      formRef.value?.validateFields()
      scrollRef.value && (scrollRef.value.scrollTop = 0)
    } else {
      formState.title = ''
      formState.classReal = ''
      formState.siteName = ''
      formState.sourceUrl = ''
      formState.newUrl = ''
      formState.abstractReal = ''
      formState.markContent = ''
      formState.id = ''
    }
  },
})
</script>
<style lang="less" scoped>
.news-edit-drawer {
  &--narrow {
    .edit-wrapper::after {
      display: none;
    }
  }
}
.edit-wrapper {
  position: relative;
  display: flex;
  height: 100%;

  &::after {
    content: ' ';
    display: block;
    position: absolute;
    top: -24px;
    bottom: -24px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 1px;
    height: auto;
    background-color: rgba(0, 0, 0, 0.06);
  }
}

.edit-form {
  flex: 1;
  padding-right: 24px;
  box-sizing: border-box;
}

.mark-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 24px;
  overflow: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(31, 31, 31, 0.2);
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
  }
  .content-title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 10px;
  }
  .content {
    flex: 1;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
