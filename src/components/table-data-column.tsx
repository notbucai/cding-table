/**
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-20 08:40:13
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-08-25 16:57:06
 * @Description: 1
*/
import { defineComponent } from 'vue'
import { ElTableColumn } from 'element-plus'
import { ColumnType } from './types'

export default defineComponent({
  name: 'CdingTableColumn',
  components: {
    ElTableColumn,
  },
  props: {
    column: Object,
  },
  setup (props) {
    const filterMethod = (value: any, row: any, column: any) => {
      // todo: 释放到 loadMethod，交给开发者处理
      const property = column['property']
      return row[property] === value
    }

    const genRender = (column: ColumnType, key?: any) => {
      const hasChildren = Array.isArray(column.children) && column.children.length
      const isExpand = column.type === 'expand'
      return () => (<>
        {
          <el-table-column
            key={key || column.prop}
            type={column.type}
            index={column.index}
            fixed={column.fixed}
            prop={column.prop}
            label={column.label}
            width={column.width}
            formatter={column.formatter}
            sortable={column.sortable}
            filters={column.filters}
            align={column.align}
            headerAlign={column.headerAlign}
            showOverflowTooltip={column.showOverflowTooltip}
            filter-method={column.filterMethod || (column.filters ? filterMethod : undefined)}
            // slots
            v-slots={{
              default: hasChildren
                ?
                () => {
                  return column.children.map((item: ColumnType, index: number) => genRender(item, index)())
                }
                :
                isExpand ?
                  ({ row, column: _column, $index }) => {
                    return column.render({ row, column: _column, $index })
                  }
                  :
                  undefined,
              header: column.renderHeader,
            }}
          />
        }
      </>)
    }

    return genRender(props.column as ColumnType, props.column.prop)
  },
})
