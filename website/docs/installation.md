## 测试

我是 markdown

### 测试

我是 markdown

:::demo 123123

```html
<template>
  <div>
    <TableData
      ref="tableDataRef"
      size="mini"
      :columns="columns"
      :load-method="loadMethod"
    />
  </div>
</template>
<script lang="tsx">
  const list = [
    {
      id: 1,
      date: '2016-05-02',
      name: '王小虎 async',
      province: '上海',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1518 弄',
      zip: 200333,
      checkList: ['2'],
      hasChildren: true,
    },
  ]
  export default {
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 80,
          },
          {
            type: 'index',
            width: 80,
            label: '#',
          },
          {
            label: '标题',
            prop: 'name',
          },
          {
            label: 'someLabel',
            formatter(row) {
              return (
                <div class="checkbox-group">
                  <input
                    type="checkbox"
                    name="checkBoxTest"
                    checked={row.checkList.includes('1')}
                    value="0"
                  />
                  北京
                  <input
                    type="checkbox"
                    name="checkBoxTest"
                    checked={row.checkList.includes('2')}
                    value="1"
                  />
                  上海
                  <input
                    type="checkbox"
                    name="checkBoxTest"
                    checked={row.checkList.includes('3')}
                    value="2"
                  />
                  广州
                </div>
              )
            },
          },
        ],
      }
    },
    methods: {
      async loadMethod({ page, sort }) {
        return new Promise((r) => {
          setTimeout(() => {
            r(1)
          }, 300)
        }).then(() => {
          return {
            total: 100,
            list,
          }
        })
      },
    },
  }
</script>
<style>
  #c {
    color: #f00;
  }
</style>
```

:::
