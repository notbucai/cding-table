# 格式化 列

格式化 column 只需要对在 `column` 中实现了 `formatter` 方法的进行格式化即可。

复杂数据或需要 html 渲染可将 formatter 返回 jsx 语法，但需要工程化中配置 `jsx` 支持。

:::demo

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
          // this is a formatter
          formatter(row, column, cellValue){
            return <span>我是格式化后的数据{row.date}</span>
          },
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
