import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { releaseListApi, updateNewsApi, releaseOrderApi } from '@/api/news'
import { message } from 'ant-design-vue'

export const useNewsStore = defineStore('newsStore', () => {
  // 新闻标签 1:宏观形势，2:行业动态,3:产业链动态,4:国际能源 0:其他
  const newsCatagory = [
    { color: '#83DAAD', label: '每日天合新闻', value: 0, key: 'dailyTianHeNews' },
    { color: '#EDBF45', label: '新能源要闻', value: 1, key: 'macroEnvironment' },
    { color: '#8E63B7', label: 'AI市场快讯', value: 2, key: 'industryTrends' },
    { color: '#E8954F', label: '政经与社会要闻', value: 3, key: 'supplyChainDynamics' },
    { color: '#00BFFF', label: '长三角+青海快讯', value: 4, key: 'internationalEnergy' },
    { color: '#697798', label: '其他', value: 5, key: 'other' },
  ]

  const releaselist = ref([])

  const classified = computed(
    () => {
      const init = { 1: [], 2: [], 3: [], 4: [], 5: [], 0: [] }
      return releaselist.value.reduce((base, it) => {
        base[it.classReal]?.push(it)
        return base
      }, init)
    },
    {
      deep: true,
    }
  )

  const fetchReleaseList = async () => {
    try {
      const res = await releaseListApi({})
      releaselist.value = res.data.list
      return res.data.list
    } catch (err) {
      console.log(err)
    }
  }

  const updateSelect = async (id, isSelect) => {
    // isSelect: （1：选中  0：未选）
    try {
      await updateNewsApi({ id, isSelect })
      message.success(isSelect ? `新闻已添加成功！` : `新闻已移除！`)
      return true
    } catch (error) {
      return false
    }
  }

  const updateOrder = async list => {
    list.forEach(it => {
      releaselist.value.map(st => {
        if (st.id === it.id) {
          st.orderNews = it.orderNews
        }
        return st
      })
    })
    try {
      await releaseOrderApi({ list })
      message.success(`新的顺序已保存！`)
      return true
    } catch (error) {
      return false
    }
  }

  const addToRelease = async id => await updateSelect(id, 1)
  const removeFromRelease = async id => await updateSelect(id, 0)

  return {
    releaselist,
    classified,
    newsCatagory,
    fetchReleaseList,
    addToRelease,
    removeFromRelease,
    updateOrder,
  }
})
