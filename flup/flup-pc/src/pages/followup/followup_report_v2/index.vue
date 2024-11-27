<template>
  <div class="plan-statistics">
    <OperationHeader>
      <div class="label">随访计划</div>
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
      <el-table-column prop="flupCount" label="健康管理人数"></el-table-column>
      <el-table-column prop="completeCount" label="已完成随访人数"></el-table-column>
      <el-table-column prop="relapseCount" label="随访期间新发疾病人数"></el-table-column>
      <el-table-column prop="relapsePercentage" label="复发率"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import DeptList from '@/mixins/deptList'

export default {
  mixins: [DeptList],
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
      this.getMainList()
    },
    //获取统计数据
    getMainList() {
      let query = {
        planId: this.planId,
        startDate: '',
        endDate: '',
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      this.$apis
        .getPatientPlanReportV2({
          ...query,
        })
        .then((res) => {
          this.list = []
          this.list.push(res)
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
