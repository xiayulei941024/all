<template>
  <div>
    <div>
      <div v-if="newslist?.length === 0 && loading">
        <a-skeleton active />
        <a-skeleton active />
        <a-skeleton active />
        <a-skeleton active />
      </div>
      <a-spin :spinning="newslist?.length > 0 && loading"><slot :datalist="newslist"></slot></a-spin>
    </div>
    <div class="flex justify-end">
      <a-pagination
        v-model:current="current"
        v-model:page-size="pageSize"
        :total="total"
        show-size-changer
        :show-total="total => `共${total}条`"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, toValue } from 'vue'
import debounce from 'lodash.debounce'

const props = defineProps<{ searchState: object; request: (params) => promise }>()
const current = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const newslist = ref<object[]>([])
const loading = ref<boolean>(false)
const fetchNewsList = (reset): boolean | undefined => {
  loading.value = true
  const { abstractReal, classReal, filter } = props.searchState
  if (reset) {
    current.value = 1
  }
  const params = {
    current: toValue(current),
    currentSize: toValue(pageSize),
    abstractReal,
    classReal,
    ...filter,
  }
  props
    .request(params)
    .then(res => {
      if (res.code === 200) {
        newslist.value = res.data.records
        total.value = res.data.total
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const factors = [() => props.searchState.classReal, () => props.searchState.filter]
watch(factors, () => fetchNewsList(true), { deep: true, immediate: true, flush: 'post' })
watch([current, pageSize], () => fetchNewsList())
watch(
  () => props.searchState.abstractReal?.trim(),
  debounce(() => fetchNewsList(true), 600)
)

defineExpose({ reload: debounce(fetchNewsList, 600) })
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  margin: 16px 0 30px 0;
}

.justify-end {
  justify-content: flex-end;
}
</style>
