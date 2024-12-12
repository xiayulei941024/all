import { fileURLToPath, URL } from 'url'
import { execSync } from 'node:child_process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// 自动导入 vue 组件，无需手动 import
import AutoImport from 'unplugin-auto-import/vite'

// 按需加载 ant-design-vue 此组件无法处理非组件模块，如 message、notification
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// 修改 index.html 插件
import { createHtmlPlugin } from 'vite-plugin-html'
// vue i18n 处理
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// @ts-ignore
import { projectTitle } from './src/config'
import { antdvStyleDeps } from './src/utils/resolvers'

import svgLoader from 'vite-svg-loader'

const serverAddress = 'http://admin.ballcat.cn'
// const serverAddress = 'http://127.0.0.1:8080'

// git信息
let currentVersion = ''
try {
  const branchesInfo = execSync('git branch -v', { encoding: 'utf8' })
  const currentBranchInfo = branchesInfo.split(/\n/).find(branchStr => branchStr.startsWith('*')) || ''
  const branchInfoParts = currentBranchInfo.split(/\s+/).map(v => v.trim())
  currentVersion = branchInfoParts.slice(1, 3).join(' ')
  process.env.VITE_GIT_INFO = currentVersion
} catch (e) {
  console.error(e)
}

function GitVersionPlugin() {
  return {
    name: 'git-version-plugin',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.txt',
        source: currentVersion,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 8180,
    // proxy: {
    //   '^/api': {
    //     target: serverAddress,
    //     changeOrigin: true,
    //     ws: true,
    //     rewrite: path => {
    //       return path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  },
  plugins: [
    vue(),

    vueJsx(),

    // 自动导入 vue
    AutoImport({
      // global imports to register
      imports: [
        // presets
        'vue',
        'vue-router',
        'pinia',
      ],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      // Set `false` to disable.
      dts: './types/auto-imports.d.ts',
    }),

    // 按需加载 ant-design-vue 组件
    Components({
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      resolvers: [
        AntDesignVueResolver({
          resolveIcons: true,
          importStyle: 'less',
        }),
      ],
      dts: './types/components.d.ts',
    }),

    createHtmlPlugin({
      minify: false,
      // 注入变量
      inject: {
        data: {
          VITE_GIT_INFO: currentVersion,
          title: projectTitle,
        },
      },
    }),
    GitVersionPlugin(),

    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [fileURLToPath(new URL('locales/**', import.meta.url))],
      jitCompilation: true,
    }),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./pro-components', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // 'ant-design-vue/es/default.less'中的@root-entry-name在'ant-design-vue/es/index.less'中被重新定义，但是modifyVars在@import路径解析时只会在entry文件末尾追加，导致theme路径解析时@root-entry-name是index.less中的值，最终导致global.less中的less变量不是var()的形式
          // 由于上述原因，ant-theme.less中的变量最好在这里也定义一遍
          'root-entry-name': 'variable',
          'primary-color': '#008BD6',
          'border-radius-base': '4px',
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      ...antdvStyleDeps,
      'vue',
      'vue-router',
      'pinia',
      'axios',
      '@vueuse/core',
      '@vueuse/shared',
      '@ant-design/icons-vue',
      'ant-design-vue/es/table',
      'ant-design-vue/es/tree-select',
      'ant-design-vue/es/vc-util/get',
      'ant-design-vue/es/_util/props-util',
      'dayjs',
      'crypto-js/index',
      '@ballcat/vue-cropper',
    ],
  },
}))
