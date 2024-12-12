<template>
  <a-upload
    name="banner"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :custom-request="upload"
    action="#"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <div v-if="value" class="image-box" :style="{ 'background-image': `url(${value})` }">
      <div class="mask">替换</div>
    </div>
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <div v-else class="ant-upload-text"><plus-outlined></plus-outlined><span>上传图片</span></div>
      <div class="ant-upload-text">建议尺寸480*200</div>
    </div>
  </a-upload>
</template>
<script setup lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { uploadFileApi } from '@/api/news'
defineOptions({ name: 'ImageUpload' })
defineProps<{ value?: string }>()
const emits = defineEmits<{
  (e: 'update:value', value: string): void
}>()
const loading = ref<boolean>(false)

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      // emits('update:value', base64Url)
      console.log(base64Url)
      loading.value = false
    })
  }
  if (info.file.status === 'error') {
    loading.value = false
    message.error('upload error')
  }
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const fileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg']
  const isJpgOrPng = fileTypes.includes(file.type)
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const upload = options => {
  console.log(options)
  const file = options.file
  const formData = new FormData()
  formData.append('multipartFile', file)
  uploadFileApi(formData)
    .then(response => {
      if (response.code === 200) {
        emits('update:value', response.data.fileUrl)
        options.onSuccess(response, file)
      } else {
        options.onError()
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
<style scoped lang="less">
.avatar-uploader {
  width: 240px;
  height: 90px;
  position: relative;

  &:deep(.ant-upload.ant-upload-select-picture-card) {
    width: 100%;
    height: 100%;
    border: none;
  }
}
.image-box {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    color: #fff;
    line-height: 90px;
    text-align: center;
    font-weight: 600;
    opacity: 0;
    transition: all 300ms;
  }
  &:hover .mask {
    opacity: 1;
  }
}
.ant-upload-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.25);
}
</style>
