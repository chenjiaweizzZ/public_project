<template>
  <div class="marginX20">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>计划</p>
        <el-select
          class="width200"
          v-model="planId"
          placeholder="请选择"
          @change="getQuestionaireList" clearable
        >
          <el-option
            v-for="item in allFlupPlanList"
            :key="item.serialNo"
            :value="item.serialNo"
            :label="item.planName"
          ></el-option>
        </el-select>
      </div>

      <div class="queryConditions">
        <div class="flex">
          <el-select class="margin-left10 width130px select-time-key" v-model="searchDateKey">
            <el-option
              v-for="item in timeKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-date-picker
            class="select-time-val"
            type="daterange"
            v-model="searchDateValue"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          ></el-date-picker>
        </div>
      </div>
      <div class="queryConditions">
        <p>回收间隔</p>
        <el-select class="width200" v-model="interval" placeholder="请选择" clearable>
          <el-option
            v-for="item in timeSpacing"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <!-- <div class="queryConditions">
        <p>患者类型</p>
        <el-select class="margin-left10 width150px" v-model="patientType" placeholder="患者类型">
          <el-option
            v-for="item in patientTypeList"
            :key="item.patientTypeCode"
            :value="item.patientTypeCode"
            :label="item.patientTypeName"
            :disabled="item.enabled == 0"
          ></el-option>
        </el-select>
      </div> -->
      <div class="queryConditions">
        <p>随访科室</p>
        <el-select class="width200 value" v-model="dept" placeholder="科室" clearable>
          <el-option
            v-for="item in deptOptions"
            :key="item.serialNo"
            :value="item.serialNo"
            :label="item.deptName"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>随访问卷</p>
        <el-select
          v-model="questionnaireId"
          filterable
          placeholder="请输入关键词"
          :loading="loading"
          @change="getQuestionaireList"
          clearable
        >
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
      <!-- <div class="queryConditions">
        <p>姓名/病案号</p>
        <el-input class="value" v-model="keyValue" placeholder="请输入姓名/病案号" clearable></el-input>
      </div> -->
      <div class="butBox">
        <el-button type="primary" plain @click="search">查询</el-button>
        <el-button class="margin-left50" @click="exportFile" type="primary">导出</el-button>
      </div>
    </div>

    <el-table class="margin-top10 margin-bottom60" :data="list" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in thList"
        :formatter="item.formatter"
        :prop="item.value"
        :key="item.value"
        :label="item.key"
      >
        <!-- <template slot-scope="scope">{{scope.row[item.value]| hideInfo(item.value)}}</template> -->
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="onPre(row)">预览</el-button>
        </template>
      </el-table-column>
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

export default {
  mixins: [Pageination],
  data() {
    return {
      loading: true,
      planId: '',
      interval: '',
      questionnaireId: '',
      daterange: [],
      questionaireList: [],
      list: [],
      allFlupPlanList: [],
      timeKeyList: [
        { label: '随访开始时间', value: 'flupStartDate' },
        { label: '任务结束时间', value: 'flupEndDate' },
        { label: '回收时间', value: 'answerDate' },
      ],
      searchDateKey: 'flupStartDate',
      searchDateValue: [],
      timeSpacing: [
        { label: '24小时内', value: '0' },
        { label: '48小时内', value: '1' },
        { label: '超出48小时', value: '2' },
      ],
      patientType: '',
      dept: '',
      deptOptions: [],
      patientTypeList: [],
      // thList: [
      //   {
      //     value: 'patientName',
      //     key: '患者姓名',
      //     formatter: (row, col, value) => {
      //       return this.$utils.shield(value, 1)
      //     },
      //   },
      //   { value: 'patientId', key: '病案号' },
      //   {
      //     value: 'joinPlanPatientType',
      //     key: '患者类型',
      //     formatter: (row) => {
      //       return this.patientTypeList.find(
      //         (x) => x.patientTypeCode == row.joinPlanPatientType
      //       ).patientTypeName
      //     },
      //   },
      //   { value: 'flupStartTime', key: '随访开始时间' },
      //   { value: 'flupEndTime', key: '任务结束时间' },
      //   { value: 'answerTime', key: '回收时间' },
      //   { value: 'interval', key: '回收间隔' },
      //   { value: 'doctorName', key: '随访医生' },
      //   { value: 'flupPlanName', key: '随访计划/手动发送' },
      //   { value: 'sendDateTime', key: '发送时间' },
      //   { value: 'point', key: '得分' },
      //   { value: 'predictResult', key: '测评结果' },
      // ],
      thList: [],
      keyValue: '',
      pageIndex: 1,
      pageSize: 10,
      dept:'',
      deptOptions:[],
      newDeptOptions: [],
    }
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.searchDateValue = [
      this.$utils.formatDate(new Date(new Date().getTime() - 7 * 8.64e7)),
      this.$utils.formatDate(new Date()),
    ]
    this.$startLoading()
    await this.$apis
      .getAllFlupPlan({
        isAll: 1,
      })
      .then((res) => {
        this.allFlupPlanList = res
        if (this.allFlupPlanList.length > 0) {
          this.planId = this.allFlupPlanList[0].serialNo
        }
        console.log(res,1);
        res.map( v => {
          console.log(1,v.executiveDeptId);
          console.log(2,this.planId);
          
          if(v.executiveDeptId == this.planId ){
            this.deptOptions = v
          }
        })

        // this.allFlupPlanList.unshift({ serialNo: '', planName: '手动计划' })
      })
    await this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res.filter((x) => x.enabled)
      this.patientType = this.patientTypeList[0].patientTypeCode
    })
    await this.$apis
      .departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.newDeptOptions = res
        this.newDeptOptions.push({ deptName: '全院', serialNo: 'ALL' })
      })
    this.setThList()
    this.dept = ''
    await this.getQuestionaireList()
    this.$stopLoading()
  },
  methods: {
    setThList() {
      if (this.planId == '') {
        this.thList = [
          {
            value: 'patientName',
            key: '患者姓名',
            formatter: (row, col, value) => {
              return this.$utils.shield(value, 1)
            },
          },
          {
            value: 'joinPlanPatientType',
            key: '患者类型',
            formatter: (row) => {
              return this.patientTypeList.find(
                (x) => x.patientTypeCode == row.joinPlanPatientType
              ).patientTypeName
            },
          },
          { value: 'flupPlanName', key: '随访计划/手动发送' },
          { value: 'sendDateTime', key: '发送时间' },
          { value: 'senderName', key: '发送人姓名' },
          { value: 'sendCount', key: '发送次数' },
        ]
      } else {
        this.thList = [
          {
            value: 'patientName',
            key: '患者姓名',
            formatter: (row, col, value) => {
              return this.$utils.shield(value, 1)
            },
          },
          {
            value: 'joinPlanPatientType',
            key: '患者类型',
            formatter: (row) => {
              return this.patientTypeList.find(
                (x) => x.patientTypeCode == row.joinPlanPatientType
              ).patientTypeName
            },
          },
          { value: 'flupStartTime', key: '随访开始时间' },
          { value: 'flupEndTime', key: '任务结束时间' },
          { value: 'answerTime', key: '回收时间' },
          { value: 'interval', key: '回收间隔' },
          { value: 'doctorName', key: '随访医生' },
          { value: 'flupPlanName', key: '随访计划/手动发送' },
          { value: 'sendDateTime', key: '发送时间' },
        ]
      }
    },

    //导出
    exportFile() {
      let query = {
        planId: this.planId,
        interval: this.interval,
        patientType: this.patientType,
        deptId: this.dept,
        questionnaireId: this.questionnaireId,
        searchValue: this.keyValue,
        hospitalId: this.hospitalId,
        searchDateKey: this.searchDateKey,
        searchDateValue: this.searchDateValue
          ? this.searchDateValue.join(',')
          : '',
      }
      if(this.list.length > 0){
          location.href =
          this.$baseURL.ICDMApiUrl +
          '/b/questionnaire/exportQuestionAnalysisReport?' +
          this.$qs.stringify({
            ...query,
        })
      }else{
        this.$message({
          type: 'warning',
          message: '暂无数据',
        })
        return 
      }

    },
    //获取问卷下拉框
    getQuestionaireList() {
      let flupPlan = this.allFlupPlanList.filter((res) => {
        return res.serialNo == this.planId
      })
      this.dept = flupPlan[0].executiveDeptId
      this.deptOptions = [
        {
          deptName: flupPlan[0].executiveDept,
          serialNo: flupPlan[0].executiveDeptId,
        },
      ]

      this.setThList()
      this.loading = true
      return this.$apis
        .flupPathqueryFollowUpContent({
          name: '调查问卷',
          deptId: this.dept,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.questionaireList = res
          // if (this.questionaireList.length) {
          //   this.questionnaireId = this.questionaireList[0].serialNo
          // } else {
          //   this.questionnaireId = ''
          // }
          this.loading = false
        })
    },
    //查询
    search() {
      // if (this.questionnaireId) {
      this.pageIndex = 1
      this.getMainList()
      // } else {
      //   this.list = []
      // }
    },
    //获取统计数据
    getMainList() {
      let query = {
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        planId: this.planId,
        interval: this.interval,
        patientType: this.patientType,
        deptId: this.dept,
        questionnaireId: this.questionnaireId,
        searchValue: this.keyValue,
        hospitalId: this.hospitalId,
        searchDateKey: this.searchDateKey,
        searchDateValue: this.searchDateValue
          ? this.searchDateValue.join(',')
          : '',
      }

      this.$apis
        .getQuestionAnalysisReport({
          ...query,
        })
        .then((res) => {
          this.list = res.list
          this.total = res.total
        })
    },
    onPre(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      console.log(urlx + '/#/preSampleStatis?serialNo=' + row.serialNo)
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + '/#/preSampleStatis?serialNo=' + row.serialNo,
          title: `预览`,
        }),
        '*'
      )
    },
  },
}
</script>

<style scoped>
</style>