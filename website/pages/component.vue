<template>
  <div class="component-layout">
    <el-container>
      <el-aside width="200px">
        <left-nav />
      </el-aside>
      <el-main class="component-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
export default {
  data () {
    return {

    }
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
.component-layout {
  width: 1140px;
  margin: 0 auto;
  :deep(.el-main) {
    padding: 0;
  }
  :deep(.element-doc) {
    padding-left: 36px;

    h2,
    h1,
    h3,
    h4,
    h5 {
      margin: 0;
      color: #2c3e50;
      position: relative;
      &:hover {
        color: #f00;
        .header-anchor {
          opacity: 1;
        }
      }
    }
    h3 {
      margin-top: 36px;
    }
    p {
      line-height: 2;
      font-size: 14px;
      color: #34495e;
      margin: 14px 0;
    }
    .header-anchor {
      position: absolute;
      opacity: 0;
      left: -24px;
      color: #409eff;
      font-size: inherit;
    }
  }
}
</style>
