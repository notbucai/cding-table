import { mount as _mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import TableData from '../components/table-data.vue'
import flushPromises from 'flush-promises'

window.ResizeObserver =
window.ResizeObserver ||
jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}))

const mount = (opt: any) =>
  _mount<any>(opt, {
    // attachTo: 'body',
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

describe('Table.vue', () => {

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
    })
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
      )
      const testDataArr = getTestData().flatMap(cur => {
        return Object.values(cur).map(String)
      })
      expect(cells).toEqual(testDataArr)
      wrapper.unmount()
    })
  })

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

  })

})
