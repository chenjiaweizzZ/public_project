<template>
  <section v-if="renewal">
    <iframe
      v-if="currentItem.flupType === '专科随访'"
      class="iframe"
      ref="iframe"
      frameborder="0"
      scrolling="auto"
      :src="currentItem.flupAddress"
      style="min-height: 600px"
    ></iframe>
    <TemplateContent
      ref="template-content"
      v-else-if="
        currentItem.flupAddress &&
          ['调查问卷', '健康宣教'].includes(currentItem.flupType)
      "
      class="margin-top20"
      :type="currentItem.flupType == '健康宣教' ? 2 : 1"
      :query="templateQuery"
      @submit="saveQuesionaire"
      :questionnaireRecord="questionnaireRecord"
    ></TemplateContent>
    <div  v-else-if="['消息提醒', '定期复诊'].includes(currentItem.flupType)">
      <p style="white-space: pre-wrap;" v-html="currentItem.flupContent">
      </p>
    </div>
    <el-table
      v-else-if="['定期检查', '定期检验'].includes(currentItem.flupType)"
      :data="checkList"
      :key="currentItem.flupType"
      highlight-current-row
      stripe
      border
    >
      <el-table-column
        type="index"
        width="55"
        label="序号"
        fixed
      ></el-table-column>
      <template v-if="currentItem.flupType == '定期检查'">
        <div v-if="!patientSource">
          <el-table-column
            :formatter="formatCheckType"
            label="检查分类"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :formatter="formatCheckPart"
            label="检查部位"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :formatter="formatCheckItem"
            label="检查项目"
            show-overflow-tooltip
          ></el-table-column>
        </div>
        <div v-else>
          <el-table-column
            label="检查分类"
            prop="typeName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="检查部位"
            prop="bodyName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="检查项目"
            prop="itemName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="预约科室"
            prop="deptName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="预约时间"
            prop="appointmentDatetime"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="预约状态"
            :formatter="formatAppointStatus"
            show-overflow-tooltip
          ></el-table-column>
        </div>
      </template>
      <template v-else>
        <div>
          <el-table-column
            :formatter="formatInspectionType"
            label="检查名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            :formatter="formatInspectionName"
            label="样本类型"
            show-overflow-tooltip
          ></el-table-column>
        </div>
        <!-- <div v-else>
          <el-table-column label="检查名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="样本类型" show-overflow-tooltip></el-table-column>
          <el-table-column label="预约科室" show-overflow-tooltip></el-table-column>
          <el-table-column label="预约时间" show-overflow-tooltip></el-table-column>
          <el-table-column label="预约状态" show-overflow-tooltip></el-table-column>
        </div>-->
      </template>
    </el-table>
    <div v-else-if="currentItem.flupType == '慢病评估报告'">
      <div>
        <div
          v-if="item2.patientDisplay"
          class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20"
        >
          基本信息
        </div>
        <div v-if="item2.patientDisplay">
          <table class="table">
            <tr>
              <td class="table-label">姓名</td>
              <td class="table-value">{{ patientInfoX.patientName }}</td>
              <td class="table-label">性别</td>
              <td class="table-value">{{ patientInfoX.sex }}</td>
              <td class="table-label">年龄</td>
              <td class="table-value">{{ patientInfoX.age }}</td>
              <td class="table-label">电话</td>
              <td class="table-value">{{ patientInfoX.phone }}</td>
            </tr>

            <tr>
              <td class="table-label">身高</td>
              <td class="table-value">{{ height || "-" }}</td>
              <td class="table-label">体重</td>
              <td class="table-value">{{ weight || "-" }}</td>
              <td class="table-label">血压</td>
              <td class="table-value">{{ bloodPressure || "-" }}</td>
              <td class="table-label">血糖</td>
              <td class="table-value">{{ bloodSugar || "-" }}</td>
            </tr>
            <tr>
              <td class="table-label">体重指数</td>
              <td class="table-value">{{ BMI || "-" }}</td>
              <td class="table-label">吸烟</td>
              <td class="table-value">
                {{ patientInfoX.smokeHistory || "-" }}
              </td>
              <td class="table-label">饮酒</td>
              <td class="table-value">
                {{ patientInfoX.drinkHistory || "-" }}
              </td>
              <td class="table-label">降压情况</td>
              <td class="table-value">{{ "-" }}</td>
            </tr>
            <tr>
              <td class="table-label">既往史</td>
              <td class="table-value" colspan="7">
                {{ patientInfoX.pastHistory }}
              </td>
            </tr>
            <tr>
              <td class="table-label">家族慢病史</td>
              <td class="table-value" colspan="7">
                {{ patientInfoX.familyHistory }}
              </td>
            </tr>
            <tr>
              <td class="table-label">入院诊断</td>
              <td class="table-value" colspan="7">
                {{
                  patientInfoX.emAdmissionSimpleRecord &&
                    patientInfoX.emAdmissionSimpleRecord.presentHistory
                }}
              </td>
            </tr>
            <tr>
              <td class="table-label">家庭地址</td>
              <td class="table-value" colspan="7">
                {{ patientInfoX.homeAddrHouseNumber }}
              </td>
            </tr>
          </table>
        </div>
        <div
          v-if="item2.detectDisplay"
          class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20"
        >
          健康监测数据
        </div>
        <el-row
          v-if="item2.detectDisplay"
          type="flex"
          style="flex-wrap: wrap"
          class="padding20"
        >
          <div class="card" v-for="item in chartDataListX" :key="item.label">
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
        <el-row
          v-if="item2.riskDisplay"
          type="flex"
          justify="space-between"
          class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20"
        >
          风险评估
          <p>{{ item2.riskResult }}</p>
        </el-row>
        <div v-if="item2.riskDisplay" id="frambox" style="width: 100%">
          <iframe
            ref="iframex"
            id="iframex"
            width="100%"
            height="500"
            :src="url"
            frameborder="0"
          ></iframe>
        </div>
        <div
          v-if="item2.suggestionDisplay"
          class="padding-bottom12 font-size2 color-333 padding-top20"
        >
          健康建议
        </div>
        <div
          v-if="item2.suggestionDisplay"
          class="margin-top20 relative flex-column"
          style="height: 500px"
        >
          <!-- <el-row class="padding10 border-bottom1" type="flex" justify="space-between" align="middle"></el-row> -->
          <textarea
            class="textarea flex1"
            v-model="item2.suggestionContent"
            :disabled="
              currentItem.authState == 20 ||
                currentItem.authState == 30 ||
                currentItem.authState == 60
            "
            @blur="changeSuggestion"
          ></textarea>
        </div>
        <div
          v-if="item2.followDisplay"
          class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20"
        >
          随访安排
        </div>
        <div v-if="item2.followDisplay">
          <div class="margin-top14">下次随访安排</div>
          <div class="margin-top10 margin-left20">
            随访时间：{{ item2.followDate || "-" }}
          </div>
          <div class="margin-top10 margin-left20">
            随访内容：{{ item2.followContent || "-" }}
          </div>
          <div class="margin-top10 margin-left20">
            注意事项：{{ item2.followMark || "-" }}
          </div>
        </div>
        <div
          v-if="item2.informedDisplay"
          class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20"
        >
          知情同意书
        </div>
        <div
          v-if="item2.informedDisplay"
          class="pre-wrap margin-top14 padding-bottom60"
        >
          {{ item2.informedContent }}
        </div>
      </div>
      <!--解决ios兼容问题-->
      <div style="height:20px"></div>
    </div>
    <div v-else-if="currentItem.flupType == '处方提醒'">
      <div>
        <h4>当前发送进度: {{ preDetail[0].sendProgress }}</h4>
      </div>
      <div>
        <h4>任务时间: {{ preDetail[0].taskTime }}</h4>
      </div>

      <el-table
        style="margin-top: 20px"
        :data="preDetail"
        :key="currentItem.flupType"
        highlight-current-row
        stripe
        border
      >
        <el-table-column
          show-overflow-tooltip
          :width="50"
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column
          prop="drugName"
          label="药品名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="药物剂量"
          :formatter="formatDose"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :formatter="formatNum"
          label="数量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="drugDays"
          label="天数（天）"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="usageAndDosage"
          label="用法"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="firstSendTime"
          label="首条发送时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sendInterval"
          label="发送间隔（天）"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sendTimes"
          label="共计发送次数"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <el-row v-else type="flex" justify="center">
      <div class="nonexistenceData">一条记录都没有</div>
    </el-row>
  </section>
</template>

<script>
import VeLine from 'v-charts/lib/line.common';
import 'echarts/lib/component/title';
import TemplateContent from '@/components/tempalteContent';
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
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
      renewal: true,
      item2: {},
      patientInfoX: {},
      chartDataListX: [],
      preDetail: [],
      patientSource: false,
      checkList: [],
      bloodPressure: '-',
      bloodSugar: '-',
      weight: '-',
      BMI: '-',
      height: '-',
      url: null,
    };
  },
  name: 'view-task-content',
  props: {
    currentItem: Object,
    form: Object,
    questionnaireRecord: Object,
  },
  components: {
    TemplateContent,
    [VeLine.name]: VeLine,
  },
  computed: {
    templateQuery() {
      this.renewal = false;
      if (['调查问卷', '健康宣教'].includes(this.currentItem.flupType) && this.currentItem.flupAddress) {
        this.$nextTick(() => {
          this.renewal = true;
        });
        return {
          // master_id: this.currentItem.master_id,
          // user_id: this.currentItem.id_no,
          // version_number: this.currentItem.version_number,
          serialNo: this.currentItem.serialNo,
          // taskid: this.currentItem.serial_no
        };
      } else {
        return {};
      }
    },
  },
  created() {
    // console.log(this.form, this.currentItem, this.questionnaireRecord)
    window.addEventListener('message', this.onMessage);
    if (this.currentItem.flupType == '处方提醒') {
      this.$apis
        .getPrescriptionDrugByPlanSerialNo({
          serialNo: this.currentItem.serialNo,
        })
        .then((res) => {
          this.preDetail.push(res);
        });
    }
    if (this.currentItem.flupType == '定期检查') {
      // debugger;
      this.$apis
        .queryFlupConfigOne({
          hospitalId: this.$global.hospital_id,
          moduleCode: 'followUpSetting',
          componentKey: 'AppointmentLimitItem',
        })
        .then((res) => {
          this.patientSource = res.componentValue == '1' ? true : false;
          if (this.patientSource) {
            this.$apis
              .getPatientCheckItemList({
                serialNo: this.currentItem.serialNo,
              })
              .then((res) => {
                this.checkList = res;
              });
          } else {
            this.getContent();
          }
        });
    } else if (this.currentItem.flupType == '定期检验') {
      this.getContent();
    }
  },
  mounted() {
    if (this.currentItem.flupType == '慢病评估报告') {
      if (this.currentItem.status == '已过期' || this.currentItem.status == '待执行') {
        this.$apis
          .getDiseaseReport({
            planId: this.currentItem.flupPlanId,
            userId: this.$route.query.userId,
            hospitalId: this.$global.hospital_id,
            taskId: this.currentItem.serialNo,
          })
          .then((res) => {
            this.$apis
              .getFormById({
                id: res.riskFormId,
                templateId: res.riskType,
              })
              .then((res) => {
                this.url = res.replace('edit', 'createViaFormId');
              });
            this.item2 = res;
            this.patientInfoX = res.patientSimpleInfo;
            this.dialogVisible = true;
            if (res.healthRiskReportRecordList) {
              this.chartDataListX = res.healthRiskReportRecordList.map((item) => {
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
                      bloodSugar: "随机血糖"
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
            }
          });
      } else {
        this.$apis
          .reportAuditQueryById({
            planId: this.currentItem.flupPlanId,
            userId: this.$route.query.userId,
            hospitalId: this.$global.hospital_id,
            taskId: this.currentItem.serialNo,
            reportId: this.currentItem.serialNo,
          })
          .then((res) => {
            this.$apis
              .getFormById({
                id: res.riskFormId,
                templateId: res.riskType,
              })
              .then((res) => {
                this.url = res; //res.replace('edit', 'createViaFormId');
              });
            console.log(res, 'res', this.item2, 'this.item2');
            this.item2 = res;
            this.patientInfoX = res.patientSimpleInfo;
            this.dialogVisible = true;
            if (res.healthRiskReportRecordList) {
              this.chartDataListX = res.healthRiskReportRecordList.map((item) => {
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
                      bloodSugar: "随机血糖"
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
            }
            this.$emit('update:item', JSON.parse(JSON.stringify(res)));
          });
      }
    }
  },
  methods: {
    onMessage(e) {
      if (e.data.height) {
        //专科随访iframe高度设置
        this.$refs.iframe.style.height = e.data.height + 100 + 'px';
        this.isLoadingUrl = false;
      } else if (e.data.data) {
        //专科随访提交成功回调
        if (e.data.data.ret_code == 0) {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.$emit('refresh');
        } else {
          this.$message({
            type: 'error',
            message: e.data.data.ret_info,
          });
        }
      }
    },
    getContent() {
      // debugger;
      //读取本地数据源
      this.$apis
        .queryFlupConfigOne({
          hospitalId: this.$global.hospital_id,
          moduleCode: 'followUpSetting',
          componentKey: 'AppointmentLimitItem',
        })
        .then((res) => {
          this.checkList = this.currentItem.flupContent.split(',');
        });
    },
    formatCheckType(row) {
      return row.split('|')[0];
    },
    formatCheckPart(row) {
      return row.split('|')[2];
    },
    formatCheckItem(row) {
      return row.split('|')[4];
    },
    formatInspectionType(row) {
      return row.split('|')[0];
    },
    formatInspectionName(row) {
      return row.split('|')[2];
    },
    formatDose(row) {
      return row.drugDose + row.drugDoseUnit;
    },
    formatNum(row) {
      return row.drugNum + row.drugNumUnit;
    },
    saveQuesionaire(v) {
      this.$apis
        .updateFollowupTaskInfo({
          serial_no: this.currentItem.serial_no,
          old_flup_phone: this.currentItem.mobile || this.currentItem.phone || this.currentItem.contact_phone,
          flup_phone: this.form.editPhone,
          flup_status: this.form.followupResult,
          questionnaire: v,
        })
        .then((res) => {
          this.$message({
            message: '提交成功',
            type: 'success',
          });
          this.$emit('refresh');
        });
    },
    getAnswerContent() {
      return this.$refs['template-content'].$refs['question'].getAnswerContent();
    },
    formatAppointStatus(row) {
      switch (row.isAppointment) {
        case 0:
          return '未预约';
        case 1:
          return '已预约';
        case -1:
          return '已取消';
        default:
          return '';
      }
    },
    //编辑健康建议
    changeSuggestion(val) {
      this.$emit('changeSuggestion', this.item2.suggestionContent);
    },
  },
  destroyed() {
    window.removeEventListener('message', this.onMessage);
  },
};
</script>

<style lang="scss" scoped>
.iframe {
  overflow-y: hidden;
  width: 100%;
  min-height: 200px;
}
.card {
  background: #ffffff;
  box-shadow: 0 4px 21px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8.45px;
  width: 320px;
  height: 400px;
}
.textarea {
  border: 1px solid #d7dae0;
  padding: 10px;
  border-radius: 4px;
}
</style>
