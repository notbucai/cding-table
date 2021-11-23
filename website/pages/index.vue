<template>
  <div class="index-page">
    <div class="project-desc">
      <div class="title">
        <h1>表格快速成型工具</h1>
      </div>
      <div class="content">
        <p>
          Cding Table，一个为开发者准备的基于 Vue 3.0 和 Element Plus
          的数据表格组件库
        </p>
      </div>
      <div class="pic">
        <img
          src="../assets/images/home-pic.png"
          alt=""
          @mousemove="onPicMousemove"
        />
      </div>
    </div>

    <div style="margin-bottom: 20px">
      <el-button
        type="primary"
        size="mini"
        @click="handleSelectMony([1, 3])"
        >选中2和4</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="handleSelectMony([0])"
        >选中1</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="handleClearSelect()"
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
import { defineComponent, ref,watch } from 'vue'
import { mockListData } from '../mock'

export default defineComponent({
  components: {
  },
  setup () {
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
      onPicMousemove (e: any) {
        const { offsetWidth, offsetHeight } = e.target
        const { offsetX, offsetY } = e
        const w2 = offsetWidth / 2
        const h2 = offsetHeight / 2
        const x = (offsetX - w2) / w2
        const y = (offsetY - h2) / h2
        const scale = 1 + Math.sqrt(x * x + y * y) / 2 * 0.02
        const rotateX = x
        const rotateY = y
        const transform = `scale(${scale}) rotateY(${rotateX / 2}deg) rotateZ(${rotateY / 2}deg)`
        e.target.style.transform = transform
      },
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
            if(index === 0){
              return '合计'
            }
            if(!['money'].includes(column.property)){
              return ''
            }
            const values = data.map(item => Number(item[column.property]))
            return values.reduce((prev, curr) => {
              const value = typeof curr === 'number' ? curr : 0
              return prev + value
            }, 0).toFixed(2)
          })

          return sums
        },
      },
      columns: [
        {
          type: 'expand',
          fixed: true,
          render ({ row, column, $index }) {
            return (
              <div style={{ padding: '10px' }}>
                <p>名称: {row.name}</p>
              </div>
            )
          },
        },
        {
          type: 'selection',
          width: 40,
          fixed: true,
        },
        {
          type: 'index',
          width: 40,
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
          label:'钱包',
          children:[
            {
              label: '用户名',
              prop: 'name',
              width: '100px',
              sortable: 'custom',
              filters: [{ text: '不才', value: '不才' }, { text: '吴强强', value: '吴强强' }],
              formatter (row) {
                return row.editing ? <el-input size="mini" vModel={row.name} /> : row.name
              },
            },
            {
              label: '余额',
              prop: 'money',
              width: '80px',
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
            },
            {
              label: '市区',
              prop: 'city',
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
          width: '150px',
        },
        {
          label: '状态',
          prop: 'status',
          width: '100px',
          align: 'center',
          // fixed: 'right',
          filters: [{ text: '正常', value: 0 }, { text: '提示', value: 1 }, { text: '异常', value: 2 }, { text: '冻结', value: 3 }],
          formatter (row: any) {
            return row.editing
              ?
              (
                <el-select size="mini" vModel={row.status}>
                  {
                    [0,1,2,3].map(item=>(
                      <el-option
                        key={item}
                        label={['正常','提示','异常','冻结'][item]}
                        value={item}
                      >
                      </el-option>
                    ))
                  }
                </el-select>
              )
              :
              <el-tag type={['success','info','warning', 'danger'][row.status]}>{['正常','提示','异常','冻结'][row.status]}</el-tag>
          },
        },
        {
          label: '',
          width: 160,
          fixed: 'right',
          renderHeader ({ }) {
            return <el-input vModel={searchValue.value} size="mini" placeholder="请输入关键词" type="text" />
          },
          formatter (row) {
            return <div>
              <el-button
                size="mini"
                onClick={() => {
                  row.editing = !row.editing
                }}>{!row.editing ? '编辑' : '保存'}</el-button>
              <el-button plain size="mini" type="danger">删除</el-button>
            </div>
          },
        },
      ],
      async loadMethod ({ page, sort }) {
        return mockListData(page.pageIndex, page.pageSize, searchValue.value, sort.prop, sort.order)
      },
      async loadTree (row, treeNode, resolve) {
        const data = await mockListData(2,5)
        resolve(data.list)
      },
      handleSelectMony (listIndex) {
        listIndex.forEach(index => {
          tableDataRef.value.toggleRowSelection(index, true)
        })
      },
      handleClearSelect () {
        tableDataRef.value.clearSelection()
      },
      handleSelectionChange (e) {
        console.log('handleSelectionChange', e)
      },
      handleCurrentChange (e) {
        console.log('handleCurrentChange', e)
      },
      handleSortChange (e) {
        console.log('handleSortChange',e)
      },
    }
  },
})

</script>

<style lang="scss" scoped>
.index-page {
  width: 1140px;
  margin: 0 auto;
  .project-desc {
    text-align: center;
    .content {
      color: #555555;
    }
    .pic {
      width: 820px;
      margin: 36px auto;
      img {
        width: 100%;
        transition: 0.1s;
      }
    }
  }
}
</style>
