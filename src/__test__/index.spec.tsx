import { mount as _mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import TableData from '../components/table-data.vue'
import flushPromises from 'flush-promises'
import { ElPagination } from 'element-plus'

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }))

const mount = (opt: any) =>
  _mount<any>(opt, {
    attachTo: 'body',
  })

function getTestData () {
  return [
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
    {
      id: 3,
      name: 'Toy Story 2',
      release: '1999-11-24',
      director: 'John Lasseter',
      runtime: 92,
    },
    {
      id: 4,
      name: 'Monsters, Inc.',
      release: '2001-11-2',
      director: 'Peter Docter',
      runtime: 92,
    },
    {
      id: 5,
      name: 'Finding Nemo',
      release: '2003-5-30',
      director: 'Andrew Stanton',
      runtime: 100,
    },
  ]
}



describe('rendering data is correct', () => {
  const wrapper = mount({
    components: {
      TableData,
    },
    template: `
  <template>
  <table-data :columns="columns" :load-method="loadMethod" />
  </template>
  `,
    created () {
      this.columns = [
        {
          type: 'expand',
          render ({ row, column, $index }) {
            return <p>name: {row.name}</p>
          },
        },
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
      ]
    },
    methods: {
      async loadMethod ({ }) {
        return new Promise(r => {
          r(1)
        }).then(() => {
          return {
            total: 100,
            list: getTestData(),
          }
        })
      },
    },
  });
  it('head', async () => {
    await nextTick()
    const ths = wrapper.findAll('thead th')
    expect(
      ths.map(node => node.text()).filter(o => o),
    ).toEqual(
      ['片名', '发行日期', '导演', '时长（分）'],
    )
  })
  it('row length', async () => {

    expect(
      wrapper.findAll('.el-table__body-wrapper tbody tr').length,
    ).toEqual(getTestData().length)
  })
  it('row data', () => {
    const cells = wrapper.findAll('td .cell').map(node =>
      node.text(),
    ).filter(item=>item)
    const testDataArr = getTestData().flatMap(cur => {
      return Object.values(cur).map(String)
    })
    expect(cells).toEqual(testDataArr)
  })

  afterAll(() => {
    wrapper.unmount()
  })
});

describe('Table.vue', () => {

  it('custom template', async () => {
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data :columns="columns" :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'id',
          },
          {
            label: 'someLabel',
            formatter (row) {
              return <div class="checkbox-group">
                <input type="checkbox" name="checkBoxTest" value='0' checked={row.checkList.includes('1')} />北京
                <input type="checkbox" name="checkBoxTest" value='1' checked={row.checkList.includes('2')} />上海
                <input type="checkbox" name="checkBoxTest" value='2' checked={row.checkList.includes('3')} />广州
              </div>
            },
          },
        ]
      },
      data () {
        return {
          list: [
            {
              checkList: [],
            },
            {
              checkList: ['1'],
            },
            {
              checkList: ['1', '2'],
            },
          ],
        }
      },
      methods: {
        async loadMethod ({ }) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 100,
              list: this.list,
            }
          })
        },
      },
    })
    const vm = wrapper.vm
    await nextTick()
    await flushPromises()
    await nextTick()

    const checkGroup = vm.$el.querySelectorAll('.el-table__body-wrapper .checkbox-group')
    expect(checkGroup.length).toBe(3)

    const checkbox = vm.$el.querySelectorAll(
      '.el-table__body-wrapper input[type=checkbox]',
    )

    expect(checkbox.length).toBe(9)

    const checkboxSelect = vm.$el.querySelectorAll(
      '.el-table__body-wrapper input[type=checkbox]:checked',
    )
    expect(checkboxSelect.length).toBe(3)
    wrapper.unmount()
  })

  it('table pagination', async () => {
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data :columns="columns" :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'id',
          },
          {
            prop: 'name',
            label: 'name',
          },
        ]
      },
      data () {
        return {
          list: [],
        }
      },
      methods: {
        async loadMethod ({ }) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
      },
    })
    await flushPromises()
    await nextTick()

    const paginationTotal = wrapper.find('.el-pagination .el-pagination__total')
    const paginationPager = wrapper.find('.el-pagination .el-pager')
    const paginationNextButton = wrapper.find('.el-pagination .btn-next')
    const paginationPrevButton = wrapper.find('.el-pagination .btn-prev')
    const paginationEditInput = wrapper.find('.el-pagination .el-pagination__editor input')
    const paginationSelectTrigger = wrapper.find('.el-pagination .select-trigger')
    //
    expect(paginationTotal.text()).toContain('125')
    expect((paginationEditInput.element as HTMLInputElement).value).toContain('1')
    expect(paginationPrevButton.attributes()['disabled']).not.toBeUndefined()
    expect(paginationPager.findAll('li').length).toBe(7)

    paginationNextButton.trigger('click')
    await nextTick()
    await flushPromises()
    expect(paginationPrevButton.attributes()['disabled']).toBeUndefined()
    expect((paginationEditInput.element as HTMLInputElement).value).toContain('2')

    paginationSelectTrigger.trigger('click')
    await flushPromises()
    await nextTick()

    const paginationDropdownListDocument = document.querySelector('.el-select-dropdown__list')
    const listLength = paginationDropdownListDocument.querySelectorAll('li').length
    expect(listLength).toBe(6)
    const paginationDropdown4Btn = paginationDropdownListDocument.querySelector('li:nth-child(4)') as HTMLElement
    paginationDropdown4Btn.click()
    await nextTick()

    expect(wrapper.find('.el-pagination .el-pager').findAll('li').length).toBe(4)

    wrapper.unmount()
  })

  it('table loadData', async () => {
    const loadMockFn = jest.fn()
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data :columns="columns" ref="table-data" :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'id',
          },
          {
            prop: 'name',
            label: 'name',
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: '22',
              name: '123',
            },
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
            loadMockFn(e)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
      },
    })
    await flushPromises()
    await nextTick()

    const td = wrapper.findComponent({
      ref: 'table-data',
    })
    const paginationNextButton = wrapper.find('.el-pagination .btn-next')

    expect(loadMockFn.mock.instances.length).toBe(1)

    expect(loadMockFn.mock.calls[0][0].page.pageIndex).toBe(1)

    paginationNextButton.trigger('click')
    await nextTick()
    // console.log('loadMockFn.mock',loadMockFn.mock.calls[1][0]);

    expect(loadMockFn.mock.instances.length).toBe(2)
    expect(loadMockFn.mock.calls[1][0].page.pageIndex).toBe(2)
      // 刷新
      ; (td.vm as any).refreshData()
    await nextTick()
    await flushPromises()
    expect(loadMockFn.mock.instances.length).toBe(3)
    expect(loadMockFn.mock.calls[2][0].page.pageIndex).toBe(2)

      // 手动调用刷新
      ; (td.vm as any).loadData()
    await nextTick()
    await flushPromises()
    expect(loadMockFn.mock.instances.length).toBe(4)
    expect(loadMockFn.mock.calls[3][0].page.pageIndex).toBe(1)

    wrapper.unmount()
  })

  it('table cell select', async () => {
    const handleSelectionChange = jest.fn()
    const handleCurrentChange = jest.fn()

    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data :columns="columns" ref="table-data" 
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange" :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'id',
          },
          {
            type: 'selection',
            width: 80,
          },
          {
            prop: 'name',
            label: 'name',
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: '22',
              name: '11',
            },
            {
              id: '33',
              name: '5',
            },
            {
              id: '44',
              name: '44',
            },
            {
              id: '55',
              name: '33',
            },
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
        handleSelectionChange (e) {
          handleSelectionChange(e)
        },
        handleCurrentChange (e) {
          handleCurrentChange(e)
        },
        handleClearSelect () {
          this.$refs['table-data'].clearSelection()
        },
        handleSelectMony () {
          [1, 2, 3].forEach(index => {
            this.$refs['table-data'].toggleRowSelection(index, true)
          })
        },
      },
    })

    await flushPromises()
    await nextTick()
    expect(handleSelectionChange.mock.instances.length).toBe(0)
    expect(handleCurrentChange.mock.instances.length).toBe(0)

    wrapper.find('.el-table__row:nth-child(2)').trigger('click')

    expect(handleCurrentChange.mock.instances.length).toBe(1)
    expect(handleCurrentChange.mock.calls[0][0].id).toBe('33')
    expect(handleSelectionChange.mock.instances.length).toBe(0)

    wrapper.find('.el-table__row:nth-child(3) .el-table__cell .el-checkbox input').trigger('click')

    expect(handleSelectionChange.mock.instances.length).toBe(1)
    expect(handleSelectionChange.mock.calls[0][0].length).toBe(1)
    expect(handleSelectionChange.mock.calls[0][0][0].id).toBe('44')

    wrapper.find('.el-table__row:nth-child(2) .el-table__cell .el-checkbox input').trigger('click')
    expect(handleSelectionChange.mock.instances.length).toBe(2)
    expect(handleSelectionChange.mock.calls[1][0].length).toBe(2)
    wrapper.vm.handleClearSelect()

    await nextTick()
    expect(handleSelectionChange.mock.instances.length).toBe(3)
    expect(handleSelectionChange.mock.calls[2][0].length).toBe(0)

    // 手动选择
    wrapper.vm.handleSelectMony()
    await nextTick()
    expect(handleSelectionChange.mock.calls[handleSelectionChange.mock.calls.length - 1][0].length).toBe(3)

    wrapper.unmount()
  })

  it('table sort', async () => {
    const handleSortChange = jest.fn()
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data :columns="columns" ref="table-data" 
          @sort-change="handleSortChange" :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'id',
          },
          {
            type: 'selection',
            width: 80,
          },
          {
            prop: 'name',
            label: 'name',
            sortable: 'custom',
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: '22',
              name: '11',
            },
            {
              id: '33',
              name: '5',
            },
            {
              id: '44',
              name: '44',
            },
            {
              id: '55',
              name: '33',
            },
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
        handleSortChange (e) {
          handleSortChange(e)
        },
      },
    })

    await flushPromises()
    await nextTick()
    wrapper.find('.caret-wrapper .ascending').trigger('click')
    await nextTick()
    expect(handleSortChange.mock.instances.length).toBe(1)
    expect(handleSortChange.mock.calls[0][0].prop).toBe('name')
    expect(handleSortChange.mock.calls[0][0].order).toBe('ascending')


    wrapper.find('.caret-wrapper .descending').trigger('click')
    await nextTick()
    expect(handleSortChange.mock.instances.length).toBe(2)
    expect(handleSortChange.mock.calls[1][0].prop).toBe('name')
    expect(handleSortChange.mock.calls[1][0].order).toBe('descending')

    wrapper.unmount()
  });

  it('table load tree data', async () => {
    const loadTree = jest.fn()
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data 
          ref="table-data"
          :columns="columns"
          :load-tree="loadTree"
          :config="{ treeProps: { children: 'children', hasChildren: 'hasChildren' }, rowKey: 'id', lazy: true }"
          :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'name',
            label: 'name',
            sortable: 'custom',
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: '22',
              name: '11',
              hasChildren: true,
            },
            {
              id: '33',
              name: 'layData',
              children: [
                {
                  id: '314',
                  name: 'box'
                },
                {
                  id: '324',
                  name: '9527'
                }
              ]
            },
            {
              id: '44',
              name: '44',
            },
            {
              id: '55',
              name: '33',
            },
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
        loadTree (row, treeNode, resolve) {
          loadTree(row, treeNode, resolve)
          setTimeout(() => {
            resolve([
              {
                id: 334,
                name: 'box',
              },
              {
                id: 214,
                name: 'jay',
              },
            ]);
          }, 0)
        },
      },
    })

    await flushPromises()
    await nextTick()
    wrapper.find('.el-table__row .el-table__expand-icon').trigger('click')
    await nextTick()
    expect(wrapper.find('.el-table__row:nth-child(3)').text()).toMatch(/box/)

    wrapper.find('.el-table__row:nth-child(2) .el-table__expand-icon').trigger('click')
    await nextTick()
    expect(loadTree.mock.instances.length).toBe(1)
    wrapper.unmount()
  });


  it('table filter', async () => {
    const filterMethod = jest.fn()
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data 
          ref="table-data"
          :columns="columns"
          :load-tree="loadTree"
          :config="{ rowKey: 'id' }"
          :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'name',
            label: 'name',
            filters: [{ text: 'box', value: 'box' }, { text: 'joy', value: 'joy' }],
          },
          {
            prop: 'value',
            label: 'value',
            filters: [{ text: '不才', value: '不才' }, { text: 'test', value: 'test' }],
            filterMethod (value, row, column) {
              filterMethod(value, row, column)
              const property = column['property']
              return row[property].includes(value)
            },
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: '22',
              name: '11',
              value: "不啊升级换代回test看哈老师地方",
            },
            {
              id: '33',
              name: 'layData',
              value: "阿萨德和i就啊可不才是党v纪test国法",
            },
            {
              id: '44',
              name: 'box',
              value: "阿道夫不才好看垃圾恶化",
            },
            {
              id: '55',
              name: 'joy',
              value: "test",
            },
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
      },
    })

    await flushPromises()
    await nextTick()
    wrapper.find('.el-table__column-filter-trigger').trigger('click')
    await nextTick();
    ; (document.querySelector('.el-table-filter[aria-hidden="false"] .el-table-filter__wrap .el-checkbox') as HTMLElement).click()
    await nextTick();
    ; (document.querySelector('.el-table-filter[aria-hidden="false"] .el-table-filter__bottom button') as HTMLElement).click()
    await nextTick()
    expect(wrapper.findAll('.el-table__row').length).toBe(1)

    wrapper.find('.el-table__column-filter-trigger').trigger('click')
    await nextTick();
    ; (document.querySelector('.el-table-filter[aria-hidden="false"] .el-table-filter__bottom button:last-child') as HTMLElement).click()

    await nextTick();
    expect(wrapper.findAll('.el-table__row').length).toBe(4)

    wrapper.find('.el-table__cell:nth-child(2) .el-table__column-filter-trigger').trigger('click')
    await nextTick();

    ; (document.querySelector('.el-table-filter[aria-hidden="false"] .el-table-filter__wrap .el-checkbox') as HTMLElement).click()
    await nextTick();
    ; (document.querySelector('.el-table-filter[aria-hidden="false"] .el-table-filter__bottom button') as HTMLElement).click()

    expect(filterMethod.mock.calls.length).toBeGreaterThan(3)

    wrapper.unmount()
  });


  it('table load tree data', async () => {
    const loadTree = jest.fn()
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data 
          ref="table-data"
          :columns="columns"
          :load-tree="loadTree"
          :config="{ treeProps: { children: 'children', hasChildren: 'hasChildren' }, rowKey: 'id', lazy: true }"
          :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            prop: 'name',
            label: 'name',
            sortable: 'custom',
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: '22',
              name: '11',
              hasChildren: true,
            },
            {
              id: '33',
              name: 'layData',
              children: [
                {
                  id: '314',
                  name: 'box'
                },
                {
                  id: '324',
                  name: '9527'
                }
              ]
            },
            {
              id: '44',
              name: '44',
            },
            {
              id: '55',
              name: '33',
            },
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
        loadTree (row, treeNode, resolve) {
          loadTree(row, treeNode, resolve)
          setTimeout(() => {
            resolve([
              {
                id: 334,
                name: 'box',
              },
              {
                id: 214,
                name: 'jay',
              },
            ]);
          }, 0)
        },
      },
    })

    await flushPromises()
    await nextTick()
    wrapper.find('.el-table__row .el-table__expand-icon').trigger('click')
    await nextTick()
    expect(wrapper.find('.el-table__row:nth-child(3)').text()).toMatch(/box/)

    wrapper.find('.el-table__row:nth-child(2) .el-table__expand-icon').trigger('click')
    await nextTick()
    expect(loadTree.mock.instances.length).toBe(1)
    wrapper.unmount()
  });


  it('table children columns', async () => {
    const wrapper = mount({
      components: {
        TableData,
      },
      template: `
      <template>
        <div>
          <table-data 
          ref="table-data"
          :columns="columns"
          :load-tree="loadTree"
          :config="{ rowKey: 'id' }"
          :load-method="loadMethod" />
        </div>
      </template>
      `,
      created () {
        this.columns = [
          {
            label: '地址',
            children: [
              {
                label: '省份',
                prop: 'province',
              },
              {
                label: '市区',
                prop: 'city',
              },
              {
                label: '地址',
                prop: 'address',
              },
            ],
          },
        ]
      },
      data () {
        return {
          list: [
            {
              id: 1,
              date: '2016-05-02',
              name: '王小虎 async',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路2 1518 弄',
            },{
              id: 3,
              date: '2016-05-12',
              name: '王小虎1',
              province: '上海2',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200323,
            }, {
              id: 4,
              date: '2016-05-12',
              name: '王小虎1',
              province: '上海2',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200323,
            }
          ],
        }
      },
      methods: {
        async loadMethod (e) {
          return new Promise(r => {
            r(1)
          }).then(() => {
            return {
              total: 125,
              list: this.list,
            }
          })
        },
      },
    })

    await flushPromises()
    await nextTick()
    expect(wrapper.find('.el-table__cell[colspan="3"]').exists()).toBe(true)
    
    expect(wrapper.findAll('.el-table__header tr:nth-child(2) th').length).toBe(3)

    wrapper.unmount()
  });
})
