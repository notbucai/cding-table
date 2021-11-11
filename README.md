# cding-table

This is an element-Puls table component that can be configured to perform complex operations on the table.

<p>
    <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/notbucai/cding-table">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/notbucai/cding-table">
    <img alt="GitHub" src="https://img.shields.io/github/license/notbucai/cding-table">
    <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/notbucai/cding-table">
</p>

## 🤪 Installing

### NPM

```bash
$ npm install cding-table
```

### Yarn

```bash
$ yarn add cding-table
```

## 😵 Usage

```javascript
// 导入 cding-table
import { TableData } from 'cding-table'

const columns = [
  {
    prop: 'id',
  }, {
    prop: 'name',
    label: '片名',
  }, {
    prop: 'release',
    label: '发行日期',
  },
  {
    prop: 'director',
    label: '导演',
  },
  {
    prop: 'runtime',
    label: '时长（分）',
  },
];

async function loadMethod ({ page, sort }) {
  return new Promise(r => {
    setTimeout(() => {
      r(1)
    }, 300)
  }).then(() => {
    return {
      total: 100,
      list: [
        {
          id: 1,
          name: 'Toy Story',
          release: '1995-11-22',
          director: 'John Lasseter',
          runtime: 80,
        },
        {
          id: 2,
          name: "A Bug's Life",
          release: '1998-11-25',
          director: 'John Lasseter',
          runtime: 95,
        },
      ]
    }
  })
}
// 使用
<table-data :columns="columns" :load-method="loadMethod" />
```

## 🌚 Options

> 注意：Options 暂时不做二级对象的合并只做替换，如果需要修改子对象请完整替换。

```ts
type Options = {
  stripe?: boolean
  height?: string | number
  maxHeight?: string | number
  size?: string
  width?: string | number
  fit?: boolean
  border?: boolean
  rowKey?: string | ((row: T) => string)
  showHeader?: boolean
  showSummary?: boolean
  sumText?: string
  summaryMethod?: SummaryMethod<T>
  rowClassName?: ColumnCls<T>
  rowStyle?: ColumnStyle<T>
  cellClassName?: CellCls<T>
  cellStyle?: CellStyle<T>
  headerRowClassName?: ColumnCls<T>
  headerRowStyle?: ColumnStyle<T>
  headerCellClassName?: CellCls<T>
  headerCellStyle?: CellStyle<T>
  highlightCurrentRow?: boolean
  currentRowKey?: string | number
  emptyText?: string
  expandRowKeys?: any[]
  defaultExpandAll?: boolean
  defaultSort?: Sort
  tooltipEffect?: string
  spanMethod?: (data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) =>
    | number[]
    | {
      rowspan: number
      colspan: number
    }
  selectOnIndeterminate?: boolean
  indent?: number
  treeProps?: {
    hasChildren?: string
    children?: string
  }
  lazy?: boolean
  load?: (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void
  className?: string
  style?: CSSProperties
}
```