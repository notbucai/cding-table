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
        <img src="../assets/images/home-pic.png" alt="" />
      </div>
    </div>
    <TableData
      ref="tableDataRef"
      size="mini"
      :load-method="loadMethod"
      :load-tree="loadTree"
      :columns="columns"
      :config="config"
      @sort-change="handleSortChange"
      @current-change="handleCurreentChange"
      @selection-change="handleSelectionChange"
    />
    <div style="margin-top: 20px">
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
    <p>
      {{ data.a }}-
      {{ data.b.c }}
    </p>
    <p>
      {{ data1.a }}-
      {{ data1.b.c }}
      {{ data1.b.c.e }}
    </p>
    <button @click="test">test</button>
  </div>
</template>

<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  components: {
  },
  setup () {
    const tableDataRef = ref(null)
    const editStatus = ref(false)
    const list = [
      {
        id: 1,
        date: '2016-05-02',
        name: '王小虎 async',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        hasChildren: true,
      },
      {
        id: 2,
        date: '2016-05-02',
        name: '王小虎 sync',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        children: [{
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
        }],
      },
      {
        id: 13,
        date: '2016-05-02',
        name: 'joy',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
      },
      {
        id: 23,
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        status: 2,
      },
      {
        id: 22,
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        status: 2,
      },
      {
        id: 29,
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        status: 1,
      },
    ]

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
      },
      columns: [
        {
          type: 'expand',
          render ({ row, column, $index }) {
            return <p>name: {row.name}</p>
          },
        },
        {
          type: 'selection',
          width: 80,
        },
        {
          type: 'index',
          width: 80,
          label: '#',
        },
        {
          label: '名称',
          prop: 'name',
          width: '',
          sortable: 'custom',
          filters: [{ text: 'box', value: 'box' }, { text: 'joy', value: 'joy' }],
          filterMethod (value, row, column) {
            const property = column['property']
            return row[property] === value
          },
          formatter (row) {
            return editStatus.value ? <el-input vModel={row.name} /> : row.name
          },
        },
        {
          label: '地址',
          sortable: 'custom',
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
        {
          label: '时间',
          prop: 'date',
          width: '',
          formatter (row) {
            return (
              <el-checkbox-group vModel={row.name}>
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
              </el-checkbox-group>
            )
          },
        },
        {
          label: 'zip',
          prop: 'zip',
          width: '',
        },
        {
          label: '状态',
          props: 'status',
          formatter (row) {
            return row.status ? <el-tag type={row.status === 1 ? 'success' : 'danger'}>{row.status}</el-tag> : ''
          },
        },
        {
          label: '操作',
          width: 200,
          renderHeader ({ column, $index }) {
            return <el-input size="mini" placeholder="请输入关键词" type="text" />
          },
          formatter (row) {
            return <div>
              <el-button
                size="mini"
                onClick={() => {
                  editStatus.value = !editStatus.value
                }}>{!editStatus.value ? '编辑' : '保存'}</el-button>
              <el-button plain size="mini" type="danger">删除</el-button>
            </div>
          },
        },
      ],
      async loadMethod ({ page, sort }) {
        console.log('page, sort', page, sort)

        return new Promise(r => {
          setTimeout(() => {
            r(1)
          }, 300)
        }).then(() => {
          return {
            total: 100,
            list,
          }
        })
      },
      loadTree (row, treeNode, resolve) {
        setTimeout(() => {
          resolve([
            {
              id: 131,
              date: '2016-05-02',
              name: 'box',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200333,
            },
            {
              id: 232,
              date: '2016-05-02',
              name: 'jay',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200333,
              status: 2,
            },
          ])
        }, 1000)
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
        console.log('e', e)
      },
      handleCurreentChange (e) {
        console.log('e', e)
      },
      handleSortChange (e) {
        console.log(e)
      },
      data: ref({
        a: 1,
        b: {
          c: 2,
        },
      }),
      data1: reactive({
        a: 1,
        b: {
          c: 2,
        },
      }),
      test () {
        console.log(this.data1)
        this.data1.b.c = {
          e: 2,
        }

        setTimeout(() => {
          this.data1.b.c.e = 4
        }, 1000)
      },
    }
  },
});

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
      }
    }
  }
}
</style>
