/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-08-20 09:43:59
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-23 16:17:42
 * @Description: 1
 */
export type objAny = { [key: string]: any; };
export interface ColumnType {
  prop?: string
  label?: string
  width?: string | number
  fixed?: boolean | 'left' | 'right'
  showOverflowTooltip?: boolean
  type?: string
  filters?: objAny
  align?: 'left' | 'right' | 'center'
  headerAlign?: 'left' | 'right' | 'center'
  index?: (index?: number) => any
  filterMethod?: (value?: any, row?: any, column?: any) => boolean
  sortable?: string | boolean
  children?: ColumnType[]
  formatter?: (row?: any, column?: any, cellValue?: any, index?: number) => any
  renderHeader?: ({ column: any, $index: number }) => any
  render?: ({ row: objAny, column: any, $index: number }) => any
}
