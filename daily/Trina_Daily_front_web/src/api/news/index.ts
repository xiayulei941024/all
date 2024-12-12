import httpClient from '@/utils/axios'
import type { PageResult, ApiResult } from '@/api/types'
/**
 * 获取当前登录用户拥有的菜单列表
 */
// export function getLoginUserMenus() {
//   return httpClient.get<ApiResult<SysMenuRouterVO[]>>('/system/menu/router')
// }

/**
 * 新闻池列表
 */
export function newsListApi(data) {
  return httpClient.request<PageResult>({
    url: '/news/newsList',
    method: 'POST',
    data,
  })
}

// 手动添加新闻
export function insertNewsApi(data) {
  return httpClient.post<ApiResult>('/news/insertNews', data)
}

// 更新新闻
export function updateNewsApi(data) {
  return httpClient.post('/news/updateNews', data)
}

// selectAllCountClassReal
export function selectAllCountClassRealApi(data) {
  return httpClient.post('/news/selectAllCountClassReal', data)
}

// markDownToHtml
export function markDownToHtml(id) {
  return httpClient.post('/news/markDownToHtml', { id })
}

// 查询发布新闻详情
export function pubedDetailApi(id) {
  return httpClient.post<ApiResult>('/news/selectPublishNewsPC', { id })
}
// 查询发布列表
export function selectPublishApi(data) {
  return httpClient.post<ApiResult>('/news/selectPublish', data)
}
// 立即发布
export function insertPublishApi(data) {
  return httpClient.post('/news/insertPublish', data)
}
// 定时发布
export function insertWaitPublishApi(data) {
  return httpClient.post('/news/insertWaitPublish', data)
}
// 更新发布定时
export function updatePublish(data) {
  return httpClient.post('/news/updatePublish', data)
}

// 获取发布模板信息
export function showNews() {
  return httpClient.post('news/showNews')
}

// 查询选中列表
export function releaseListApi(data) {
  return httpClient.post('/news/releaseList', data)
}

// 给选中列表排序
export function releaseOrderApi(data) {
  return httpClient.post('/news/order', data)
}

// 删除新闻
export function deleteNewsApi(data) {
  return httpClient.post('/news/deleteNews', data)
}

// 上传文件
export function uploadFileApi(formData) {
  return httpClient.post('/file/upload', formData)
}
