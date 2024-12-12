import httpClient from '@/utils/axios'
import type { ApiResult } from '@/api/types'

/**
 * 上传文件
 */
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return httpClient.post<ApiResult<{ url: string }>>('/system/dict', formData)
}
