export interface NewsPool {
  // 新闻内容
  content?: string
  // 新闻类型
  newsType?: string
  // 筛选条件
  filter?: object
}
export type NewsTypes = [
  { label: '宏观形势'; value: 1 },
  { label: '行业动态'; value: 2 },
  { label: '产业链动态'; value: 3 },
  { label: '国际能源观察'; value: 4 },
  { label: '其他'; value: 0 }
]
