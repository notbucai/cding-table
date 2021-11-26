/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-17 15:13:15
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-26 17:44:50
 * @Description:
 */
import { createApp } from 'vue'


import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './route.config'
// import 'highlight.js/styles/color-brewer.css'
import './assets/styles/common.scss'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') // todo: locale based on Doc site lang
import App from './app.vue'

import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
// import '@element-plus/icons'

import registerComponents from './components'

import { TableData } from 'main'

const app = createApp(App)
registerComponents(app)
app.component('TableData', TableData)

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
app.use(ElementPlus)
app.use(router)

router.isReady().then(async () => {
  // import('nprogress/nprogress.css')
  const NProgress = await import('nprogress')
  NProgress.configure({

  })
  router.beforeEach(async (to, from) => {
    NProgress.start()
    return true
  })
  router.afterEach(async () => {
    NProgress.done()
  })
})

app.mount('#app')
