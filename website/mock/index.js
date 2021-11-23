/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-11-23 13:32:50
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-23 15:20:58
 * @Description:
 */
let data = []

export async function mockListData (pageIndex, pageSize, searchText, sortProp, sortOrder, filterProp, filterValue) {
  const start = (pageIndex - 1) * pageSize
  const end = pageIndex * pageSize

  if (data.length === 0) {
    // 加载远程数据
    const remoteMockData = await fetch('/data.json')
      .then(res => res.json())
    data = remoteMockData
  }

  return {
    list: data
      .sort((a, b) => {
        if (sortOrder === 'ascending') {
          return a[sortProp] > b[sortProp] ? 1 : -1
        } else {
          return a[sortProp] > b[sortProp] ? -1 : 1
        }
      })
      .filter(item => {
        return item.name.includes(searchText || '')
      })
      .filter(item => {
        const fv = (filterValue || [])
        if (fv.length === 0) {
          return true
        }
        return fv.includes(item[filterProp])
      })
      .slice(start, end),
    total: data.length,
  }
}
