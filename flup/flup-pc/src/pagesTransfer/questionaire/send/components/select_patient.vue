<template>
  <div>
    <!-- <el-row class="margin-left20">
      <label class="width120px margin-right10">{{$route.params.type === 'wenjuan' ? '问卷' : '宣教'}}名称: </label>
      <span>{{getTemplateName()}}</span>
    </el-row>
    <el-row class="margin-bottom20 margin-top20 margin-left20">
      <label class="width120px margin-right10">选中人数: </label>
      <span>{{selectedList.length}}</span>
    </el-row>-->
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>患者类型</p>
        <el-select class="width120px" v-model="patientTypeCode" @change="changePatientType">
          <el-option
            v-for="(item, i) in patientTypeList"
            :key="i"
            :label="item.patientTypeName"
            :value="item.patientTypeCode"
          ></el-option>
        </el-select>
      </div>
      <div
        v-if="patientTypeCode == patientModel.admission || patientTypeCode == patientModel.discharge || patientTypeCode == patientModel.out|| patientTypeCode == patientModel.operation || patientTypeCode == patientModel.internet"
        class="queryConditions"
      >
        <p>科室:</p>
        <el-select class="width180px" v-model="hospitalYard" @change="onSearch" clearable filterable>
          <el-option
            v-for="(item, i) in hospitalYardList"
            :key="i"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>时间:</p>
        <el-date-picker
          class="discharge-time"
          v-model="searchTime"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          :editable="false"
          @change="onSearch"
        ></el-date-picker>
      </div>
      <div v-if="zksq && patientTypeCode!=patientModel.sign" class="queryConditions">
        <p>诊断</p>
        <el-input style="width:240px" v-model="diagnosis" placeholder="请输入内容" clearable></el-input>
      </div>
      <div v-if="zksq" class="queryConditions">
        <p>姓名</p>
        <el-input style="width:240px" v-model="patientName" placeholder="请输入内容" clearable></el-input>
      </div>
      <!-- <div v-if="zksq" class="queryConditions">
        <p>发送状态</p>
        <el-select v-model="stateSend" placeholder="请选择">
          <el-option
            v-for="(item, i) in stateList"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>-->
      <div class="butBox">
        <el-button v-if="!zksq" type="text" class="margin-left10" @click="zksq = true">高级筛选</el-button>
        <el-button v-else type="text" class="margin-left10" @click="zksq = false">收起</el-button>
        <el-button type="primary" @click="onSearch" plain>查询</el-button>
      </div>
    </div>
    <el-table
      ref="table"
      :data="patientList"
      :highlight-current-row="sendBy == 'patient'"
      stripe
      border
      @selection-change="changeSelect"
      @current-change="handleCurrentChange"
      :default-sort="{ prop: 'bed_no' }"
    >
      <el-table-column v-if="sendBy !== 'patient'" type="selection" width="50"></el-table-column>
      <el-table-column v-else width="50">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            :label="scope.row.index"
            @change.stop="onRadioChange(scope.row)"
          >{{ "" }}</el-radio>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
      <el-table-column
        v-if="patientTypeCode == patientModel.admission"
        key="bedNo"
        width="100"
        :sort-method="sortByBedNo"
        show-overflow-tooltip
        prop="bedNo"
        label="床号"
        sortable
      ></el-table-column>
      <el-table-column prop="patientName" label="姓名" width="136">
        <template slot-scope="scope">
          <el-row type="flex" align="middle" justify="space-between">
            {{ $utils.shield(scope.row.patientName, 1) }}
            <el-popover
              v-if="scope.row.sendState != null"
              placement="right"
              width="auto"
              trigger="hover"
              @show="showSendInfo(scope.row)"
              @hide="hidenSendInfo"
            >
              <el-row v-loading="loadingInfo" slot>
                <el-row v-for="(item, index) in sendInfo" :key="index">
                  <span style="font-size: 12px">{{ item.createTime.replace("T", " ") }}</span>
                  <span style="font-size: 12px" class="margin-left6">{{ item.questionnaireName }}</span>
                  <span
                    style="font-size: 12px"
                    class="margin-left6"
                  >{{ item.sendStateName }}</span>
                </el-row>
              </el-row>
              <i slot="reference" style="display: block" class="icon-send_success"></i>
            </el-popover>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column width="150" show-overflow-tooltip prop="patientId" label="病案号" sortable></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column :formatter="formatAge" prop="dateOfBirth" label="年龄" width="55"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="115">
        <template slot-scope="scope">{{ scope.row.phone | hideInfo("phone") }}</template>
      </el-table-column>
      <el-table-column
        v-if="patientTypeCode == patientModel.admission || patientTypeCode == patientModel.discharge "
        :formatter="formatTime"
        prop="admissionDatetime"
        label="入院时间"
        width="120"
        sortable
      ></el-table-column>
      <el-table-column
        v-if="patientTypeCode == patientModel.admission || patientTypeCode == patientModel.discharge "
        show-overflow-tooltip
        prop="admittingDiagnosis"
        label="入院诊断"
      ></el-table-column>
      <el-table-column
        v-if=" patientTypeCode == patientModel.discharge "
        :formatter="formatTime"
        prop="dischargeDatetime"
        label="出院时间"
        width="100"
      ></el-table-column>
      <el-table-column
        v-else-if=" patientTypeCode == patientModel.transfer "
        show-overflow-tooltip
        prop="transferDatetime"
        label="转院时间"
      ></el-table-column>
      <el-table-column
        v-else-if=" patientTypeCode == patientModel.sign "
        show-overflow-tooltip
        prop="auditDatetime"
        label="审核时间"
      ></el-table-column>
      <el-table-column
        v-else-if=" patientTypeCode != patientModel.admission "
        show-overflow-tooltip
        prop="medicalDate"
        label="就诊时间"
      ></el-table-column>
      <el-table-column
        v-if=" patientTypeCode == patientModel.discharge "
        show-overflow-tooltip
        prop="dischargeDiagnosis"
        label="出院诊断"
      ></el-table-column>
      <el-table-column
        v-else-if="patientTypeCode != patientModel.admission && patientTypeCode != patientModel.sign"
        show-overflow-tooltip
        prop="diagnosis"
        label="诊断"
      ></el-table-column>
      <el-table-column
        v-if=" patientTypeCode == patientModel.sign "
        show-overflow-tooltip
        prop="packageName"
        label="服务内容"
      ></el-table-column>
      <el-table-column width="80" prop="chiefPhysician" label="主管医生"></el-table-column>
    </el-table>

    <el-pagination
      style="margin-bottom:20px"
      ref="pagination"
      background
      @size-change="handleSizeChange"
      :current-page.sync="pageNo"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { patientModel } from '@/mixins/enum.js'
export default {
  name: 'send-template',
  props: ['templateList', 'sendBy'],
  inject: ['reload'],
  mixins: [patientModel],
  data() {
    return {
      zksq: false,
      advanVisible: false,
      labelTime: '入院时间',
      labelSearch: '入院诊断',
      patientList: [],
      patientTypeList: [],
      patientTypeCode: '',
      hospitalYardList: [],
      searchTime: [],
      hospitalYard: '',
      diagnosis: '',
      selectedList: [],
      ward: 'discharge_ward',
      patientName: '',
      stateList: [
        { label: '全部', value: '' },
        { label: '未发送', value: 0 },
        { label: '已发送', value: 1 },
      ],
      stateSend: '',
      showTableDataType: 1,
      sendInfo: [],
      loadingInfo: false,
      radio: -1,
      hospitalId: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
    }
  },
  watch: {
    pageNo() {
      this.getPatientList()
    },
  },
  async created() {
    // this.patientTypeCode = this.patientModel.admission
    this.patientTypeCode = this.patientModel.discharge
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    // this.$startLoading()
    this.hospitalYard = this.$global.ward_code
    this.searchTime = [
      this.$utils.formatDate(new Date(new Date().getTime() - 3 * 8.64e7)),
      this.$utils.formatDate(new Date()),
    ]

    await this.$apis
      .systemManagequeryCurrentUserDept({
        hospitalId: this.hospitalId,
      })
      .then((res) => {
        this.hospitalYardList = res
        if (this.hospitalYardList.length > 0) {
          this.hospitalYard =
            this.hospitalYard || this.hospitalYardList[0].serialNo
        }
      })

    // await this.$apis
    //   .flupPlanquerydeptName({ hospitalId: this.hospitalId, type: 1 })
    //   .then((res) => {
    //     this.hospitalYardList = res
    //     if (this.hospitalYardList.length > 0) {
    //       this.hospitalYard =
    //         this.hospitalYard || this.hospitalYardList[0].deptCode
    //     }
    //   })

    await this.getPatientList()
    this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res.filter((x) => x.enabled)
      // this.patientTypeCode = this.patientTypeList[0].patientTypeName
    })
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getPatientList()
    },
    onRadioChange(item) {
      this.$refs.table.setCurrentRow(item)
    },
    showSendInfo(obj) {
      this.loadingInfo = true
      this.$apis
        .questionnairequeryPatientSendRecord({
          userId: obj.userId,
          createTime: obj.admissionDatetime || obj.medicalDate,
          module: this.$route.params.type.toLowerCase(),
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.sendInfo = res
          if (this.sendInfo) {
            this.sendInfo.forEach((item) => {
              if (item.sendState == 1) {
                item.sendStateName = "成功"
              } else if (item.sendState == 0) {
                item.sendStateName = "待发送"
              } else {
                item.sendStateName = "失败"
              }
            })
          }
          this.loadingInfo = false
        })
    },
    hidenSendInfo() {
      // this.loadingInfo = false
    },
    checkSelectable(row) {
      return row.send_state !== '1'
    },
    formatIsBindWeChat(row) {
      return row.open_id ? '是' : '否'
    },
    changePatientType(v) {
      this.hospitalYard = ''
      // if (v.toString() == this.patientModel.admission) {
      //   this.labelTime = '入院时间'
      //   this.labelSearch = '入院诊断'
      //   this.hospitalYard = this.hospitalYardList[0].deptCode
      // } else if (v.toString() == this.patientModel.discharge) {
      //   this.labelTime = '出院时间'
      //   this.labelSearch = '出院诊断'
      //   this.hospitalYard = this.hospitalYardList[0].deptCode
      // } else if (v.toString() == this.patientModel.sign) {
      //   this.labelTime = '签约时间'
      // } else if (v.toString() == this.patientModel.transfer) {
      //   this.labelTime = '转院时间'
      // } else if (
      //   v.toString() == this.patientModel.internet ||
      //   v.toString() == this.patientModel.out ||
      //   v.toString() == this.patientModel.operation
      // ) {
      //   this.labelTime = '就诊时间'
      //   this.labelSearch = '诊断'
      //   this.hospitalYard = this.hospitalYardList[0].deptCode
      // } else {
      //   this.labelTime = '就诊时间'
      //   this.labelSearch = '诊断'
      // }
      this.onSearch()
    },
    formatAge(row, h, v) {
      if (v) {
        return this.$utils.getAge(
          this.$utils.formatDate(new Date(v.replace('T', ' ')))
        )
      } else {
        return ''
      }
    },
    formatTime(row, h, v) {
      if (v) {
        return this.$utils.formatDate(new Date(v.replace('T', ' ')))
      } else {
        return ''
      }
    },
    changeSelect(arr) {
      this.selectedList = arr
      this.$emit('selected', this.selectedList)
    },
    handleCurrentChange(item) {
      this.radio = item.index
      this.selectedList[0] = item
      this.$emit('selected', this.selectedList)
    },
    onSearch() {
      this.pageNo = 1
      this.advanVisible = false
      this.ward =
        this.patientTypeCode == this.patientModel.admission
          ? 'admission_ward'
          : 'discharge_ward'
      this.getPatientList()
    },
    onPrevious() {
      this.$emit('previous')
    },
    // getTemplateName() {
    //   let text = ''
    //   this.templateList.forEach((element,i) => {
    //     if(i!==0){
    //       text += '，'
    //     }
    //     text += element.questionnaire_name
    //   })
    //   return text
    // },
    async getPatientList() {
      let questionnaireId
      if (this.templateList) {
        questionnaireId = this.templateList
          .map((element) => {
            return element.serialNo
          })
          .join(',')
      }
      let ward = ''
      if (this.patientTypeCode == this.patientModel.admission) {
        ward = this.hospitalYard
      } else {
        let obj = this.hospitalYardList.find((element) => {
          return element.discharge_ward_code === this.hospitalYard
        })
        if (obj) {
          ward = obj.discharge_ward
        }
      }
      await this.$apis
        .flupPlanqueryPatientList({
          // type: this.patientType,
          patientTypeCode: this.patientTypeCode,
          wardCode: this.hospitalYard,
          // ward: ward || '', //'感染病房(6A-11)',
          // date: this.patientType != 1 ? this.searchTime.join(',') || '' : '', // '2017-05-05',
          date: this.searchTime.join(',') || '',
          diagnose: this.diagnosis || '',
          patientName: this.patientName || '',
          state: this.stateSend,
          questionnaireId: questionnaireId || '',
          module: this.$route.params.type.toLowerCase(),
          hospitalId: this.hospitalId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.$refs.pagination.lastEmittedPage = this.pageNo
          if (res) {
            this.patientList = res.list
            this.total = res.total
            this.patientList.forEach((element, i) => {
              this.$set(element, 'index', i)
            })
            this.radio = -1
            this.selectedList = []
          }
        })
    },
    sortByBedNo({ bed_no: a }, { bed_no: b }) {
      if (isNaN(a) && isNaN(b)) {
        return a.localeCompare(b)
      } else if (!isNaN(a) && !isNaN(b)) {
        return parseInt(a) - parseInt(b)
      } else if (isNaN(a)) {
        return 1
      } else {
        return -1
      }
    },
  },
}
</script>
<style lang="scss">
.gjcx {
  margin-bottom: 20px;
  .el-form {
    display: flex;
  }
}
</style>


