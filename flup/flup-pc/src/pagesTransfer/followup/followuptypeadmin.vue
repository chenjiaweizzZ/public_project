//随访类型管理
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <el-form class="inquirebox" label-width="80px">
        <el-form-item label="搜索">
          <el-input placeholder="请输入名称查询" v-model="name" class="input-with-select limiting" maxlength="20" show-word-limit>
            <el-button slot="append" icon="el-icon-search" @click="cax"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="随访类型名称"></el-table-column>
      <el-table-column prop="alias" label="类型名称"></el-table-column>
      <el-table-column prop="business" label="随访业务"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ff4949" @change="bc(scope.row)"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageBottom" :page-sizes="[10, 20, 50, 100]" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="total,sizes,prev, pager, next" :total="total"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hospitalId: null,
      name: '',
      tableData: [],
      total: null,
      pageNo: 1,
      pageSize: 10,
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.getflupTypequeryFollowTypeList()
  },
  methods: {
    bc(row) {
      this.$apis
        .flupTypesaveFollowType({
          serialNo: row.serialNo,
          enable: row.enable,
        })
        .then((res) => {
          console.log(res)
        })
      if(row.enable === 1){
        this.$message({
          message: '当前随访类型开启成功',
          type: 'success'
        });
      }else if(row.enable === 0){
        this.$message({
          message: '当前随访类型关闭成功',
          type: 'warning'
        });
      }
    },
    cax() {
      this.pageNo = 1
      this.getflupTypequeryFollowTypeList()
    },
    getflupTypequeryFollowTypeList() {
      this.$apis
        .flupTypequeryFollowTypeList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          name: this.name,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getflupTypequeryFollowTypeList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getflupTypequeryFollowTypeList()
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .indicatorbox {
    border-top: 1px solid #d7dae0;
  }
}
</style>