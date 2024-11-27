<template>
  <section v-if="renewal">
    <iframe
      v-if="planDetailContent.flupType === '专科随访'"
      class="iframe"
      ref="iframe"
      frameborder="0"
      scrolling="auto"
      :src="planDetailContent.flupAddress"
      style="min-height: 600px"
    ></iframe>
    <TemplateContent
      ref="templateContentRef"
      v-else-if="
        planDetailContent.flupAddress &&
        ['调查问卷', '健康宣教'].includes(planDetailContent.flupType)
      "
      class="margin-top20"
      :type="planDetailContent.flupType == '健康宣教' ? 2 : 1"
      :query="templateQuery"
      :planDetailContent="planDetailContent"
      @submit="saveQuesionaire"
      :questionnaireRecord="questionnaireRecord"
    ></TemplateContent>
    <div v-else-if="['消息提醒', '定期复诊'].includes(planDetailContent.flupType)">{{ planDetailContent.flupContent }}</div>
    <el-table v-else-if="['定期检查', '定期检验'].includes(planDetailContent.flupType)" :data="checkList" :key="planDetailContent.flupType" highlight-current-row stripe border>
      <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
      <template v-if="planDetailContent.flupType == '定期检查'">
        <div v-if="!patientSource">
          <el-table-column :formatter="formatCheckType" label="检查分类" show-overflow-tooltip></el-table-column>
          <el-table-column :formatter="formatCheckPart" label="检查部位" show-overflow-tooltip></el-table-column>
          <el-table-column :formatter="formatCheckItem" label="检查项目" show-overflow-tooltip></el-table-column>
        </div>
        <div v-else>
          <el-table-column label="检查分类" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="检查部位" prop="bodyName" show-overflow-tooltip></el-table-column>
          <el-table-column label="检查项目" prop="itemName" show-overflow-tooltip></el-table-column>
          <el-table-column label="预约科室" prop="deptName" show-overflow-tooltip></el-table-column>
          <el-table-column label="预约时间" prop="appointmentDatetime" show-overflow-tooltip></el-table-column>
          <el-table-column label="预约状态" :formatter="formatAppointStatus" show-overflow-tooltip></el-table-column>
        </div>
      </template>
      <template v-else>
        <div>
          <el-table-column :formatter="formatInspectionType" label="检查名称" show-overflow-tooltip></el-table-column>
          <el-table-column :formatter="formatInspectionName" label="样本类型" show-overflow-tooltip></el-table-column>
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
    <div v-else-if="planDetailContent.flupType == '慢病评估报告'">
      <div>
        <div v-if="item2.patientDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">基本信息</div>
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
              <td class="table-value">{{ patientInfoX.smokeHistory || "-" }}</td>
              <td class="table-label">饮酒</td>
              <td class="table-value">{{ patientInfoX.drinkHistory || "-" }}</td>
              <td class="table-label">降压情况</td>
              <td class="table-value">{{ "-" }}</td>
            </tr>
            <tr>
              <td class="table-label">既往史</td>
              <td class="table-value" colspan="7">{{ patientInfoX.pastHistory }}</td>
            </tr>
            <tr>
              <td class="table-label">家族慢病史</td>
              <td class="table-value" colspan="7">{{ patientInfoX.familyHistory }}</td>
            </tr>
            <tr>
              <td class="table-label">入院诊断</td>
              <td class="table-value" colspan="7">{{ patientInfoX.emAdmissionSimpleRecord && patientInfoX.emAdmissionSimpleRecord.presentHistory }}</td>
            </tr>
            <tr>
              <td class="table-label">家庭地址</td>
              <td class="table-value" colspan="7">{{ patientInfoX.homeAddrHouseNumber }}</td>
            </tr>
          </table>
        </div>
        <div v-if="item2.detectDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">健康监测数据</div>
        <el-row v-if="item2.detectDisplay" type="flex" style="flex-wrap: wrap" class="padding20">
          <div class="card" v-for="item in chartDataListX" :key="item.label">
            <!-- <ve-line
              class="margin-top10"
              :title="{ text: item.label, left: 16 }"
              :data="item.data"
              :colors="VLineColors"
              :grid="VLineGrid"
              :settings="{ labelMap: item.labelMap }"
              :extend="lienExtend"
            ></ve-line>-->
          </div>
        </el-row>
        <el-row v-if="item2.riskDisplay" type="flex" justify="space-between" class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20">
          风险评估
          <p>{{ item2.riskResult }}</p>
        </el-row>
        <div v-if="item2.riskDisplay" id="frambox" style="width: 100%">
          <iframe ref="iframex" id="iframex" width="100%" height="500" :src="url" frameborder="0"></iframe>
        </div>
        <div v-if="item2.suggestionDisplay" class="padding-bottom12 font-size2 color-333 padding-top20">健康建议</div>
        <div v-if="item2.suggestionDisplay" class="margin-top20 relative flex-column" style="height: 500px">
          <!-- <el-row class="padding10 border-bottom1" type="flex" justify="space-between" align="middle"></el-row> -->
          <textarea class="textarea flex1" disabled v-model="item2.suggestionContent"></textarea>
        </div>
        <div v-if="item2.followDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20">随访安排</div>
        <div v-if="item2.followDisplay">
          <div class="margin-top14">下次随访安排</div>
          <div class="margin-top10 margin-left20">随访时间：{{ item2.followDate || "-" }}</div>
          <div class="margin-top10 margin-left20">随访内容：{{ item2.followContent || "-" }}</div>
          <div class="margin-top10 margin-left20">注意事项：{{ item2.followMark || "-" }}</div>
        </div>
        <div v-if="item2.informedDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20">知情同意书</div>
        <div v-if="item2.informedDisplay" class="pre-wrap margin-top14 padding-bottom60">{{ item2.informedContent }}</div>
      </div>
      <!--解决ios兼容问题-->
      <div style="height:20px"></div>
    </div>
    <div v-else-if="planDetailContent.flupType == '处方提醒'">
      <div>
        <h4>当前发送进度: {{ preDetail[0].sendProgress }}</h4>
      </div>
      <div>
        <h4>任务时间: {{ preDetail[0].taskTime }}</h4>
      </div>

      <el-table style="margin-top: 20px" :data="preDetail" :key="planDetailContent.flupType" highlight-current-row stripe border>
        <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
        <el-table-column prop="drugName" label="药品名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="药物剂量" :formatter="formatDose" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatNum" label="数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drugDays" label="天数（天）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="usageAndDosage" label="用法" show-overflow-tooltip></el-table-column>

        <el-table-column prop="firstSendTime" label="首条发送时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sendInterval" label="发送间隔（天）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sendTimes" label="共计发送次数" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-row v-else type="flex" justify="center">
      <div class="nonexistenceData">一条记录都没有</div>
    </el-row>
  </section>
</template>

<script setup>
import { onMounted, ref, inject, toRefs, defineProps, defineExpose, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
// import VeLine from 'v-charts/lib/line.common';
// import 'echarts/lib/component/title';
import TemplateContent from './tempalteContent.vue';
const _http = inject('http');
const _apiUrl = inject('apiUrl');
const userId = ref('');
const VLineColors = ref(['#19d4ae', '#5ab1ef', '#fa6e86']);
const VLineGrid = ref({ left: 10, right: 30 });
const lienExtend = ref({
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
});
const renewal = ref(true);
const item2 = ref({});
const patientInfoX = ref({});
const chartDataListX = ref([]);
const preDetail = ref([]);
const patientSource = ref(false);
const checkList = ref([]);
const bloodPressure = ref('-');
const bloodSugar = ref('-');
const weight = ref('-');
const BMI = ref('-');
const height = ref('-');
const url = ref(null);
const props = defineProps({
  planDetailContent: Object,
  form: Object,
  questionnaireRecord: Object,
});
const iframe = ref();
const iframex = ref();
const templateContentRef = ref();
//使用父组件传递过来的值
const { planDetailContent, form, questionnaireRecord } = toRefs(props);
const emit = defineEmits(['changeItem', 'refresh']);
const templateQuery = () => {
  renewal.value = false;
  if (['调查问卷', '健康宣教'].includes(planDetailContent.value.flupType) && planDetailContent.value.flupAddress) {
    renewal.value = true;
    return {
      // master_id: planDetailContent.value.master_id,
      // user_id: planDetailContent.value.id_no,
      // version_number: planDetailContent.value.version_number,
      serialNo: planDetailContent.value.serialNo,
      // taskid: planDetailContent.value.serial_no
    };
  } else {
    return {};
  }
};

onMounted(() => {
  // console.log(planDetailContent, 'kkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  // window.addEventListener('message', this.onMessage);
  if (planDetailContent.value.flupType == '处方提醒') {
    _http
      .get(_apiUrl.getFlupPatientPlusPlan, {
        params: {
          serialNo: planDetailContent.value.serialNo,
        },
      })
      .then((res) => {
        preDetail.value.push(res);
      });
  }
  if (planDetailContent.value.flupType == '定期检查') {
    _http
      .get(_apiUrl.getFlupPatientPlusPlan, {
        params: {
          hospitalId: planDetailContent.value.hospitalId, //医院id写死了1118033010334208499要改
          moduleCode: 'followUpSetting',
          componentKey: 'AppointmentLimitItem',
        },
      })
      .then((res) => {
        if (res) {
          patientSource.value = res.componentValue == '1' ? true : false;
          if (patientSource.value) {
            _http
              .get(_apiUrl.getPatientCheckItemList, {
                params: {
                  serialNo: planDetailContent.value.serialNo,
                },
              })
              .then((res) => {
                checkList.value = res;
              });
          } else {
            getContent();
          }
        } else {
          ElMessage.error('当前系统错误');
        }
      });
  } else if (planDetailContent.value.flupType == '定期检验') {
    getContent();
  }
  toDo();
});
const toDo = () => {
  // console.log('kkkkkkkkkkkk', planDetailContent.value.flupType);
  if (planDetailContent.value.flupType == '慢病评估报告') {
    if (planDetailContent.value.status == '已过期' || planDetailContent.value.status == '待执行') {
      _http
        .get(_apiUrl.getDiseaseReport, {
          params: {
            planId: planDetailContent.value.flupPlanId,
            userId: planDetailContent.value.userId, //////////////要改
            hospitalId: planDetailContent.value.hospitalId, //医院id写死了1118033010334208499要改
            taskId: planDetailContent.value.serialNo,
          },
        })
        .then((res) => {
          _http
            .get(_apiUrl.getFormById, {
              params: {
                id: res.riskFormId,
                templateId: res.riskType,
              },
            })
            .then((res) => {
              url.value = res.replace('edit', 'createViaFormId');
            });
          item2.value = res;
          patientInfoX.value = res.patientSimpleInfo;
          // this.dialogVisible = true;//////////////要改
          if (res.healthRiskReportRecordList) {
            chartDataListX.value = res.healthRiskReportRecordList.map((item) => {
              let rows = JSON.parse(item.data);
              if (item.type == 'bloodPressure') {
                bloodPressure.value =
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
                bloodSugar.value =
                  (rows[rows.length - 1].bloodSugarBeforeMeal ? rows[rows.length - 1].bloodSugarBeforeMeal : '-') +
                  '/' +
                  (rows[rows.length - 1].bloodSugarAfterMeal ? rows[rows.length - 1].bloodSugarAfterMeal : '-');
                return {
                  data: {
                    columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal'],
                    rows,
                  },
                  unit: 'mmol/L',
                  label: '血糖',
                  labelMap: {
                    bloodSugarBeforeMeal: '餐前血糖',
                    bloodSugarAfterMeal: '餐后血糖',
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
                BMI.value = rows[rows.length - 1].bmi;
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
                height.value = rows[rows.length - 1].height;
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
                weight.value = rows[rows.length - 1].weight;
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
      _http
        .get(_apiUrl.reportAuditQueryById, {
          params: {
            planId: planDetailContent.value.flupPlanId,
            userId: planDetailContent.value.userId,
            hospitalId: planDetailContent.value.hospitalId, //医院id写死了1118033010334208499要改
            taskId: planDetailContent.value.serialNo,
            reportId: planDetailContent.value.serialNo,
          },
        })
        .then((res) => {
          _http
            .get(_apiUrl.getFormById, {
              params: {
                id: res.riskFormId,
                templateId: res.riskType,
              },
            })
            .then((res) => {
              url.value = res; //res.replace('edit', 'createViaFormId');
            });
          item2.value = res;
          patientInfoX.value = res.patientSimpleInfo;
          // this.dialogVisible = true;//////////////要改
          if (res.healthRiskReportRecordList) {
            chartDataListX.value = res.healthRiskReportRecordList.map((item) => {
              let rows = JSON.parse(item.data);
              if (item.type == 'bloodPressure') {
                bloodPressure.value =
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
                bloodSugar.value =
                  (rows[rows.length - 1].bloodSugarBeforeMeal ? rows[rows.length - 1].bloodSugarBeforeMeal : '-') +
                  '/' +
                  (rows[rows.length - 1].bloodSugarAfterMeal ? rows[rows.length - 1].bloodSugarAfterMeal : '-');
                return {
                  data: {
                    columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal'],
                    rows,
                  },
                  unit: 'mmol/L',
                  label: '血糖',
                  labelMap: {
                    bloodSugarBeforeMeal: '餐前血糖',
                    bloodSugarAfterMeal: '餐后血糖',
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
                BMI.value = rows[rows.length - 1].bmi;
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
                height.value = rows[rows.length - 1].height;
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
                weight.value = rows[rows.length - 1].weight;
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
          emit('changeItem', JSON.stringify(res));
        });
    }
  }
};
const onMessage = (e) => {
  if (e.data.height) {
    //专科随访iframe高度设置
    iframe.value.style.height = e.data.height + 100 + 'px';
    // this.isLoadingUrl = false;
  } else if (e.data.data) {
    //专科随访提交成功回调
    if (e.data.data.ret_code == 0) {
      ElMessage({
        message: '操作成功',
        type: 'success',
      });
      // this.$emit('refresh');
    } else {
      ElMessage.error('e.data.data.ret_info');
    }
  }
};
// 输出组件的方法，让外部组件可以调用
defineExpose({
  getAnswerContent,
  postMessage,
});
// destroyed() {
//   window.removeEventListener('message', this.onMessage);
// },
const getContent = () => {
  //读取本地数据源
  _http
    .get(_apiUrl.queryFlupConfigOne, {
      params: {
        hospitalId: planDetailContent.value.hospitalId, //医院id写死了1118033010334208499要改
        moduleCode: 'followUpSetting',
        componentKey: 'AppointmentLimitItem',
      },
    })
    .then((res) => {
      checkList.value = planDetailContent.value.flupContent.split(',');
    });
};
function formatCheckType(row) {
  return row.split('|')[0];
}
function formatCheckPart(row) {
  return row.split('|')[2];
}
function formatCheckItem(row) {
  return row.split('|')[4];
}
function formatInspectionType(row) {
  return row.split('|')[0];
}
function formatInspectionName(row) {
  return row.split('|')[2];
}
function formatDose(row) {
  return row.drugDose + row.drugDoseUnit;
}
function formatNum(row) {
  return row.drugNum + row.drugNumUnit;
}

function saveQuesionaire(v) {
  _http
    .post(_apiUrl.updateFollowupTaskInfo, {
      params: {
        serial_no: planDetailContent.value.serial_no,
        old_flup_phone: planDetailContent.value.mobile || planDetailContent.value.phone || planDetailContent.value.contact_phone,
        flup_phone: form.editPhone,
        flup_status: form.followupResult,
        questionnaire: v,
      },
    })
    .then((res) => {
      ElMessage({
        message: '操作成功',
        type: 'success',
      });
      emit('refresh');
    });
}

function getAnswerContent() {
  return templateContentRef.value.getAnswerContent();
}
function postMessage(obj) {
  console.log(iframe.value, iframex.value);
  if (iframe.value) {
    iframe.value.contentWindow.postMessage(
      {
        params: obj,
      },
      '*'
    );
  } else if (iframex.value) {
    iframex.value.contentWindow.postMessage(
      {
        params: obj,
      },
      '*'
    );
  }
}
function formatAppointStatus(row) {
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
}
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
</style>
