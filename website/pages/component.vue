<template>
  <div class="component-layout">
    <el-container>
      <el-aside class="component-aside">
        <left-nav :navs="navs" />
      </el-aside>
      <el-main class="component-content">
        <router-view />
        <div class="footer-nav">
          <div v-if="nextAndPrevNavState.prev" class="prev footer-nav-item">
            <el-icon>
              <ArrowLeft />
            </el-icon>
            <router-link :to="'.'+nextAndPrevNavState.prev.path ">{{nextAndPrevNavState.prev.name}}</router-link>
          </div>
          <div v-else></div>
          <div v-if="nextAndPrevNavState.next" class="next footer-nav-item">
            <router-link :to="'.'+nextAndPrevNavState.next.path">{{nextAndPrevNavState.next.name}}</router-link>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </div>
          <div v-else></div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons'

import navs from '../nav.config.json'

const route = useRoute()
const nextAndPrevNavState = reactive({
  next: null,
  prev: null,
})

const navsFlat: {path: string;}[] = navs.reduce((acc, cur) => {
  if (cur.children) {
    acc.push(...cur.children)
  }
  return acc
}, [])


watch(route, ()=>{
  const current = route.path.split('/').filter(item=>item)[1]

  const curentIndex = navsFlat.findIndex(item=>{
    return item.path === '/' + current
  })

  const nextIndex = curentIndex + 1
  const prveIndex = curentIndex - 1

  const next = navsFlat[nextIndex]
  const prev = navsFlat[prveIndex]

  nextAndPrevNavState.next = next
  nextAndPrevNavState.prev = prev
}, { immediate: true })


</script>
<style lang="scss" scoped>
.component-layout {
  width: 1140px;
   max-width: 96%;
  margin: 0 auto;
  font-size: 14px;
  padding-bottom: 36px;
  .component-aside{
    width: 200px;
    @media (max-width: 768px) {
      width: 100px;
    }
  }
  .footer-nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 36px;
    padding-left: 36px;
    .footer-nav-item{
      display: flex;
      align-items: center;
    }
  }
  :deep(.el-main) {
    padding: 0;
  }
  :deep(.element-doc) {
    padding-left: 24px;


    h1,
    h2,
    h1,
    h3,
    h4,
    h5 {
      margin: 0;
      color: #2c3e50;
      position: relative;
      &:hover {
        .header-anchor {
          opacity: 1;
        }
      }
    }
    h1{
      font-size: 2em;
    }
    h2{
      margin-top: 26px;
      margin-bottom: 16px;
    }
    h3 {
      margin-top: 26px;
    }
    p {
      line-height: 2;
      font-size: 14px;
      color: #34495e;
      margin: 14px 0;
    }
    > table{
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 16px;
      font-size: 14px;
      td,
      th {
        padding: 8px 16px;
        text-align: left;
        color: #34495e;
        border-bottom: 1px solid rgb(198, 208, 212);
      }
    }
    blockquote {
      margin: 0;
      padding: 4px;
      padding-left: 16px;
      border-left: 4px solid  #345270;
      background-color: rgb(239, 243, 255);
    }
    .header-anchor {
      position: absolute;
      opacity: 0;
      left: -24px;
      padding-right: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 20px;
      text-align: right;
      color: #409eff;
      font-size: inherit;
      transition: all .3s;
    }
  }
}
</style>
