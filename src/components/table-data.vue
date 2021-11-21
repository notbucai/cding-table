<template>
  <div class="cding-table-data">
    <el-table
      ref="tableRef"
      v-loading="loading"
      v-bind="config"
      :size="size"
      :data="tableData.list"
      :load="private_handleLoadTree"
      style="width: 100%"
      @selection-change="private_handleSelectionChange"
      @current-change="private_handleCurrentChange"
      @sort-change="private_handleSortChange"
    >
      <table-data-column v-for="(item, index) in columns" :key="index" :column="item" />
    </el-table>
    <div style="margin-top: 10px">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :layout="pagination.layout"
        :total="tableData.total"
        :background="pagination.background"
        @size-change="pagination.sizeChange"
        @current-change="pagination.currentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  CSSProperties,
  onMounted, PropType, reactive, ref,
} from 'vue'
import { ElTable, ElPagination, ElLoading } from 'element-plus'
import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults'
import { ColumnCls, ColumnStyle, TreeNode } from 'element-plus/lib/el-table/src/table/defaults'
import TableDataColumn from './table-data-column'
import { ColumnType } from './types'
type SummaryMethod<T> = (data: {
  columns: TableColumnCtx<T>
  data: T[]
}) => string[]

interface Sort {
  prop: string
  order: 'ascending' | 'descending'
  init?: any
  silent?: any
}

type CellCls<T> =
  | string
  | ((data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) => string)
type CellStyle<T> =
  | CSSProperties
  | ((data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) => CSSProperties)


export interface ConfigType<T> {
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
};

export default {
  name: 'CdingTable',
  components: {
    ElTable,
    ElPagination,
    TableDataColumn,
  },
  directives: {
    loading: ElLoading.directive,
  },
  props: {
    size: {
      type: String as PropType<'mini' | 'medium' | 'small'>,
      default: 'medium',
    },
    config: {
      type: Object as PropType<ConfigType<any>>,
    },
    initLoad: {
      type: Boolean,
      default: true,
    },
    loadMethod: {
      required: true,
      type: Function as PropType<(event: { page: { pageIndex: number; pageSize: number; }; sort?: { [key: string]: any; }; }) => Promise<{
        total: number
        list: any[]
      }>>,
    },
    loadTree: {
      type: Function as PropType<(row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void>,
    },
    columns: {
      type: Object as PropType<ColumnType[]>,
    },
  },
  emits: ['selection-change', 'current-change'],
  setup (props, { emit }) {
    const loading = ref(false)
    const tableRef = ref(null)
    const sortData = ref({})

    const pagination = reactive({
      currentPage: 1,
      pageSize: 20,
      pageSizes: [10, 20, 30, 40, 50, 100],
      background: true,
      layout: 'sizes, prev, pager, next, slot, jumper, ->, total',
      sizeChange (value: number) {
        pagination.pageSize = value
        loadData()
      },
      currentChange (value: number) {
        pagination.currentPage = value
        loadData()
      },
    })
    const tableData = reactive({
      list: [],
      total: 10,
    })

    const loadData = async () => {
      loading.value = true
      const { total, list } = await props.loadMethod({
        page: {
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        },
        sort: sortData.value,
      }).finally(() => {
        loading.value = false
      })
      tableData.total = total
      tableData.list = list
    }

    onMounted(async () => {
      if (props.initLoad) {
        loadData()
      }
    })

    return {
      loading,
      tableRef,
      tableData,
      pagination,
      private_handleSelectionChange (e: any[]) {
        emit('selection-change', e)
      },
      private_handleCurrentChange (e: any[]) {
        emit('current-change', e)
      },
      private_handleSortChange ({ column, prop, order }) {
        const sort: { [key: string]: any; } = {}
        if (prop) {
          sort.prop = order
        }
        sortData.value = sort
        emit('current-change', { column, prop, order })
        loadData()
      },
      private_handleLoadTree (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) {
        if (props.loadTree) {
          return props.loadTree(row, treeNode, resolve)
        }
      },
      toggleRowSelection (index: number, selected: boolean) {
        return tableRef.value.toggleRowSelection(tableData.list[index], selected)
      },
      clearSelection () {
        return tableRef.value.clearSelection()
      },
      loadData () {
        pagination.currentPage = 1
        return loadData()
      },
      refreshData () {
        return loadData()
      },
    }
  },
}

</script>

<style lang="scss" scoped>
.cding-table-data {
  color: #ccc;
}
</style>
