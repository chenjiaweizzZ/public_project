<template>
  <div class="audit">
    <div class="audit_wrapper">
      <div class="audit_aside">
        <el-row type="flex">
          <el-select clearable v-model="followupTypeValue" placeholder="随访类型">
            <el-option v-for="(item, i) in followUpTypeList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
          <el-select class="margin-left20" clearable v-model="checkState" placeholder="审核状态">
            <el-option v-for="(item, i) in followUpStateList" :key="i" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-row>
        <el-row class="margin-top20 margin-bottom20" type="flex">
          <el-input v-model="keyWords" placeholder="请输入姓名" clearable></el-input>
          <el-button class="margin-left10" type="primary" @click="onSearch">查询</el-button>
        </el-row>
        <div ref="audit_list" class="audit_list">
          <el-table ref="table" :data="patientList" highlight-current-row stripe border @current-change="changePatient" :row-class-name="classExpired">
            <el-table-column show-overflow-tooltip :min-width="125" :width="125" :formatter="personInfo" label="基本信息"></el-table-column>
            <el-table-column prop="flupType" label="随访类型" width="110px"></el-table-column>
            <el-table-column :formatter="formatState" label="审核状态"></el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :pager-count="5"
            :current-page.sync="pageIndex"
            @current-change="handleCurrentChange"
            background
            small
          ></el-pagination>
        </div>
      </div>
      <div class="audit_main">
        <div v-if="patientList.length == 0" class="nonexistenceData">一条记录都没有</div>
        <div v-else>
          <el-row style="margin-bottom:20px" class="audit_main_header" type="flex">
            <div class="label">随访类型</div>
            <div class="value">{{ currentItem.flupType || "" }}</div>
            <div class="label">随访内容</div>
            <div class="value">{{ $utils.formatFollowupContent(currentItem) }}</div>
            <div class="label">随访执行时间</div>
            <div class="value">{{ $utils.formatDate(currentItem.flupStartTime) }}</div>
            <div class="label">随访完成时间</div>
            <div class="value">{{ this.$utils.formatDate(currentItem.flupTimeReal) }}</div>
          </el-row>
          <el-row style="margin-bottom:20px" class="audit_main_header" type="flex" v-if="currentItem.authState ==30">随访结果:(已作废)</el-row>
          <div v-if="currentItem.flupType != '慢病评估报告'">
            <el-row class="padding20" type="flex">
              <el-col>
                预约时间
                <el-date-picker
                  v-model="appointmentTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  :disabled="currentItem.authState==20||currentItem.authState==30||currentItem.authState==60"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-col>
              <el-col>
                备注
                <el-input
                  class="width150px margin-left10"
                  :maxlength="200"
                  v-model="remark2"
                  show-word-limit
                  :disabled="currentItem.authState==20||currentItem.authState==30||currentItem.authState==60"
                ></el-input>
              </el-col>
            </el-row>
            <el-table class="margin-top20" :data="showList" highlight-current-row stripe border>
              <el-table-column type="index" label="序号" :width="50"></el-table-column>
              <template v-if="currentItem.flupType == '定期检查'">
                <el-table-column show-overflow-tooltip label="检查内容">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.checkType" @change="switchType(scope.row, $event)">
                      <el-option v-for="(item,index) in checkTypeList" :key="index" :label="item.examTypeName" :value="item.examTypeName"></el-option>
                    </el-select>
                    <div v-else>{{ scope.row.checkType }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="检查部位">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.checkPart" @change="switchPart(scope.row, $event)">
                      <el-option v-for="(item,index) in checkPartList" :key="index" :label="item.examBodyName" :value="item.examBodyName"></el-option>
                    </el-select>
                    <div v-else>{{ scope.row.checkPart }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="检查项目">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.checkItem" @change="switchItem(scope.row, $event)">
                      <el-option v-for="(item,index) in checkItemList" :key="index" :label="item.examItemName" :value="item.examItemName"></el-option>
                    </el-select>
                    <div v-else>{{ scope.row.checkItem }}</div>
                  </template>
                </el-table-column>
              </template>
              <template v-else>
                <el-table-column show-overflow-tooltip label="检验名称">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.examItem">
                      <el-option v-for="(item,inedx) in inspectionNameList" :key="inedx" :label="item.ylmc" :value="item.ylmc"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.examItem }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="样本类型">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.examType">
                      <el-option v-for="(item,index) in inspectionTypeList" :key="index" :label="item.sampledescribe" :value="item.sampledescribe"></el-option>
                    </el-select>
                    <div v-else>{{ scope.row.examType }}</div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column v-if="currentItem.authState == 10" label="操作" width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEdit">
                    <el-button type="text" @click="onConfirmEdit(scope.row)">确定</el-button>
                    <el-button type="text" @click="onCancel">撤销</el-button>
                  </div>
                  <div v-else>
                    <el-button @click="deleteItem(scope)" type="text">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button icon="icon-add" class="margin-top20" v-if="currentItem.authState == 10" type="text" @click="onAdd">
              <span class="margin-left4 inline-middle">新增</span>
            </el-button>
          </div>
          <div v-else>
            <div v-if="item">
              <div class="text-align-center font-size10 bold relative">
                {{ item.title }}
                <div class="absolute font-size2 color-333" style="right: 20px; top: 10px; font-weight: normal">报告ID: {{ item.reportId }}</div>
              </div>
              <div v-if="item.patientDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">基本信息</div>
              <div v-if="item.patientDisplay">
                <table class="table">
                  <tr>
                    <td class="table-label">姓名</td>
                    <td class="table-value">{{ patientInfo.patientName }}</td>
                    <td class="table-label">性别</td>
                    <td class="table-value">{{ patientInfo.sex }}</td>
                    <td class="table-label">年龄</td>
                    <td class="table-value">{{ patientInfo.age }}</td>
                    <td class="table-label">电话</td>
                    <td class="table-value">{{ patientInfo.phone }}</td>
                  </tr>
                  <tr>
                    <td class="table-label">身高</td>
                    <td class="table-value">{{ height || "-" }}</td>
                    <td class="table-label">体重</td>
                    <td class="table-value">{{ weight || "-" }}</td>
                    <td class="table-label">血压</td>
                    <td class="table-value">{{ bloodPressure || "-" }}</td>
                    <td class="table-label">血糖</td>
                    <td class="table-value">{{bloodSugar || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="table-label">体重指数</td>
                    <td class="table-value">{{ BMI || "-" }}</td>
                    <td class="table-label">吸烟</td>
                    <td class="table-value">{{ patientInfo.smokeHistory || "-" }}</td>
                    <td class="table-label">饮酒</td>
                    <td class="table-value">{{ patientInfo.drinkHistory || "-" }}</td>
                    <td class="table-label">降压情况</td>
                    <td class="table-value">{{ "-" }}</td>
                  </tr>
                  <tr>
                    <td class="table-label">既往史</td>
                    <td class="table-value" colspan="7">{{ patientInfo.pastHistory }}</td>
                  </tr>
                  <tr>
                    <td class="table-label">家族慢病史</td>
                    <td class="table-value" colspan="7">{{ patientInfo.familyHistory }}</td>
                  </tr>
                  <tr>
                    <td class="table-label">入院诊断</td>
                    <td class="table-value" colspan="7">{{ patientInfo.emAdmissionSimpleRecord && patientInfo.emAdmissionSimpleRecord.presentHistory }}</td>
                  </tr>
                  <tr>
                    <td class="table-label">家庭地址</td>
                    <td class="table-value" colspan="7">{{ patientInfo.homeAddrHouseNumber }}</td>
                  </tr>
                </table>
              </div>
              <div v-if="item.detectDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">健康监测数据</div>
              <el-row v-if="item.detectDisplay" type="flex" style="flex-wrap: wrap" class="padding20">
                <div class="card" v-for="item in chartDataList" :key="item.label">
                  <ve-line
                    class="margin-top10"
                    :title="{ text: item.label, left: 16 }"
                    :data="item.data"
                    :colors="VLineColors"
                    :grid="VLineGrid"
                    :settings="{ labelMap: item.labelMap }"
                    :extend="lienExtend"
                  ></ve-line>
                </div>
              </el-row>
              <el-row v-if="item.riskDisplay" type="flex" justify="space-between" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">
                风险评估
                <p>{{ item.riskResult }}</p>
              </el-row>
              <div v-if="item.riskDisplay" id="frambox" style="width: 100%">
                <iframe ref="iframe" id="iframex" width="100%" height="500" :src="url" frameborder="0"></iframe>
              </div>
              <div v-if="item.suggestionDisplay" class="padding-bottom12 font-size2 color-333 margin-top20">健康建议</div>
              <div v-if="item.suggestionDisplay" class="border1 padding-top20 relative flex-column" style="height: 500px">
                <!-- <el-row class="padding10 border-bottom1" type="flex" justify="space-between" align="middle"></el-row> -->
                <textarea class="textarea flex1" :disabled="currentItem.authState==20||currentItem.authState==30||currentItem.authState==60" v-model="item.suggestionContent"></textarea>
              </div>
              <div v-if="item.followDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">随访安排</div>
              <div v-if="item.followDisplay">
                <div class="margin-top14">下次随访安排</div>
                <div class="margin-top10 margin-left20">随访时间：{{ item.followDate || "-" }}</div>
                <div class="margin-top10 margin-left20">随访内容：{{ item.followContent || "-" }}</div>
                <div class="margin-top10 margin-left20">注意事项：{{ item.followMark || "-" }}</div>
              </div>
              <div v-if="item.informedDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">知情同意书</div>
              <div v-if="item.informedDisplay" class="pre-wrap margin-top14 padding-bottom60">{{ item.informedContent }}</div>
              <!--解决ios兼容问题-->
              <div style="height:20px"></div>
            </div>
            <div style="text-align: center;" v-else>
              <img height="212" width="160" src="~@/assets/images/empty.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentItem.authState == 10" class="footer padding-top20">
      <el-row type="flex" align="middle" justify="end">
        <el-button class="width100px" @click="onAudit(30)">作废</el-button>
        <el-button class="width100px" type="primary" @click="onAudit(20)">审核通过</el-button>
      </el-row>
    </div>
    <div v-else class="footer padding-top10">
      <h4 style="text-align: end; color: #666">审核人:{{ currentItem.authPerson ? currentItem.authPerson : SendCheck.authPerson }}</h4>
      <h4 style="text-align: end; color: #666">审核时间:{{ currentItem.authTime ? currentItem.authTime : SendCheck.authTime }}</h4>
    </div>

    <!-- <FollowupRecord :id="currentItem.user_id"></FollowupRecord> -->
  </div>
</template>

<script>
import pagination from '@/mixins/pagination';
import tableEdit from '@/mixins/tableEdit';
import inspection from '@/mixins/inspection';
import zhongwei from '@/assets/images/zhongwei.png';
import VeLine from 'v-charts/lib/line.common';
// import FollowupRecord from '@/components/followup_record'

export default {
  name: 'check-list',
  components: {
    [VeLine.name]: VeLine,
  },
  data() {
    this.VLineColors = ['#19d4ae', '#5ab1ef', '#fa6e86'];
    this.VLineGrid = { left: 10, right: 30 };
    this.lienExtend = {
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          formatter: function (value) {
            var valueDetal = value.split(' ');
            if (valueDetal.length > 0) {
              var temp = valueDetal[0] + '\n' + valueDetal[1];
              return temp;
            } else {
              return value;
            }
          },
        },
      },
    };
    return {
      reportHistory: ['极高危', '高危', '中危', '低危'],
      reportType: 1,
      reportList: [{ label: '糖尿病风险评估报告', value: 1 }],
      currentItem: {},
      patientList: [],
      patientListX: [],
      followUpTypeList: [],
      followUpStateList: [
        { name: '待审核', value: 10 },
        { name: '已审核', value: 20 },
      ],
      checkState: '',
      followupTypeValue: '',
      keyWords: '',
      decide: '',
      patientInfo: {},
      chartDataList: [],
      item: {},
      SendCheck: {},
      mbId: '',
      queryserialNo: this.$route.query.serialNo,
      bloodPressure: '-',
      bloodSugar: '-',
      weight: '-',
      BMI: '-',
      height: '-',
      url: null,
      appointmentTime: '',
      remark2: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
      },
    };
  },
  computed: {
    riskStyle() {
      switch (this.item.riskResult) {
        case '低危':
          return { color: '#32AE57' };
        case '中危':
          return { color: '#FF9000' };
        case '高危':
          return { color: '#F15F00' };
        case '极高危':
          return { color: '#FF220A ' };
      }
    },
    img() {
      switch (this.item.riskResult) {
        case '极高危':
          return jigaowei;
        case '高危':
          return gaowei;
        case '中危':
          return zhongwei;
        case '低危':
          return diwei;
      }
    },
  },
  mixins: [pagination, tableEdit, inspection],
  // components: { FollowupRecord },
  async created() {
    // this.$startLoading()
    // this.getInspectionNameList()
    // this.getInspectionTypeList()
    this.$apis.ExaminegetCheckTypeList().then((res) => {
      this.checkTypeList = res.examTypeList;
    });
    this.$apis.ExaminegetExamineList().then((res) => {
      this.inspectionNameList = res.list;
    });
    this.$apis.ExaminegetSampleList().then((res) => {
      this.inspectionTypeList = res.list;
    });
    await this.$apis
      .flupTypequeryFollowTypeList({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.followUpTypeList = res.list.filter((element) => {
          return (element.name == '定期检查' || element.name == '定期检验' || element.name == '慢病评估报告') && element.enable != 0;
        });
      });
    var ro = new ResizeObserver(this.$_.debounce(this.setPageSize, 300));
    ro.observe(this.$refs['audit_list']);
  },
  methods: {
    iframeSave() {
      if (this.$refs.iframe) {
        this.$refs.iframe.contentWindow.postMessage(
          {
            params: {
              form_id: this.item.formId,
              user_id: this.currentItem.userId,
              old_flup_phone: this.patientInfo.phone,
              flup_phone: '19999999999',
              flup_status: this.patientInfo.followupResult,
              flup_time_real: this.completeDate,
              IsSubmit: 0,
            },
          },
          '*'
        );
      }
    },
    async setPageSize(entries) {
      for (let entry of entries) {
        const cr = entry.contentRect;
        let oldPageSize = this.pageSize;
        this.pageSize = Math.floor((cr.height - 110) / 40);
        if (this.pageSize <= 0) {
          this.pageSize = 1;
        }
        if (oldPageSize !== this.pageSize) {
          await this.getMainList();
          this.$stopLoading();
        }
      }
    },
    classExpired(obj) {
      return obj.row.isExpired === 1 ? 'color-red' : '';
    },
    async onAudit(state) {
      // let userInfo
      let params;
      // await this.$apis
      //   .bgetPatientInfoByUserId({
      //     patientId: this.currentItem.userId
      //   })
      //   .then(res => {
      //     userInfo = res
      //   })

      if (this.currentItem.flupType == '定期检查') {
        // let ExamItemList = []
        // this.showList.forEach(element => {
        //   // let arr = element.split('|')
        //   ExamItemList.push({
        //     examBodyId: '',
        //     examBody: element.checkPart,
        //     examItemId: element.checkTypeCode,
        //     examItemName: element.checkType,
        //     applyClinicId: '',
        //     applyClinicName: '',
        //     examClinicId: '',
        //     examClinicName: ''
        //   })
        // })
        params = {
          serialNo: this.currentItem.serialNo,
          changeType: 'apply',
          authState: state,
          userId: this.currentItem.userId,
          // user_name: this.currentItem.patient_name,
          // sex: this.currentItem.sex,
          // age: this.$utils.getAge(userInfo.date_of_birth),
          // patientBirthday: this.$utils.formatDate(userInfo.date_of_birth),
          // id_no: this.currentItem.sex,
          // address: userInfo.contact_addr,
          // telephone: userInfo.contact_phone || userInfo.mobile,
          // ExamItemList: ExamItemList,
          // content: this.convertData(),
          // open_id: this.currentItem.open_id,
          appointmentTime: this.appointmentTime,
          remark2: this.remark2,
        };
      } else if (this.currentItem.flupType == '定期检验') {
        params = {
          serialNo: this.currentItem.serialNo,
          changeType: 'change',
          authState: state,
          content: this.convertData(),
          openId: this.currentItem.openId,
          userId: this.currentItem.userId,
          appointmentTime: this.appointmentTime,
          remark2: this.remark2,
        };
      } else if (this.currentItem.flupType == '慢病评估报告') {
        params = {
          serialNo: this.mbId,
          authState: state,
          changeType: 'chronicDisease',
          userId: this.currentItem.userId,
          appointmentTime: this.appointmentTime,
          remark2: this.remark2,
        };
        this.iframeSave();
      } else {
        params = {
          serialNo: this.currentItem.serialNo,
          authState: state,
          // userId: this.currentItem.patientId
        };
      }
      // if (this.currentItem.flupType != '慢病评估报告') {
      this.$apis.flupPatientPlanChangePatientPlanAuthState(params).then(async (res) => {
        this.$message({
          message: '审核成功',
          type: 'success',
        });
        this.appointmentTime = null;
        this.remark2 = '';
        await this.getMainList();
      });
      // this.$apis.changeChronicDiseaseReportAuthState(params).then(res => {
      //   if (res) {
      //     this.$message({
      //       message: '审核成功',
      //       type: 'success'
      //     })
      //     this.MBPGBGlist()
      //   }
      // })
    },
    deleteItem({ row, $index }) {
      if (this.showList.find((item) => item.isEdit)) {
        this.$message({
          message: '请保存后再操作',
          type: 'warning',
        });
        return;
      }
      if (this.showList.length === 1) {
        this.$message({
          message: '请保留一条检查项目',
          type: 'warning',
        });
        return;
      }
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.showList.splice($index, 1);
        this.$apis
          .flupPatientPlansaveSendCheckContent({
            serialNo: this.currentItem.serialNo,
            flupContent: this.convertData(),
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.getDetail();
          });
      });
    },
    formatState(row) {
      if (row.authState == 10) {
        return '待审核';
      } else {
        return '已审核';
      }
    },
    changePatient(item) {
      this.SendCheck = {};
      if (!item) {
        return;
      }
      this.currentItem = { ...item };
      if (this.currentItem.flupType === '定期检查') {
        this.editItem = {
          checkType: '',
          checkPart: '',
          checkItem: '',
          isEdit: true,
        };
      } else {
        this.editItem = {
          examType: '',
          examItem: '',
          isEdit: true,
        };
      }
      if (this.currentItem.flupType != '慢病评估报告') {
        this.getDetail();
      } else {
        this.getqueryBy(item);
      }
    },
    getqueryBy(item) {
      this.$apis
        .queryByIdExt({
          reportId: item.serialNo,
          userId: item.userId,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          if (res) {
            this.$apis
              .getFormById({
                id: res.riskFormId,
                templateId: res.riskType,
              })
              .then((res) => {
                this.url = res;
              });
            this.mbId = res.id;
            this.patientInfo = res.patientSimpleInfo;
            this.item = res;
            this.chartDataList = res.healthRiskReportRecordList.map((item) => {
              let rows = JSON.parse(item.data);
              if (item.type == 'bloodPressure') {
                this.bloodPressure =
                  (rows[rows.length - 1].bloodPressureL ? rows[rows.length - 1].bloodPressureL : '-') +
                  '/' +
                  (rows[rows.length - 1].bloodPressureH ? rows[rows.length - 1].bloodPressureH : '-');

                return {
                  data: {
                    columns: ['checkDatetime', 'bloodPressureH', 'bloodPressureL'],
                    rows,
                  },
                  unit: 'mmHg',
                  label: '血压',
                  labelMap: {
                    bloodPressureL: '舒张压',
                    bloodPressureH: '收缩压',
                  },
                };
              } else if (item.type == 'spo2') {
                return {
                  data: {
                    columns: ['checkDatetime', 'spo2'],
                    rows,
                  },
                  unit: '%',
                  label: '血氧',
                  labelMap: {
                    spo2: '血氧',
                  },
                };
              } else if (item.type == 'bloodSugar') {
                this.bloodSugar =
                  (rows[rows.length - 1].bloodSugarBeforeMeal ? rows[rows.length - 1].bloodSugarBeforeMeal : '-') +
                  '/' +
                  (rows[rows.length - 1].bloodSugarAfterMeal ? rows[rows.length - 1].bloodSugarAfterMeal : '-');
                return {
                  data: {
                    columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal', 'bloodSugar'],
                    rows,
                  },
                  unit: 'mmol/L',
                  label: '血糖',
                  labelMap: {
                    bloodSugarBeforeMeal: '餐前血糖',
                    bloodSugarAfterMeal: '餐后血糖',
                    bloodSugar: '随机血糖'
                  },
                };
              } else if (item.type == 'temperature') {
                return {
                  data: {
                    columns: ['checkDatetime', 'bodyTemperature'],
                    rows,
                  },
                  unit: '℃',
                  label: '体温',
                  labelMap: {
                    bodyTemperature: '体温',
                  },
                };
              } else if (item.type == 'bmi') {
                this.BMI = rows[rows.length - 1].bmi;
                return {
                  data: {
                    columns: ['checkDatetime', 'bmi'],
                    rows,
                  },
                  unit: '',
                  label: 'BMI',
                  labelMap: {
                    bmi: 'BMI',
                  },
                };
              } else if (item.type == 'heartRate') {
                return {
                  data: {
                    columns: ['checkDatetime', 'heartRate'],
                    rows,
                  },
                  unit: '次/分',
                  label: '心率',
                  labelMap: {
                    heartRate: '心率',
                  },
                };
              } else if (item.type == 'height') {
                this.height = rows[rows.length - 1].height;
                return {
                  data: {
                    columns: ['checkDatetime', 'height'],
                    rows,
                  },
                  unit: 'cm',
                  label: '身高',
                  labelMap: {
                    height: '身高',
                  },
                };
              } else if (item.type == 'weight') {
                this.weight = rows[rows.length - 1].weight;
                return {
                  data: {
                    columns: ['checkDatetime', 'weight'],
                    rows,
                  },
                  unit: 'kg',
                  label: '体重',
                  labelMap: {
                    weight: '体重',
                  },
                };
              } else if (item.type == 'waistLine') {
                return {
                  data: {
                    columns: ['checkDatetime', 'waistLine'],
                    rows,
                  },
                  unit: 'cm',
                  label: '腰围',
                  labelMap: {
                    waistLine: '腰围',
                  },
                };
              } else if (item.type == 'boneDensity') {
                return {
                  data: {
                    columns: ['checkDatetime', 'checkResult'],
                    rows,
                  },
                  unit: '',
                  label: '骨密度',
                  labelMap: {
                    checkResult: '骨密度',
                  },
                };
              }
            });
          } else {
            this.patientInfo = null;
            this.item = null;
            this.chartDataList = [];
          }
        });
    },
    getDetail() {
      return this.$apis
        .flupPatientPlangetSendCheckDetail({
          serialNo: this.currentItem.serialNo,
        })
        .then((res) => {
          this.SendCheck = res;
          this.appointmentTime = res.appointmentTime;
          this.remark2 = res.remark2;
          this.mainList = res.flupContent.split(',').map((item) => {
            if (this.currentItem.flupType === '定期检查') {
              return {
                checkType: item.split('|')[0],
                checkTypeCode: item.split('|')[1],
                checkPart: item.split('|')[2],
                checkPartCode: item.split('|')[3],
                checkItem: item.split('|')[4],
                checkItemCode: item.split('|')[5],
              };
            } else {
              return {
                examItem: item.split('|')[0],
                examItemCode: item.split('|')[1],
                examType: item.split('|')[2],
                examTypeCode: item.split('|')[3],
              };
            }
          });
        });
    },
    onSearch() {
      this.pageIndex = 1;
      this.queryserialNo = '';
      this.getMainList();
    },
    MBPGBGlist() {
      this.$apis
        .queryReportList({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          name: this.keyWords,
          flupType: this.followupTypeValue,
          authState: this.checkState || 0,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.patientList = res.list;
          this.total = res.total;
          this.$nextTick(() => {
            this.$refs.table.setCurrentRow(this.patientList[0]);
          });
        });
    },
    personInfo(row) {
      return `${this.$utils.shield(row.patientName, 1)}/${row.sex}/${this.$utils.getAge(row.dateOfBirth)}`;
    },
    getMainList() {
      return this.$apis
        .flupPatientPlangetSendCheckList({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          name: this.keyWords,
          serialNo: this.queryserialNo,
          flupType: this.followupTypeValue,
          authState: this.checkState || 0,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.patientList = res.list;
          this.total = res.total;
          this.$nextTick(() => {
            this.$refs.table.setCurrentRow(this.patientList[0]);
          });
        });
    },
    convertData() {
      return this.showList
        .map((element) => {
          if (this.currentItem.flupType === '定期检查') {
            return `${element.checkType}|${element.checkTypeCode}|${element.checkPart}|${element.checkPartCode}|${element.checkItem}|${element.checkItemCode}`;
          } else {
            return `${element.examItem}|${element.examItemCode}|${element.examType}|${element.examTypeCode}`;
          }
        })
        .join(',');
    },
    onConfirmEdit(row) {
      if (this.currentItem.flupType === '定期检查') {
        if (!row.checkType) {
          this.$message({
            type: 'warning',
            message: '请选择检查内容',
          });
          return;
        } else if (!row.checkPart) {
          this.$message({
            type: 'warning',
            message: '请选择检查部位',
          });
          return;
        } else if (!row.checkItem) {
          this.$message({
            type: 'warning',
            message: '请输入检查项目',
          });
          return;
        }
      } else {
        if (!row.examType) {
          this.$message({
            type: 'warning',
            message: '请选择样本类型',
          });
          return;
        } else if (!row.examItem) {
          this.$message({
            type: 'warning',
            message: '请输入检验名称',
          });
          return;
        }
      }
      this.$apis
        .flupPatientPlansaveSendCheckContent({
          serialNo: this.currentItem.serialNo,
          flupContent: this.convertData(),
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          row.isEdit = false;
          this.getDetail();
        });
    },
  },
};
</script>

<style lang="scss">
.audit {
  position: fixed;
  top: 20px;
  bottom: 86px;
  left: 20px;
  right: 20px;
  &_wrapper {
    position: relative;
    height: 100%;
    display: flex;
  }
  &_aside {
    width: 360px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f8f8f8;
  }
  &_main {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }
  &_list {
    flex: 1;
    overflow: hidden;
  }
  &_main_header {
    padding: 26px 20px;
    background-color: #f8f8f8;
    .label {
      color: #333;
    }
    .value {
      color: #111;
      margin-left: 20px;
      max-width: 200px;
    }
    .value + .label {
      margin-left: 50px;
    }
  }
}
.card {
  background: #ffffff;
  box-shadow: 0 4px 21px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8.45px;
  width: 320px;
  height: 400px;
}
</style>


