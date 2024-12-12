import { defineStore } from 'pinia'
import { StorageSerializers, useLocalStorage, useSessionStorage } from '@vueuse/core'
import { getStorageKey } from '@/utils/storage-utils'
import type { LoginUserInfo } from '@/api/auth/types'
import { getLoginUserMenus } from '@/api/system/menu'
import type { SysMenuRouterVO } from '@/api/system/menu/types'
import { login } from '@/api/auth/index'
import { i18n } from '@/locales'

export interface UserInfo extends LoginUserInfo {
  roleCodes: string[]
  permissions: string[]
}

const accessTokenKey = getStorageKey('access-token')
const userInfoKey = getStorageKey('user-info')

export const useUserStore = defineStore('userStore', {
  // 其他配置...
  state: () => ({
    accessToken: useSessionStorage<string | undefined>(accessTokenKey, undefined, {
      writeDefaults: false
    }),
    userInfo: useSessionStorage<UserInfo | undefined>(userInfoKey, undefined, {
      writeDefaults: false,
      serializer: StorageSerializers.object
    }),
    userMenus: undefined as SysMenuRouterVO[] | undefined
  }),
  actions: {
    async login(code: string) {
      const res = (await login({ code })).data
      this.accessToken = res.access_token
      const info = res.info
      const roleCodes = res.attributes?.roleCodes || []
      const permissions = res.attributes?.permissions || []
      this.userInfo = {
        ...info,
        roleCodes,
        permissions
      }
    },
    async fetchUserMenus() {
      const { data } = await getLoginUserMenus()
      data.forEach(item => {
        item.title = i18n.global.t(item.title)
      })
      this.userMenus = data
      return data
    },
    clean() {
      // 不能调用 reset，因为初始值可能是从 localStorage 加载的
      this.accessToken = undefined
      this.userInfo = undefined
      this.userMenus = undefined
    }
  }
})
