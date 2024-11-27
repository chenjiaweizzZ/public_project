<template>
  <div class="marginX20">
    <filterHeader @onSearch="onSearch" @onClickLeftBtn="onAdd"></filterHeader>

    <!-- <el-dialog
      v-if="dialogVisible"
      :title="`${serial_no?'编辑':'新增'}医院信息`"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <planForm :serial_no="serial_no" @onCancel="dialogVisible = false" @onSubmit="onSubmit"></planForm>
    </el-dialog>-->
    <el-table style="margin-bottom:60px" :data="list" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip v-for="item in thList" :key="item.value" :label="item.key">
        <template slot-scope="scope">{{scope.row[item.value]}}</template>
      </el-table-column>
      <!-- <el-table-column :width="140" label="操作">
        <template slot-scope="scope">
          <el-button @click="onEdit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button @click="onDele(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <el-pagination v-if="list.length" class="page-custom pageBottom" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageQuery.pageIndex" :page-sizes="[10, 20, 30, 50]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next" :total="total" background></el-pagination>
  </div>
</template>

<script>
import filterHeader from './components/filter_header'
import planForm from './components/plan_form'

export default {
  components: {
    filterHeader,
    planForm,
  },
  data() {
    return {
      thList: [
        { value: 'hospital_name', key: '医院名称' },
        { value: 'hospital_short_name', key: '医院简称' },
        { value: 'level_alias', key: '医院等级' },
        { value: 'organization_code', key: '组织机构编码' },
        { value: 'phone', key: '联系电话' },
      ],
      list: [],
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      query: {
        hospitalName: '',
        hospitalLevel: '',
      },
      dialogVisible: false,
      serial_no: '',
    }
  },
  async created() {
    this.$startLoading()
    await this.getList()
    this.$stopLoading()
  },
  methods: {
    getList() {
      return this.$apis
        .hospitalGetHospitalList({
          ...this.query,
          ...this.pageQuery,
        })
        .then((res) => {
          this.list = res.list
          this.total = res.total
        })
    },
    handleSizeChange(v) {
      this.pageQuery.pageSize = v
      this.pageQuery.pageIndex = 1
      this.getList()
    },
    handleCurrentChange(v) {
      this.getList()
    },
    onSearch(query) {
      this.query = query
      this.pageQuery.pageIndex = 1
      this.getList()
    },
    onAdd() {
      this.serial_no = ''
      this.dialogVisible = true
    },
    onEdit(row) {
      this.serial_no = row.serial_no
      this.dialogVisible = true
    },
    onDele(row) {
      this.$confirm(`确定要删除"${row.hospital_name}"这条数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis
            .hospitalDeleteHospitalBySerialNo(row.serial_no)
            .then(async (res) => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                await this.getList()
                if (!this.list.length && this.pageQuery.pageIndex > 1) {
                  this.pageQuery.pageIndex--
                  this.getList()
                }
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error',
                })
              }
            })
        })
        .catch(() => {})
    },
    onSubmit() {
      this.dialogVisible = false
      this.getList()
    },
  },
}
</script>

<style scoped>
</style>
