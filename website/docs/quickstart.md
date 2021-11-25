# 快速开始

本节将介绍如何在项目中使用 Cding Tables。

## 用法

### 全局导入

如果在项目中多处使用 Cding Table，可以在项目的入口文件中导入 Cding Table，如下：

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入
import { TableData } from 'cding-table'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)

// 使用
app.component('cding-table', TableData)

app.mount('#app')
```

### 组件使用

```html
<template>
  <TableData :columns="columns" :load-method="loadMethod" />
</template>
<script>
  import { TableData } from 'cding-table'
  export default {
    components: { TableData },
    data () {
      return {
        columns:[]
      }
    },
    methods: {
      async loadMethod () {
        return {
          list: [],
          total: 10,
        }
      },
    },
  }
</script>
```

## 开始使用

您现在就可以启动项目了，对于每个组件的使用方法，请参阅对应组件的文档。