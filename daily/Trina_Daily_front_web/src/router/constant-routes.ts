// notFound 路由，使用函数获取，方便使用不同的路由名称，支持登录后 content 中显示异常信息
import type { RouteRecordRaw } from 'vue-router'
import { loginPath } from '@/config'

export const ExceptionComponentImport = () => import('@/views/basic/exception/index.vue')

export const buildNotFoundRoute = (routeName: string): RouteRecordRaw => ({
  path: '/:pathMatch(.*)*',
  name: routeName,
  component: ExceptionComponentImport,
  meta: {
    name: '404',
    hideInMenu: true,
    hideInTab: true,
  },
  props: {
    exceptionStatus: '404',
  },
})

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    meta: {
      keepAlive: false,
    },
    children: [
      // {
      //   name: 'news.pool',
      //   path: '/news-pool',
      //   meta: { name: 'news.pool', icon: 'user', targetType: 1, hideInMenu: true, keepAlive: 1 },
      //   component: () => import('@/views/news-pool/index.vue'),
      // },
      {
        name: 'pubed.h5list',
        path: '/news-pubed/period-list',
        meta: { name: '往期新闻', icon: 'user', targetType: 1, hideInMenu: true },
        component: () => import('@/views/news-pubed/preview-list.vue'),
      },
      {
        name: 'pubed.h5detail',
        path: '/news-pubed/period-detail/:id',
        meta: { name: '详情', icon: 'user', targetType: 1, hideInMenu: true },
        component: () => import('@/views/news-pubed/preview-detail.vue'),
      },
      {
        name: 'news.pubresult',
        path: '/news-publish/result',
        meta: { name: '发布编辑', icon: 'user', targetType: 1, hideInMenu: true },
        component: () => import('@/views/news-publish/success.vue'),
      },
    ],
  },
  {
    path: '/preview',
    name: 'preview-wrap',
    component: () => import('@/views/news-preview/preview.vue'),
    children: [
      {
        path: '/preview/list',
        name: 'preview-list',
        component: () => import('@/views/news-preview/preview-list.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        path: '/preview/detail/:id',
        name: 'preview-detail',
        component: () => import('@/views/news-preview/preview-detail.vue'),
        meta: {
          keepAlive: false,
        },
      },
    ],
    meta: {
      keepAlive: false,
    },
  },

  /* {
    path: loginPath,
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/login/index.vue'),
    meta: {
      allowAnonymous: true,
      withoutLayout: true
    }
  },
  {
    // OAuth2 授权码登录处理页
    path: '/oauth2/authorize',
    name: 'OAuth2Authorize',
    component: () => import('@/views/oauth2/OAuth2Authorize.vue'),
    meta: {
      withoutLayout: true
    }
  },
  {
    // OAuth2 授权码登录处理页
    path: '/oauth2/consent',
    name: 'OAuth2Consent',
    component: () => import('@/views/oauth2/OAuth2Consent.vue'),
    meta: {
      withoutLayout: true
    }
  }, */
  // 404 路由
  buildNotFoundRoute('GlobalNotFound'),
]

// 静态路由的名称集合
export const constantRouteNames: string[] = []
const fillConstantRouteNames = (array: any[]) =>
  array.forEach(item => {
    constantRouteNames.push(item.name)
    fillConstantRouteNames(item.children || [])
  })
fillConstantRouteNames(constantRoutes)

export default constantRoutes
