<template>
  <div class="app">
    <el-config-provider :locale="locale">
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
<style lang="scss">
.app {
}
</style>
