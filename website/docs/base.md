# 基础用法

最简单用法只需要准备 `columns` 和 `loadMethod` 即可完成使用。

对于数据来源，只需要实现 `loadMethod` 并返回相应数据结构即可，该函数可以返回一个`Promise`作为异步处理。

:::demo 从用法不难看出，我们将传统的 `template` 编写套路改为`script options`的形式，让我们专注与逻辑部分，忽略xml结构的臃肿。

```html
<template>
  <TableData :load-method="loadMethod" :columns="columns" />
</template>

<script>
  export default {
    setup() {
      const columns = [
        {
          label: '标题',
          prop: 'title',
          showOverflowTooltip: true,
        },
        {
          label: '描述',
          prop: 'brief',
          showOverflowTooltip: true,
        },
        {
          label: '时间',
          prop: 'date',
        },
      ]
      const loadMethod = ({ page }) => {
        return new Promise((resolve, reject) => {
          // todo 这里可以换成接口数据
          resolve({
            total: 5,
            list: [
              {
                title: '标题1',
                brief: '描述1',
                date: '2021-01-01',
              },
              {
                title: '标题2',
                brief: '描述2',
                date: '2021-01-02',
              },
              {
                title: '标题3',
                brief: '描述3',
                date: '2021-01-03',
              },
              {
                title: '标题4',
                brief: '描述4',
                date: '2021-01-04',
              },
              {
                title: '标题5',
                brief: '描述5',
                date: '2021-01-05',
              },
            ],
          })
        })
      }

      return {
        columns,
        loadMethod,
      }
    },
  }
</script>
```

:::
