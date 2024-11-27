//签约审核
<template>
  <div class="marginX20">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>签约时间</p>
        <el-date-picker
          class="select-time-val"
          type="daterange"
          v-model="search.searchTimeVal"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          clearable
        ></el-date-picker>
      </div>
      <div class="queryConditions">
        <el-input
          class="margin-left10 width320px limiting"
          v-model="search.searchVal"
          maxlength="20"
          show-word-limit
        >
          <el-select class="width100px" v-model="search.searchKey" slot="prepend">
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="inquiry"></el-button>
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="patientName" label="姓名" width="100">
        <template slot-scope="scope">{{ scope.row.patientName | hideInfo("patientName") }}</template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="80"></el-table-column>
      <el-table-column prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120">
        <template slot-scope="scope">{{ scope.row.phone | hideInfo("phone") }}</template>
      </el-table-column>
      <el-table-column prop="idNo" label="身份证" width="180">
        <template slot-scope="scope">{{ scope.row.idNo | hideInfo("idNo") }}</template>
      </el-table-column>
      <el-table-column prop="applyDatetime" label="签约申请时间" width="180"></el-table-column>
      <el-table-column prop="validityDay" label="有效天数" width="80"></el-table-column>
      <el-table-column prop="packageName" label="签约服务内容" min-width="150"></el-table-column>
      <el-table-column prop="doctorName" label="签约医生" width="100">
        <template slot-scope="scope">{{ scope.row.doctorName }}</template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="approved(scope.row)">审核通过</el-button>
          <el-button type="text" @click="turnDown(scope.row)">退回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      timeKeyList: [
        // { label: '入院时间', value: 'admissionDatetime' },
        // { label: '出院时间', value: 'dischargeDatetime' },
        // { label: '手术时间', value: 'unknown1', disabled: true },
        // { label: '登记时间', value: 'registerDatetime' },
        { label: '签约时间', value: 'searchTimeVal' },
        // { label: '就诊时间', value: 'medicalDate' },
      ],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '电话', value: 'phone' },
        // { label: '病案号', value: 'patientId', disabled: true },
        // { label: '门诊号', value: 'unknown', disabled: true },
        { label: '身份证', value: 'idNo' },
        // { label: '诊断', value: 'dischargeDiagnosis', disabled: true },
      ],
      search: {
        patientType: '2',
        searchKey: 'patientName',
        searchVal: '',
        // searchTimeKey: 'searchTimeVal',
        searchTimeVal: [],
      },
      total: 0,
      pageNo: 1,
      pageSize: 10,
      auditStatus: 0,
      patientName: '',
      searchTimeVal: '',
    }
  },
  mounted() {
    this.getgetSignApplyRecordListExt()
  },
  methods: {
    approved(row) {
      this.$apis.auditSignApply(row.serialNo).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          if (this.tableData.length == 1 && this.pageNo != 1) {
            this.pageNo = this.pageNo - 1
          }
        } else {
          this.$message({
            message: '操作失败',
            type: 'warning',
          })
        }
        this.getgetSignApplyRecordListExt()
      })
    },
    turnDown(row) {
      this.$apis.retrunSignApply(row.serialNo).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          if (this.tableData.length == 1 && this.pageNo != 1) {
            this.pageNo = this.pageNo - 1
          }
        } else {
          this.$message({
            message: '操作失败',
            type: 'warning',
          })
        }
        this.getgetSignApplyRecordListExt()
      })
    },
    inquiry() {
      if (this.search.searchTimeVal && this.search.searchTimeVal.length != 0) {
        this.searchTimeVal = this.search.searchTimeVal.toString()
      } else {
        this.searchTimeVal = ''
      }
      this.patientName = this.search.searchVal
      this.pageNo = 1
      this.getgetSignApplyRecordListExt()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getgetSignApplyRecordListExt()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getgetSignApplyRecordListExt()
    },
    //获取统计数据
    getgetSignApplyRecordListExt() {
      this.$apis
        .getSignApplyRecordListExt({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          auditStatus: this.auditStatus,
          searchKey: this.search.searchKey,
          searchValue: this.search.searchVal,
          searchTimeVal: this.searchTimeVal,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
        })
    },
  },
}
</script>
<style lang="scss">
</style>

