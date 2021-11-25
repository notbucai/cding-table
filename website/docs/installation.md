# 安装

## 环境支持

Cding Table 是一个依赖 [Vue 3](https://github.com/vuejs/vue-next) 和 [Element Plus](https://github.com/element-plus/element-plus) 的表格组件库。如果是 Vue2 请自行升级后使用。

| Vue 3    | Element Plus |
| -------- | ------------ |
| >= 3.2.x | >= 1.2.x     |

### 版本

![https://img.shields.io/github/package-json/v/notbucai/cding-table](https://img.shields.io/github/package-json/v/notbucai/cding-table)

## 使用包管理器

我们建议您使用包管理器 ([NPM](https://www.npmjs.com/), [Yarn](https://classic.yarnpkg.com/lang/en/), [pnpm](https://pnpm.io/)) 安装 Cding Table, 然后您就可以使用打包工具，例如 [Vite](https://vitejs.dev/) 和 [webpack](https://webpack.js.org/)

```shell
# 选择一个你喜欢的包管理器

# NPM
$ npm install cding-table --save

# Yarn
$ yarn add cding-table

# pnpm
$ pnpm install cding-table
```

如果您的网络环境不好，建议使用相关镜像服务 [cnpm](https://github.com/cnpm/cnpm) or [淘宝 npm 镜像](https://registry.npm.taobao.org/)。

## 浏览器直接引入

> 如果需要使用到高级功能（如 jsx），那么可能需要一些脚手架功能支持，所以不建议直接在浏览器中使用。

### unpkg

```html
<head>
  <!-- 导入Element Plus样式 -->
  <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />
  <!-- 导入 Vue 3 -->
  <script src="//unpkg.com/vue@next"></script>
  <!-- 导入Element Plus -->
  <script src="//unpkg.com/element-plus"></script>

  <!-- 导入 Cding Table 组件 -->
  <script src="//unpkg.com/cding-table/lib/index.full.min.js"></script>
</head>
```

## Hello World

:::demo 这是一个相对完整的例子

```html
<template>
  <div class="hello-world">
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="handleSelectMony([1, 3])"
        >选中2和4</el-button
      >
      <el-button type="primary" size="mini" @click="handleSelectMony([0])"
        >选中1</el-button
      >
      <el-button type="primary" size="mini" @click="handleClearSelect()"
        >取消选中</el-button
      >
    </div>
    <TableData
      ref="tableDataRef"
      size="mini"
      :load-method="loadMethod"
      :load-tree="loadTree"
      :columns="columns"
      :config="config"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script lang="tsx">
  import { defineComponent, ref, watch } from 'vue'
  import { mockListData } from '../mock'

  export default defineComponent({
    setup() {
      const tableDataRef = ref(null)
      const searchValue = ref('')

      let timer = null
      watch(searchValue, () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          tableDataRef.value.loadData()
        }, 60)
      })

      return {
        tableDataRef,
        config: {
          stripe: true,
          border: true,
          lazy: true,
          highlightCurrentRow: true,
          rowKey: 'id',
          showSummary: true,
          treeProps: { children: 'children', hasChildren: 'hasChildren' },
          maxHeight: '600px',
          summaryMethod(param) {
            const { columns, data } = param

            const sums = columns.map((column, index) => {
              if (index === 0) {
                return '合计'
              }
              if (!['money'].includes(column.property)) {
                return ''
              }
              const values = data.map((item) => Number(item[column.property]))
              return values
                .reduce((prev, curr) => {
                  const value = typeof curr === 'number' ? curr : 0
                  return prev + value
                }, 0)
                .toFixed(2)
            })

            return sums
          },
        },
        columns: [
          {
            type: 'expand',
            fixed: true,
            width: 90,
            render({ row, column, $index }) {
              return (
                <div style={{ padding: '10px' }}>
                  <p>名称: {row.name}</p>
                </div>
              )
            },
          },
          {
            type: 'selection',
            width: 68,
            fixed: true,
          },
          {
            type: 'index',
            width: 68,
            label: '#',
            fixed: true,
          },
          {
            width: 100,
            prop: 'id',
            label: '编号',
            // fixed: true,
          },
          {
            label: '钱包',
            children: [
              {
                label: '用户名',
                prop: 'name',
                width: '150px',
                sortable: 'custom',
                filters: [
                  { text: '不才', value: '不才' },
                  { text: '吴强强', value: '吴强强' },
                ],
                formatter(row) {
                  return row.editing ? (
                    <el-input size="mini" vModel={row.name} />
                  ) : (
                    row.name
                  )
                },
              },
              {
                label: '余额',
                prop: 'money',
                width: '120px',
              },
            ],
          },
          {
            label: '地址',
            children: [
              {
                label: '省份',
                prop: 'province',
                sortable: 'custom',
                width: '120px',
              },
              {
                label: '市区',
                prop: 'city',
                width: '100px',
              },
            ],
          },
          {
            label: '文章',
            children: [
              {
                label: '标题',
                prop: 'title',
                width: '200px',
                showOverflowTooltip: true,
              },
              {
                label: '描述',
                prop: 'brief',
                width: '200px',
                showOverflowTooltip: true,
              },
            ],
          },
          {
            label: '时间',
            prop: 'date',
            width: '200px',
          },
          {
            label: '状态',
            prop: 'status',
            width: '100px',
            align: 'center',
            // fixed: 'right',
            filters: [
              { text: '正常', value: 0 },
              { text: '提示', value: 1 },
              { text: '异常', value: 2 },
              { text: '冻结', value: 3 },
            ],
            formatter(row: any) {
              return row.editing ? (
                <el-select size="mini" vModel={row.status}>
                  {[0, 1, 2, 3].map((item) => (
                    <el-option
                      key={item}
                      label={['正常', '提示', '异常', '冻结'][item]}
                      value={item}
                    ></el-option>
                  ))}
                </el-select>
              ) : (
                <el-tag
                  type={['success', 'info', 'warning', 'danger'][row.status]}
                >
                  {['正常', '提示', '异常', '冻结'][row.status]}
                </el-tag>
              )
            },
          },
          {
            label: '',
            width: 200,
            fixed: 'right',
            renderHeader({}) {
              return (
                <el-input
                  vModel={searchValue.value}
                  size="mini"
                  placeholder="请输入关键词"
                  type="text"
                />
              )
            },
            formatter(row) {
              return (
                <div>
                  <el-button
                    size="mini"
                    onClick={() => {
                      row.editing = !row.editing
                    }}
                  >
                    {!row.editing ? '编辑' : '保存'}
                  </el-button>
                  <el-button plain size="mini" type="danger">
                    删除
                  </el-button>
                </div>
              )
            },
          },
        ],
        async loadMethod({ page, sort }) {
          return mockListData(
            page.pageIndex,
            page.pageSize,
            searchValue.value,
            sort.prop,
            sort.order,
          )
        },
        async loadTree(row, treeNode, resolve) {
          const data = await mockListData(2, 5)
          resolve(data.list)
        },
        handleSelectMony(listIndex) {
          listIndex.forEach((index) => {
            tableDataRef.value.toggleRowSelection(index, true)
          })
        },
        handleClearSelect() {
          tableDataRef.value.clearSelection()
        },
        handleSelectionChange(e) {
          console.log('handleSelectionChange', e)
        },
        handleCurrentChange(e) {
          console.log('handleCurrentChange', e)
        },
        handleSortChange(e) {
          console.log('handleSortChange', e)
        },
      }
    },
  })
</script>

```
:::
