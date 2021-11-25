# Cding Table 属性事件和方法

## 属性

| 属性名      | 必填 | 说明                                                                                                                                 | 类型                                                                    | 可选值                | 默认值 |
| ----------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | --------------------- | ------ |
| load-method | 必填 | 数据加载函数，外部传入内部调用                                                                                                       | (params: [LoadParmasType](#LoadParmasType)) => [LoadResultType](#LoadResultType)                              | -                     | -      |
| load-tree   | 可选 | 树结构 子数据加载                                                                                                                    | (row: any, treeNode: [TreeNode](#TreeNode), resolve: (data: any[]) => void ) => void | -                     | true   |
| columns     | 必填 | 数据对应的列名列表                                                                                                                   | Array&lt;[ColumnType](#ColumnType)[]&gt;                                               | -                     | -      |
| config      | 可选 | CdingTable 配置，大部分可参考[Element Plus Table](https://element-plus.gitee.io/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7) | [ConfigType](#ConfigType)                                                              | -                     | -      |
| init-load   | 可选 | 是否初始化加载                                                                                                                       | boolean                                                                 | -                     | true   |
| size        | 可选 | table 大小                                                                                                                           | string                                                                  | mini / medium / small | medium |

## 事件

| 事件名           | 说明                         | 回调参数                                  |
| ---------------- | ---------------------------- | ----------------------------------------- |
| sort-change      | 排序变化                     | { column: [ColumnType](#ColumnType), order: asc / desc } |
| current-change   | 当前行被改变，点击后高亮显示 | { currentPage: number, pageSize: number } |
| selection-change | 选中项变化                   | { selection: any[] }                      |

## 方法

调用方法前，请先通过 ref 获取到组件实例，然后调用方法，如：`this.$refs.cdingTable.loadData()`

| 方法名             | 说明                                        | 类型                                       |
| ------------------ | ------------------------------------------- | ------------------------------------------ |
| loadData           | 获取数据 (pageIndex = 1)                    | () => Promise&lt;void&gt;                  |
| refreshData        | 刷新数据数据 (pageIndex = currentPageIndex) | () => Promise&lt;void&gt;                  |
| clearSelection     | 清空选中                                    | () => void                                 |
| toggleRowSelection | 改变指定行的选中状态                        | (index: number, selected: boolean) => void |

## 类型

### LoadParmasType

| 参数 | 说明 | 类型     |
| ---- | ---- | -------- |
| page | 进度 | [PageType](#PageType) |
| sort | 排序 | [SortType](#SortType) |

#### PageType

| 参数      | 说明     | 类型   |
| --------- | -------- | ------ |
| pageIndex | 页码     | number |
| pageSize  | 每页大小 | number |

#### SortType

| 参数  | 说明     | 类型   |
| ----- | -------- | ------ |
| order | 排序方式 | string |
| prop  | 列名     | string |

### LoadResultType

| 参数  | 说明 | 类型   |
| ----- | ---- | ------ |
| total | 总数 | number |
| list  | 数据 | any[]  |

### TreeNode

| 参数           | 说明             | 类型    |
| -------------- | ---------------- | ------- |
| expanded       | 是否展开         | boolean |
| loading        | 是否加载中       | boolean |
| noLazyChildren | 是否懒加载子节点 | boolean |
| indent         | 缩进             | number  |
| level          | 层级             | number  |
| display        | 是否显示         | boolean |

### ColumnType

| 参数                | 说明             | 类型                                                              |
| ------------------- | ---------------- | ----------------------------------------------------------------- |
| prop                | 列名             | string                                                            |
| label               | 列名             | string                                                            |
| width               | 宽度             | string                                                            |
| fixed               | 固定             | boolean                                                           |
| showOverflowTooltip | 是否显示溢出提示 | boolean                                                           |
| type                | 类型             | string                                                            |
| filters             | 筛选             | objAny                                                            |
| align               | 对齐             | string                                                            |
| headerAlign         | 对齐             | string                                                            |
| index               | 索引             | (index?: number) => any                                           |
| filterMethod        | 筛选方法         | (value?: any, row?: any, column?: any) => boolean                 |
| sortable            | 是否可排序       | string                                                            |
| children            | 子列             | ColumnType[]                                                      |
| formatter           | 格式化           | (row?: any, column?: any, cellValue?: any, index?: number) => any |
| renderHeader        | 渲染头部         | ({ column: any, $index: number }) => any                          |
| render              | 渲染             | ({ row: objAny, column: any, $index: number }) => any             |

### ConfigType

| 参数                  | 说明                 | 类型                                                                      |
| --------------------- | -------------------- | ------------------------------------------------------------------------- |
| stripe                | 是否显示斑马纹       | boolean                                                                   |
| height                | 高度                 | string                                                                    |
| maxHeight             | 最大高度             | string                                                                    |
| size                  | 大小                 | string                                                                    |
| width                 | 宽度                 | string                                                                    |
| fit                   | 是否自适应           | boolean                                                                   |
| border                | 是否显示边框         | boolean                                                                   |
| rowKey                | 行 key               | string                                                                    |
| showHeader            | 是否显示表头         | boolean                                                                   |
| showSummary           | 是否显示汇总         | boolean                                                                   |
| sumText               | 汇总文本             | string                                                                    |
| summaryMethod         | 汇总方法             | (data: T[]) => any                                                        |
| rowClassName          | 行 className         | (row: T, index: number) => string                                         |
| rowStyle              | 行样式               | (row: T, index: number) => CSSProperties                                  |
| cellClassName         | 单元格 className     | (row: T, column: TableColumnCtx&lt;T&gt;, index: number) => string        |
| cellStyle             | 单元格样式           | (row: T, column: TableColumnCtx&lt;T&gt;, index: number) => CSSProperties |
| headerRowClassName    | 表头行 className     | (column: TableColumnCtx&lt;T&gt;, index: number) => string                |
| headerRowStyle        | 表头行样式           | (column: TableColumnCtx&lt;T&gt;, index: number) => CSSProperties         |
| headerCellClassName   | 表头单元格 className | (column: TableColumnCtx&lt;T&gt;, index: number) => string                |
| headerCellStyle       | 表头单元格样式       | (column: TableColumnCtx&lt;T&gt;, index: number) => CSSProperties         |
| highlightCurrentRow   | 是否高亮当前行       | boolean                                                                   |
| currentRowKey         | 当前行 key           | string                                                                    |
| emptyText             | 空文本               | string                                                                    |
| expandRowKeys         | 展开行 key           | any[]                                                                     |
| defaultExpandAll      | 是否默认展开所有行   | boolean                                                                   |
| defaultSort           | 默认排序             | Sort                                                                      |
| tooltipEffect         | 提示框出现位置       | string                                                                    |
| selectOnIndeterminate | 是否选中空白         | boolean                                                                   |
| indent                | 缩进                 | number                                                                    |
| treeProps             | 树属性               | { hasChildren: string, children: string }                                 |
| lazy                  | 是否懒加载           | boolean                                                                   |
| load                  | 加载                 | (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void        |
| className             | className            | string                                                                    |
| style                 | 样式                 | CSSProperties                                                             |
