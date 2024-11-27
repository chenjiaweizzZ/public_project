<template>
  <section class="padding10">
    <!-- <filterHeader :typeOptions="typeOptions" :deptOptions="deptOptions" :date-range="dateRange" @onSearch="onSearch"></filterHeader> -->
    <OperationHeader>
      <template v-slot:right>
        <b>患者类型</b>
        <el-select
          class="width130px margin-left10"
          v-model="patientType"
          placeholder="选择患者类型"
          @change="onSearch"
        >
          <el-option
            v-for="(item, i) in patientTypeList"
            :key="i"
            :label="item.patientTypeName"
            :value="item.id"
          ></el-option>
        </el-select>
        <template v-if="patientType===2">
          <strong class="margin-left10">出院时间：</strong>
          <el-date-picker
            class="margin-left10"
            v-model="dateRange"
            :editable="false"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
        </template>
        <el-select
          class="width130px margin-left10"
          v-model="dept"
          :placeholder="patientType == 1 ? '选择当前科室' : '选择出院科室'"
          clearable
          @change="onSearch"
        >
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <el-button class="margin-left10" type="primary" @click="onSearch(false)">查询</el-button>
        <el-popover ref="popover" placement="top" width="300" v-model="advanVisible">
          <el-form label-width="80px">
            <el-form-item label="发送状态">
              <el-select clearable v-model="sendState" placeholder="选择发送状态">
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="patientName" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
            <div class="text-align-center">
              <el-button type="primary" @click="onSearch(true)">确定</el-button>
            </div>
          </el-form>
        </el-popover>
        <el-button class="margin-left10" type="primary" v-popover:popover>高级查询</el-button>
      </template>
    </OperationHeader>
    <div class="font-size4 margin20X">
      <span class="margin-right10">
        区间总{{ patientType === 1 ? '在院' : '出院' }}患者：
        <b>{{ total }}</b>
      </span>
      <span class="margin-right10">
        已发送患者：
        <b>{{ totalSend }}</b>
      </span>
      <span class="margin-right10">
        未发送患者：
        <b>{{ totalNoSend }}</b>
      </span>
    </div>
    <el-table :data="mainList" stripe border>
      <el-table-column :width="50" type="index" label="序号" show-overflow-tooltip></el-table-column>
      <el-table-column
        :formatter="$utils.formatTableDate()"
        :width="110"
        :prop="patientType === 1 ? 'admissionDatetime' : 'dischargeDatetime'"
        :label="patientTypeTitle+'日期'"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :prop="patientType === 1 ? 'admissionWard' : 'dischargeWard'"
        :label="patientTypeTitle+'科室'"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :formatter="(row,col,value)=>{return this.$utils.shield(value,1)}"
        :width="90"
        prop="patientName"
        label="姓名"
      ></el-table-column>
      <el-table-column :width="100" prop="bedNo" label="床号" show-overflow-tooltip></el-table-column>
      <el-table-column :width="90" prop="inpNo" label="住院号" show-overflow-tooltip></el-table-column>
      <el-table-column
        :prop="patientType === 1 ? 'admittingDiagnosis' : 'dischargeDiagnosis'"
        :label="patientTypeTitle+'诊断'"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :width="100"
        :formatter="stateFormat"
        prop="sendState"
        label="发送状态"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column :width="150" :label="label+'发送记录'" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.sendState"
            @click="onView(scope.row)"
            type="text"
            icon="el-icon-search"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-custom"
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
    <el-dialog
      :title="label+'发送列表'"
      :visible.sync="dialogTableVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <sendList v-if="dialogTableVisible" :curItem="currentItem"></sendList>
    </el-dialog>
  </section>
</template>

<script>
// import filterHeader from "./components/filter_header";
import sendList from './components/send_list'
import deptList from '@/mixins/deptList'
import templateType from '@/mixins/templateType'
import pagination from '@/mixins/pagination'
export default {
  // props:{
  //   type:{
  //     default:'WJDC'
  //   }
  // },
  name: 'send_statistic',
  mixins: [deptList, templateType, pagination],
  components: {
    // filterHeader,
    sendList,
  },
  data() {
    return {
      patientType: 2, //1 在院患者    2 出院患者
      mainList: [],
      advanVisible: false,
      // deptOptions: [],
      // pageQuery: {
      //   pageIndex: 1,
      //   pageSize: 10
      // },
      // query:{},
      // total: 0,
      totalSend: 0,
      totalNoSend: 0,
      dialogTableVisible: false,
      currentItem: {},
      dateRange: [],
      sendState: '',
      stateList: [
        { label: '已发送', value: 1 },
        { label: '未发送', value: 0 },
      ],
      patientName: '',
      hospitalId: null,
      patientTypeList: [],
    }
  },
  computed: {
    patientTypeTitle() {
      return this.patientType === 2 ? '出院' : '入院'
    },
  },
  async created() {
    this.$startLoading()
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.dateRange = [
      this.$utils.formatDate(new Date().getTime() - 7 * 8.64e7),
      this.$utils.formatDate(new Date()),
    ]
    // this.query.startDate = this.dateRange[0]
    // this.query.endDate = this.dateRange[1]
    // await this.getDeptOptions()
    await this.getNewDeptList()
    await this.getMainList()

    this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res
    })
    this.$stopLoading()
  },
  methods: {
    getDeptOptions() {
      // 获取出院科室
      return this.$apis.getDeptList().then((res) => {
        this.deptOptions = res
      })
    },
    getMainList() {
      let query = {
        type: this.patientType,
        questionType: this.type === 2 ? 'WJDC' : 'JKXJ',
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        startDate: '',
        endDate: '',
        deptId: this.dept,
        patientName: this.patientName,
        state: this.sendState,
        hospitalId: this.hospitalId,
      }
      if (
        this.dateRange &&
        this.dateRange.length > 0 &&
        this.patientType === 2
      ) {
        query.startDate = this.dateRange[0]
        query.endDate = this.dateRange[1]
      }
      return this.$apis
        .questionnairequeryPatientSendRecordStatisticsList({
          ...query,
        })
        .then((res) => {
          this.mainList = res.data.list
          this.total = res.total
          this.totalNoSend = res.totalNoSend
          this.totalSend = res.totalSend
        })
    },
    // dateformatter(row,col,v) {
    //   if(!v) return ''
    //   return this.$utils.formatDate(new Date(v));
    // },
    stateFormat(row, col, v) {
      let states = {
        0: '未发送',
        1: '已发送',
        2: '失败',
      }
      return states[v]
    },
    onView(row) {
      this.dialogTableVisible = true
      this.currentItem = row
    },
    onSearch(isAdvanced) {
      /* this.query = query;
      this.pageQuery.pageIndex = 1;
      this.patientType = this.query.type */
      this.pageIndex = 1
      if (!isAdvanced) {
        this.patientName = ''
        this.sendState = ''
      }
      this.advanVisible = false
      this.getMainList()
    },
    // handleSizeChange(v) {
    //   this.pageQuery.pageIndex = 1;
    //   this.pageQuery.pageSize = v;
    //   this.getMainList();
    // },
    // handleCurrentChange(v) {
    //   this.getMainList();
    // }
  },
}
</script>
