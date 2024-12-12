import NProgress from 'nprogress'
import '@/styles/nprogress.less'
import qs from 'qs'

import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { projectTitle, loginPath, redirectPath } from '@/config'
import { useUserStore } from '@/stores/user-store'
import { generatorDynamicRouter } from '@/router/dynamic-routes'

NProgress.configure({ showSpinner: false })

const routerGuards = (router: Router) => {
  router.beforeEach(async to => {
    NProgress.start()

    const userStore = useUserStore()
    if (userStore.accessToken) {
      // 如果已经登录的情况下访问登录页，直接跳转到首页
      if (to.path === loginPath) {
        NProgress.done()
        return { path: '/' }
      }

      // 如果是 layout 内部的页面，且没有动态路由，则更新
      if (!to.meta.withoutLayout && !userStore.userMenus) {
        const userMenus = await userStore.fetchUserMenus()
        if (userMenus) {
          const dynamicRouter = generatorDynamicRouter(userMenus)
          const existRoutes = router.getRoutes().find(route => route.path === dynamicRouter.path)
          // constantRoutes need to be merged
          if (existRoutes?.children?.length) {
            const mergedChildren = existRoutes.children.concat(dynamicRouter.children || [])
            dynamicRouter.children = mergedChildren
          }
          router.addRoute(dynamicRouter)
          return to.fullPath
        }
      }
    } else if (!to.meta.allowAnonymous) {
      // 如果没有登录，访问地址又不允许匿名访问，就跳转到登录页
      const parsedSearch = qs.parse(window.location.search, { ignoreQueryPrefix: true })
      const iamCode = parsedSearch.code as string
      if (iamCode) {
        await userStore.login(iamCode)
        window.location.href =
          window.location.origin +
          window.location.pathname +
          qs.stringify({ ...parsedSearch, code: undefined }, { addQueryPrefix: true }) +
          window.location.hash
      } else {
        const clientId = import.meta.env.VITE_CLIENT_ID
        const redirectUri = import.meta.env.VITE_REDIRECT_URI
        window.location.href = `https://iam.trinasolar.com:443/mga/sps/oauth/oauth20/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
      }
      return false
    }

    updateDocumentTitle(to)
    return true
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

/** 更新标签页标题 */
const updateDocumentTitle = function (route: RouteLocationNormalizedLoaded) {
  if (!route?.path?.startsWith(`${redirectPath}/`)) {
    const pageTitle = route?.meta?.name
    document.title = pageTitle ? `${pageTitle} - ${projectTitle}` : projectTitle
  }
}

export default routerGuards
