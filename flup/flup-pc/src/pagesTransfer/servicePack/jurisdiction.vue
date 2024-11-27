//批量设置权限
<template>
  <div class="container">
    <div class="cddht">
      <el-button type="primary" @click="tj">添加随访组权限</el-button>
      <el-form label-width="80px">
        <el-form-item label="所属医院">
          <el-select v-model="hospitalId" placeholder="请选择活动区域" @change="changeHospital">
            <el-option
              v-for="item in hospitalList"
              :key="item.serial_no"
              :value="item.serial_no"
              :label="item.hospital_name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="listbox flex">
      <div style="flex: 1;">
        <div class="flex" style="justify-content: space-between;padding-bottom:10px">
          <h3>用户列表</h3>
          <el-input
            style="width:200px"
            placeholder="请输入关键字查询"
            v-model="keyword"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="cx"></el-button>
          </el-input>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row
          @cell-click="guanlian"
        >
          <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
          <el-table-column prop="userName" label="登录名"></el-table-column>
          <el-table-column prop="realName" label="姓名"></el-table-column>
          <el-table-column prop="mobilephone" label="电话"></el-table-column>
        </el-table>
        <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          layout="total,sizes,prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <div style="flex: 1;padding-left:20px">
        <h3 style="height:40px">随访组列表</h3>
        <el-table
          :data="tableDatav2"
          border
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
          <el-table-column prop="groupName" label="随访组名称"></el-table-column>
          <el-table-column prop="deptName" label="科室"></el-table-column>
          <el-table-column prop="groupType" label="随访类别">
            <template slot-scope="scope">{{scope.row.groupType==0?"随访":'慢病'}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: null,
      hospitalId: null,
      pageSize: 10,
      pageNo: 1,
      total: 0,
      pageSizev2: 999,
      pageNov2: 1,
      totalv2: 0,
      tableData: [],
      tableDatav2: [],
      hospitalList: [],
      userId: null,
      userName: null,
      mobilephone: null,
      realName: null,
      multipleSelection: [],
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.$apis.hospitalgetAllHospitals().then((res) => {
      this.hospitalList = res || []
    })
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.getquerygetUsersByHospitalId4Page()
    this.getgroupgetFlupGroupList()
  },
  methods: {
    tj() {
      let arr = []
      this.multipleSelection.forEach((res) => {
        arr.push(res.serialNo)
      })
      this.$apis
        .groupmodifyUserFlupGroup({
          groupIds: arr,
          userId: this.userId,
          userName: this.userName,
          mobilephone: this.mobilephone,
          realName: this.realName,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          if (res) {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
            })
          }
        })
    },
    changeHospital() {
      this.getquerygetUsersByHospitalId4Page()
      this.getgroupgetFlupGroupList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getgroupgetFlupGroupList() {
      this.$apis
        .groupgetFlupGroupList({
          hospitalId: this.hospitalId,
          pageNo: this.pageNov2,
          pageSize: this.pageSizev2,
        })
        .then((res) => {
          this.tableDatav2 = res.list
          this.totalv2 = res.total
        })
    },
    guanlian(row) {
      this.userId = row.serialNo
      this.userName = row.userName
      this.mobilephone = row.mobilephone
      this.realName = row.realName
      this.getgroupgetFlupGroupByUserId()
    },
    cx() {
      this.pageNo = 1
      this.getquerygetUsersByHospitalId4Page()
    },
    getquerygetUsersByHospitalId4Page() {
      this.$apis
        .querygetUsersByHospitalId4Page({
          hospitalId: this.hospitalId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyword: this.keyword,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
        })
    },
    getgroupgetFlupGroupByUserId() {
      this.$apis
        .groupgetFlupGroupByUserId({ userId: this.userId })
        .then((res) => {
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          for (let i in this.tableDatav2) {
            for (let j in res) {
              if (this.tableDatav2[i].groupName == res[j].groupName) {
                this.$refs.multipleTable.toggleRowSelection(this.tableDatav2[i])
                this.multipleSelection.push(this.tableDatav2[i])
              }
            }
          }
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getquerygetUsersByHospitalId4Page()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getquerygetUsersByHospitalId4Page()
    },
  },
}
</script>

<style style lang="scss"  scoped>
.cddht {
  padding: 10px 20px 0px 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
}
.listbox {
  padding: 20px 0;
}
</style>