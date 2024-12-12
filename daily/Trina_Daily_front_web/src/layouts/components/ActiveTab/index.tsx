import { headerViewProps } from '#/layout/Header'
import { Button } from 'ant-design-vue'
import './index.less'
const ActiveTab = defineComponent({
  name: 'ActiveTab',
  inheritAttrs: false,
  props: headerViewProps(),
  setup(props, { emit, attrs }) {
    const router = useRouter()
    const name = ref('')
    watch(
      () => router.currentRoute.value,
      newval => {
        const currentRoute = newval
        console.log(currentRoute)
        name.value = currentRoute.meta.name || ''
      },
      { immediate: true, deep: true }
    )
    return () => {
      const tabActions = props.headerActionRender?.(router.currentRoute.value)
      return (
        <>
          <div class={'tab-wrap'}>
            <div class={'tab-text'}>{name.value}</div>
            {tabActions ? <div class={'tab-operate-btn'}>{tabActions}</div> : null}
          </div>
        </>
      )
    }
  },
})
export default ActiveTab
