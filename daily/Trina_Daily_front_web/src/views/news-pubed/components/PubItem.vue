<template>
  <div class="flex">
    <div class="image">
      <a-image width="100%" height="100%" :src="data.imageUrl"> </a-image>
    </div>
    <div class="pub-overview" @click="() => router.push('/news-pubed/period-list?id=' + data.id)">
      <div class="pub-title">
        <span class="pub-title-txt">{{ data.title }}</span>
      </div>
      <div class="pub-content">
        {{ data.summary }}
      </div>
      <div class="pub-footer">
        <div v-if="data.pubState === 1" class="footer-info">
          <span class="pub-status">
            {{ data.pubTime }}
          </span>
          <span class="pub-person">由{{ data.pubPerson }}发布</span>
        </div>
        <div v-if="data.pubState === 0" class="footer-info">
          <Clock />
          <span class="wait-pub">新闻将于{{ data.waitPubTime }}自动发布</span>
          <span class="change-time" @click.stop="changePubTime">修改时间</span>
        </div>
        <div class="footer-watch">
          <Eye />
          <span style="margin-left: 8px">{{ data.readNum }}</span>
        </div>
      </div>
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    class="update-pub-time-modal"
    title="修改时间"
    ok-text="确认"
    cancel-text="取消"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item name="waitPubTime">
        <a-date-picker
          v-model:value="formState.waitPubTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          show-time
          style="width: 100%"
          :disabled-date="disabledDate"
          :allow-clear="false"
        ></a-date-picker>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import Eye from '@/assets/eye.svg'
import Clock from '@/assets/clock.svg'
import dayjs from 'dayjs'
import { updatePublish } from '@/api/news'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
// :value="1">立即发送  :value="0">定时发送

const emits = defineEmits<{
  (e: 'update'): void
}>()
const props = defineProps<{ data: object }>()
const visible = ref<boolean>(false)

const formRef = ref()
const formState: { waitPubTime?: string } = reactive({
  waitPubTime: '',
})

const rules: Record<string, Rule[]> = {
  waitPubTime: [
    {
      required: true,
      trigger: 'change',
      message: '请选择日期',
    },
  ],
}

const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().endOf('day').subtract(1, 'day')
}

const handleOk = async () => {
  try {
    await formRef.value.validateFields()
    visible.value = false
    updatePublish({ id: props.data.id, waitPubTime: formState.waitPubTime }).then(res => {
      if (res.code === 200) {
        message.success(`发布时间已调整！`)
        emits('update')
      } else {
        message.error(res.msg)
      }
    })
  } catch (error) {
    // 表单验证失败，不做处理
  }
}

const changePubTime = () => {
  visible.value = true
  formState.waitPubTime = props.data.waitPubTime
  formRef.value?.clearValidate()
}
</script>
<style lang="less" scoped>
:global(.update-pub-time-modal .ant-form-item) {
  margin-bottom: 0;
}
.flex {
  display: flex;
  column-gap: 24px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 24px 0;
}
.image {
  width: 200px;
  height: 83.33px;
  border-radius: 8px;
  overflow: hidden;
}
.pub-overview {
  flex: 1;
  line-height: 22px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  cursor: pointer;
  .pub-title-txt {
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .pub-content {
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
  .pub-footer {
    display: flex;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.45);
    .footer-info {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      column-gap: 8px;
      .wait-pub {
        color: #ff7d00;
      }
      .change-time {
        color: #008bd6;
        cursor: pointer;
      }
    }
  }
}
</style>
