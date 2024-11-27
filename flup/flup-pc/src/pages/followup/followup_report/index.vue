<template>
  <div class="plan-statistics">
    <OperationHeader>
      <div class="label">随访患者明细查询</div>
      <el-select
        class="value width200px"
        @change="onSearch"
        v-model="planId"
        placeholder="请选择"
        clearable
      >
        <el-option
          v-for="item in questionairePlanList"
          :key="item.serialNo"
          :label="item.planName"
          :value="item.serialNo"
        ></el-option>
      </el-select>
      <div class="label">出院日期</div>
      <el-date-picker
        class="value"
        v-model="daterange"
        type="daterange"
        range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="onSearch"
      ></el-date-picker>
      <!-- <el-button class="margin-left10" type="primary" @click="onSearch">查询</el-button> -->
      <!-- <template v-slot:right>
        <el-button type="primary" @click="exportFile" plain>导出</el-button>
      </template>-->
    </OperationHeader>
    <el-table class="margin-top20" :data="list" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="inpNo" label="住院号"></el-table-column>
      <el-table-column prop="patientName" label="姓名" width="80"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="age" label="年龄" width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dischargeDiagnosis" label="出院诊断"></el-table-column>
      <el-table-column prop="dischargeDept" label="出院科室"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dischargeDatetime" label="出院时间"></el-table-column>
      <el-table-column prop="oneFollowup" align="center" label="第一次随访情况"></el-table-column>
      <el-table-column prop="twoFollowup" align="center" label="第二次随访情况"></el-table-column>
      <el-table-column prop="threeFollowup" align="center" label="第三次随访情况"></el-table-column>
      <el-table-column prop="fourFollowup" align="center" label="第四次随访情况"></el-table-column>
      <el-table-column prop="drugSituation" label="药物情况"></el-table-column>
      <el-table-column prop="recrudescence" label="复发" width="80"></el-table-column>
      <el-table-column prop="remarks" label="备注" width="50"></el-table-column>
    </el-table>
    <el-pagination
      v-if="list.length"
      class="page-custom"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>

<script>
import Pageination from '@/mixins/pagination'
import DeptList from '@/mixins/deptList'

export default {
  mixins: [Pageination, DeptList],
  data() {
    return {
      planId: '',
      patient_count: 0,
      questionairePlanList: [],
      daterange: [],
      list: [],
    }
  },
  async created() {
    this.$startLoading()
    await this.$apis
      .flupPlanqueryCurrentUserFlupPlanList({
        pageNo: 1,
        pageSize: 2147483647,
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.questionairePlanList = res.list

        if (this.$route.query.planId) {
          this.planId = this.$route.query.planId
          if (
            JSON.stringify(this.questionairePlanList).indexOf(
              this.$route.query.planId
            ) == -1
          ) {
            this.$message({
              message: '该计划数据无法获取',
              type: 'warning',
            })
          }
        }
      })

    await this.getMainList()
    this.$stopLoading()
  },
  methods: {
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    //获取统计数据
    getMainList() {
      let query = {
        planId: this.planId,
        startDate: '',
        endDate: '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      this.$apis
        .getPatientPlanDetailReport({
          ...query,
        })
        .then((res) => {
          this.list = res.list
          this.total = res.total
          if (res.list.length) {
            this.patient_count = res.list[0].all_count
          } else {
            this.patient_count = 0
          }
        })
    },
  },
}
</script>

<style lang="scss">
.plan-statistics {
  padding: 0px 20px 20px 20px;
}
</style>
