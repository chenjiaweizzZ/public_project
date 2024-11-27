<template>
  <div class="marginX20">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>随访问卷</p>
        <el-select v-model="questionnaireId" filterable @change="search" placeholder="请选择">
          <el-option
            v-for="item in questionaireList"
            :key="item.serialNo"
            :label="item.questionnaireName"
            :value="item.serialNo"
          >
            <span style="float:left">{{item.questionnaireName}}</span>
            <span style="float:right">({{$utils.getDeptNameByQuV2(item.flupDept, newDeptOptions)}})</span>
          </el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>发送日期</p>
        <el-date-picker
          @change="search"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="butBox">
        <el-button type="primary" plain @click="search">查询</el-button>
        <el-button type="primary" @click="exportFile">导出</el-button>
      </div>
    </div>

    <el-table class="margin-top10" :data="list" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in thList"
        :prop="item.value"
        :key="item.value"
        :label="item.key"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newDeptOptions: [],
      questionaireList: null,
      questionnaireId: null,
      list: [],
      daterange: [],
      pageIndex: null,
      pageSize: null,
      thList: [
        { value: 'senderName', key: '随访计划/发送人' },
        { value: 'totalCount', key: '总发送数' },
        { value: 'answerCount', key: '总回收数' },
        { value: 'autoCount', key: '自动回收' },
        { value: 'phoneCount', key: '电话回收' },
        { value: 'autoPercent', key: '自动回收率' },
        { value: 'phonePercent', key: '电话回收率' },
        { value: 'answerPercent', key: '总回收率' },
      ],
    }
  },
  created() {
    this.$apis
      .departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.newDeptOptions = res
        this.newDeptOptions.push({ deptName: '全院', serialNo: 'ALL' })
      })
    this.$apis
      .queryFollowUpContents({
        name: '调查问卷',
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.questionaireList = res
        if (this.questionaireList.length) {
          this.questionnaireId = this.questionaireList[0].serialNo
        } else {
          this.questionnaireId = ''
        }
        this.search()
      })
  },
  methods: {
    //导出
    exportFile() {
      let query = {
        type: 3,
        questionnaireId: this.questionnaireId,
        startDate: '',
        endDate: '',
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }

      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/questionnaire/questionnaireStatisticExport?' +
        this.$qs.stringify({
          ...query,
        })
    },

    //查询
    search() {
      if (this.questionnaireId) {
        this.pageIndex = 1
        this.getMainList()
      } else {
        this.list = []
      }
    },
    //获取统计数据
    getMainList() {
      let query = {
        type: 3,
        questionnaireId: this.questionnaireId,
        startDate: '',
        endDate: '',
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      this.$apis
        .questionnaireQuestionnaireStatistic({
          ...query,
        })
        .then((res) => {
          this.list = res
        })
    },
  },
}
</script>
