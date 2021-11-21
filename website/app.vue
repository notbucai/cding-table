<template>
  <div class="app">
    <el-config-provider :locale="locale">
      <header class="navbar">
        <div class="navbar-wrapper">
          <div class="logo-container">
            <img src="./assets/images/logo.png" alt="logo" />
            <span>CdingTable</span>
          </div>
          <div class="navbar-list">
            <router-link to="/" class="navbar-item">首页</router-link>
            <router-link to="/component" class="navbar-item">指南</router-link>
            <a href="https://github.com/notbucai/cding-table" target="_blank" class="navbar-item">
            <img src="./assets/images/github.png" alt="" />
            </a>
          </div>
        </div>
      </header>
      <router-view />
    </el-config-provider>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  setup () {
    const a = reactive({
      a: 1,
    })
    return {
      a: toRefs(a),
      locale: zhCn,
    }
  },
})
</script>
<style lang="scss" scoped>
.app {
  .navbar {
    height: 60px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 99;
    border-bottom: 1px solid #f4f5f6;
    background-color: #fff;
    .navbar-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 1140px;
      margin: 0 auto;
      .logo-container {
        font-size: 20px;
        font-weight: bold;
        color: #3086ff;
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          margin-right: 6px;
        }
      }
      .navbar-list {
        display: flex;
        align-items: center;
        .navbar-item {
          margin-left: 24px;
          color: #888;
          display: block;
          img{
            width: 32px;
            height: 32px;
            transform: translateX(0);
          }
        }
        :deep(.router-link-active) {
          color: #409eff;
        }
      }
    }
  }
}
</style>
