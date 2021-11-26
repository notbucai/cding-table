/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-13 15:26:38
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-26 17:37:56
 * @Description:
 */

import RightNav from './right-nav.vue'
import LeftNav from './left-nav.vue'
import { getAsyncComponent } from '../route.config'

export default app => {
  app.component('RightNav', RightNav)
  app.component('LeftNav', LeftNav)
  app.component('DemoBlock', getAsyncComponent(() => import('./demo-block.vue')))
}
