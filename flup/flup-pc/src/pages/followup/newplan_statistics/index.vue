<template>
  <div class="plan-statistics">
    <OperationHeader style="margin-bottom:20px">
      <div class="label">随访计划</div>
      <el-select
        class="value width200px"
        v-model="planId"
        placeholder="请选择"
        clearable
        @change="onSearch"
      >
        <el-option
          v-for="item in questionairePlanList"
          :key="item.serialNo"
          :label="item.planName"
          :value="item.serialNo"
        ></el-option>
      </el-select>
      <div class="label">任务开始时间</div>
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

      <template v-slot:right>
        <el-button class="margin-left10" type="primary" @click="onSearch" plain>查询</el-button>
        <el-button type="primary" @click="exportFile">导出</el-button>
      </template>
    </OperationHeader>

    <el-table style="margin-bottom:60px" class="margin-top20" :data="list" stripe border>
      <el-table-column show-overflow-tooltip prop="flupType" label="随访类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="flupPlan" label="随访计划"></el-table-column>
      <el-table-column show-overflow-tooltip prop="flupContent" label="随访任务">
        <!-- <template slot-scope="{row}">
          <span v-if="row.flup_type"></span>
          <span></span>
        </template>-->
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="totalCount" label="总任务数"></el-table-column>
      <el-table-column show-overflow-tooltip prop="noFollowupCount" label="待执行数量"></el-table-column>
      <el-table-column label="随访数量">
        <el-table-column show-overflow-tooltip :width="100" prop="followupCount" label="随访数量"></el-table-column>
        <el-table-column show-overflow-tooltip :width="100" prop="followupRate" label="随访率"></el-table-column>
      </el-table-column>
      <el-table-column label="随访成功">
        <el-table-column show-overflow-tooltip :width="100" prop="successFollowupCount" label="数量"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          :width="100"
          prop="successFollowupRate"
          label="随访成功率"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="失访">
        <el-table-column show-overflow-tooltip prop="lossFollowupCount" :width="100" label="失访数量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="lossFollowupRate" :width="100" label="失访率"></el-table-column>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        v-for="item in thList"
        :prop="item.value"
        :key="item.value"
        :label="item.key"
      ></el-table-column>-->
    </el-table>
    <el-pagination
      v-if="list.length"
      class="page-custom pageBottom"
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
      // thList: [
      //   { value: 'flup_type', key: '随访类型' },
      //   { value: 'flup_content', key: '随访任务' },
      //   { value: 'total_count', key: '总任务数' },
      //   { value: 'tobe_count', key: '待执行数量' },
      //   { value: 'progress_count', key: '执行中数量' },
      //   { value: 'expire_count', key: '已过期数量' },
      //   { value: 'complete_count', key: '已完成数量' },
      //   { value: 'cancel_count', key: '取消数量' }
      // ]
    }
  },
  async created() {
    this.$startLoading()
    // await this.getNewDeptList()
    // this.newDeptOptions[0].Value = ''
    // this.dept = ''
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
            this.planId = null
          }
        }
        // if (this.questionairePlanList.length) {
        //   this.planId = this.questionairePlanList[0].serialNo
        // } else {
        //   this.planId = ''
        // }
      })

    await this.getMainList()
    this.$stopLoading()
  },
  methods: {
    //导出
    exportFile() {
      let query = {
        planId: this.planId,
        startDate: '',
        endDate: '',
        hospitalId: this.$global.hospital_id,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/questionnaire/exportPatientPlanReport?' +
        this.$qs.stringify({
          ...query,
        })
    },
    onSearch() {
      // if (this.planId) {
      this.pageIndex = 1
      this.getMainList()
      // } else {
      //   this.list = []
      // }
    },
    //获取统计数据
    getMainList() {
      let query = {
        planId: this.planId,
        startDate: '',
        endDate: '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        hospitalId: this.$global.hospital_id,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      this.$apis
        .getNewPlanStatisticsListx({
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
