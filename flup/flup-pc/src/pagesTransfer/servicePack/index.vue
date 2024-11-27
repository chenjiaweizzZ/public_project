<template>
  <div class="followup-group">
    <operationHeader class="margin-bottom20">
      <div class="label">启用状态</div>
      <el-select
        class="width200 value"
        v-model="state"
        placeholder="启用状态"
        @change="getMainList"
        clearable
      >
        <el-option
          v-for="item in groupTypeList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <div class="label">搜索</div>
      <el-input
        class="width280px value limiting"
        v-model="keyWord"
        placeholder="关键字"
        clearable
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
      </el-input>
      <template v-slot:right>
        <el-button type="primary" @click="onAddGroup" plain>新增</el-button>
      </template>
    </operationHeader>
    <el-table
      ref="table"
      class="margin-top20"
      :data="mainList"
      @current-change="onChangeCurrentGroup"
      highlight-current-row
      border
      stripe
    >
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="packageName" label="服务包名称" width="150"></el-table-column>
      <el-table-column show-overflow-tooltip prop="packageContent" label="服务包"></el-table-column>
      <el-table-column prop="deptName" label="关联科室"></el-table-column>
      <el-table-column show-overflow-tooltip prop="signDoctorList" label="签约负责人员"></el-table-column>
      <el-table-column show-overflow-tooltip prop="price" label="价格(元)"></el-table-column>
      <el-table-column show-overflow-tooltip prop="validityDay" label="有效期(天)"></el-table-column>
      <el-table-column show-overflow-tooltip prop="discountPrice" label="折扣价格(元)"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="discountStartDatetime"
        label="折扣有效期起始"
        :formatter="$utils.formatTableDate('YYYY-MM-DD hh:mm:ss')"
        width="200"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="discountEndDatetime"
        label="折扣有效期截止"
        :formatter="$utils.formatTableDate('YYYY-MM-DD hh:mm:ss')"
        width="200"
      ></el-table-column>
      <el-table-column prop="state" label="有效" width="70">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change="getupdatePackageStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :min-width="100" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click.stop="onEditGroup(scope.row)" type="text">编辑</el-button>
          <el-button @click="onDeleteGroup(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
    <MemberList :item="currentGroup"></MemberList>
    <GroupDialog v-if="dialogVisible" :show.sync="dialogVisible" :data="dailogData"></GroupDialog>
  </div>
</template>

<script>
import MemberList from './components/memberList'
import pagination from '@/mixins/pagination'
// import dept from '@/mixins/deptList'
import GroupDialog from './components/groupDialog'
import MemberDialog from './components/memberDialog'
export default {
  name: 'followup-group',
  mixins: [pagination],
  components: { GroupDialog, MemberDialog, MemberList },
  data() {
    return {
      hospitalId: this.$global.hospital_id,
      state: '',
      keyWord: '',

      query: {
        hospitalId: this.$global.hospital_id,
        groupType: '',
        keyword: '',
        dept: '',
      },
      deptOptions: [],
      memberList: [],
      mainList: [],
      hospitalList: [],
      groupTypeList: [
        { label: '启用', value: 1 },
        { label: '不启用', value: 0 },
      ],
      currentDialog: '',
      dialogVisible: false,
      dailogData: '',
      currentGroup: null,
      PackageTypeList: [],
    }
  },
  async created() {
    this.$startLoading()
    // await this.$apis.hospitalgetAllHospitals().then((res) => {
    //   this.hospitalList = res || []
    // })
    await this.getDeptList()
    await this.getqueryServicePackageTypeList()
    await this.getMainList()
    this.$stopLoading()
  },
  methods: {
    getupdatePackageStatus(row) {
      this.$apis
        .updatePackageStatus({
          serialNo: row.serialNo,
          state: row.state,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          } else {
            row.state = !row.state
            this.$message({
              message: '操作失败',
              type: 'warning',
            })
          }
        })
    },
    getqueryServicePackageTypeList() {
      return this.$apis.queryServicePackageTypeList().then((res) => {
        this.PackageTypeList = res || []
      })
    },
    getDeptList() {
      return this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.deptOptions = res || []
        })
    },
    changeHospital() {
      this.query.dept = ''
      this.getDeptList()
      this.getMainList()
    },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    onChangeCurrentGroup(item) {
      if (!item) {
        this.memberList = []
      }
      this.currentGroup = item
    },
    onDeleteGroup(item) {
      this.$confirm(`是否删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis
            .delPackageBySerialNo({ serialNo: item.serialNo })
            .then(() => {
              this.$message.success('删除成功')
              this.getMainList()
            })
        })
        .catch()
    },
    onAddGroup() {
      this.dialogVisible = true
      this.currentDialog = this.$options.components.GroupDialog
      this.dailogData = null
    },
    onEditGroup(item) {
      this.dialogVisible = true
      this.currentDialog = this.$options.components.GroupDialog
      this.dailogData = item
    },
    formatGroupType(row, col, value) {
      let obj = this.groupTypeList.find((item) => {
        return item.value === value
      })
      return obj && obj.label
    },
    getMainList() {
      return this.$apis
        .getAllPackageList({
          state: this.state,
          hospitalId: this.hospitalId,
          keyWord: this.keyWord,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
          this.$refs.table.setCurrentRow(this.mainList[0])
        })
    },
  },
}
</script>

<style lang="scss">
.followup-group {
  padding: 0px 20px 20px 20px;
}
</style>