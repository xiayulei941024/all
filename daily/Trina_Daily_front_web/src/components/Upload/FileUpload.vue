<template>
  <a-upload
    name="file"
    :file-list="files"
    :accept="props.accept"
    :max-count="props.maxCount"
    :multiple="props.multiple"
    :before-upload="beforeUpload"
    :show-upload-list="false"
    v-bind="attrs"
  >
    <slot>
      <a-button :loading="uploadingFiles.length > 0" type="primary" icon="cloud-download">
        上传
      </a-button>
    </slot>
  </a-upload>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { uploadFile } from '@/api/file'

type UploadFile = {
  uid?: string
  url: string
  name: string
}
const props = defineProps<{
  fileList?: UploadFile[]
  accept?: string
  maxCount?: number
  maxSize?: number // 单位为M
  multiple?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:fileList', value: UploadFile[]): void
}>()
const attrs = useAttrs()
const files = ref<UploadFile[]>([])
const uploadingFiles = ref<UploadFile[]>([])

watch(
  () => props.fileList,
  value => {
    files.value = value || []
  },
  {
    immediate: true
  }
)

function beforeUpload(file: File) {
  const extension = file.name.split('.').pop() || ''
  const size = file.size / 1024 / 1024
  const accepts = props.accept?.split(',')
  if (accepts && !accepts.includes(extension)) {
    message.error(`请上传${props.accept}文件`)
    return false
  }
  if (props.maxSize && size > props.maxSize) {
    message.error(`请上传不大于${props.maxSize}M的文件`)
    return false
  }
  if (props.maxCount && uploadingFiles.value.length + files.value.length >= props.maxCount) {
    message.error(`最多上传${props.maxCount}个文件`)
    return false
  }

  const uid = Math.random().toString(36).substring(2)
  const uploadingFileItem = { uid, name: file.name, url: '' }
  uploadingFiles.value.push(uploadingFileItem)

  uploadFile(file).then(res => {
    uploadingFileItem.url = res.data.url
    files.value.push(uploadingFileItem)
    emit('update:fileList', files.value)
    uploadingFiles.value = uploadingFiles.value.filter(item => item.uid !== uploadingFileItem.uid)
  })

  return false
}
</script>

<script lang="ts">
export default {
  name: 'FileUpload'
}
</script>
