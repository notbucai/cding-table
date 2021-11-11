/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-18 10:25:01
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-11 19:18:09
 * @Description:
 */
declare module '*.vue' {
  import { App, defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent> & {
    install (app: App): void
  }
  export default component
}
