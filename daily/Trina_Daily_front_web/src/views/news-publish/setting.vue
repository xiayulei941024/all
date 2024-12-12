<template>
  <a-card class="card-content">
    <div class="release-page">
      <div style="width: 415px">
        <a-steps :current="1"> <a-step title="发布内容" /><a-step title="发布设置" /> </a-steps>
      </div>
      <div class="release-list">
        <a-form ref="formRef" :model="formState" name="pub_form" layout="vertical" :rules="rules">
          <a-row>
            <a-col flex="auto">
              <a-form-item label="标题" name="title">
                <a-input v-model:value="formState.title" show-count :maxlength="100" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col>
              <a-form-item label="封面和摘要" name="imageUrl">
                <ImageUpload v-model:value="formState.imageUrl" />
              </a-form-item>
            </a-col>
            <a-col flex="auto">
              <a-form-item label=" " name="summary">
                <a-textarea v-model:value="formState.summary" style="height: 90px"></a-textarea>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="发送时间" name="pubState">
                <a-radio-group v-model:value="formState.pubState" name="radioGroup">
                  <a-radio :value="1">立即发送</a-radio>
                  <a-radio :value="0">定时发送</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item v-if="formState.pubState === 0" label=" " name="waitPubTime">
                <a-date-picker
                  v-model:value="formState.waitPubTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  show-time
                  :disabled-date="disabledDate"
                  placeholder="发布时间"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col style="width: 100%">
              <a-form-item label="人员选择" name="allUsers">
                <a-select
                  v-model:value="formState.allUsers"
                  placeholder="请选择人员"
                  show-search
                  mode="multiple"
                  :options="userOptions"
                  optionFilterProp="label"
                ></a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <template #actions>
      <a-space>
        <a-button @click="back">上一步</a-button>
        <a-button type="primary" :loading="loading" @click="publish">发布</a-button>
      </a-space>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, createVNode } from 'vue'
import dayjs from 'dayjs'
import type { Rule } from 'ant-design-vue/es/form'
import { useRouter, useRoute } from 'vue-router'
import ImageUpload from './components/ImageUpload.vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { insertPublishApi, insertWaitPublishApi, showNews } from '@/api/news'
import { message, Modal } from 'ant-design-vue'
import { useNewsStore } from '@/stores/news-store'
import { SelectTypes } from 'ant-design-vue/es/select'
import { pageUsers } from '@/api/system/user'

defineOptions({ name: 'NewsPublishSetting' })
const newsStore = useNewsStore()
const router = useRouter()
const route = useRoute()
const formRef = ref()
const loading = ref()

const rules: Record<string, Rule[]> = {
  title: [{ required: true, trigger: 'change', message: '请输入' }],
  imageUrl: [
    {
      validator: async (rule, value) => {
        return value?.length > 0 ? Promise.resolve() : Promise.reject()
      },
      required: true,
      message: '请上传封面',
    },
  ],
  summary: [
    {
      validator: async (rule, value) => (value?.length > 0 ? Promise.resolve() : Promise.reject()),
      trigger: 'change',
      message: '请填写摘要',
    },
  ],
  pubState: [{ required: true, message: '请选择' }],
  waitPubTime: [
    {
      validator: async (rule, value) => (value?.length > 0 ? Promise.resolve() : Promise.reject()),
      trigger: 'change',
      message: '请选择日期',
    },
  ],
}

const userOptions = ref<SelectTypes['options']>([])

const formState = reactive<FormState>({
  title: '',
  imageUrl: '',
  summary: '',
  pubState: 1,
  waitPubTime: null,
  allUsers: [],
})

const back = () => {
  router.go(-1)
}

const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().endOf('day').subtract(1, 'day')
}

const pubConfirm = async () => {
  if (newsStore.releaselist.length === 0) {
    const releaseList = await newsStore.fetchReleaseList()
    if (!releaseList.data?.list?.length) {
      message.error(`待发布新闻列表为空`)
      return false
    }
  }

  return new Promise(resolve => {
    Modal.confirm({
      title: '发布提示',
      icon: createVNode(ExclamationCircleFilled),
      content: '发布后不可撤销，确定发布吗？',
      okText: '确认',
      onOk: () => {
        resolve(true)
      },
      cancelText: '取消',
      onCancel() {
        resolve(false)
      },
    })
  })
}

const publish = async () => {
  try {
    const values = await formRef.value.validateFields()
    if (values.allUsers?.length) {
      values.allUsers = values.allUsers.join(',')
    } else {
      delete values.allUsers
    }
    const url = import.meta.env.VITE_MOBILE_URI || route.query.newsMobileAddress
    const params = {
      ...values,
      url,
    }
    const isContinue = await pubConfirm()
    if (isContinue) {
      loading.value = true
      await (values.pubState === 0 ? insertWaitPublishApi(params) : insertPublishApi(params))
      loading.value = false

      router.push(`/news-publish/result?state=${formState.pubState}&waitPubTime=${params.waitPubTime}`)
      console.info(`mobile is deployed at ${url}`)
    }
  } catch (err) {
    loading.value = false
  }
}

onMounted(async () => {
  showNews().then(res => {
    formState.imageUrl = res.data.imageUrl
    formState.title = res.data.title
    formState.summary = res.data.abstractReal
  })
  const { records } = (await pageUsers({ size: 9999 })).data
  userOptions.value = records.map(item => {
    return { value: item.username, label: item.nickname }
  })
})
</script>
<style lang="less" scoped>
.card-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 128px);
  :deep(.ant-card-body) {
    flex: 1;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(31, 31, 31, 0.2);
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
    }
  }
}
.release-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  .ant-form-item {
    margin-bottom: 16px;
  }
  .release-list {
    width: 720px;
  }
}
</style>
