//评估报告预览
<template>
  <div class="ylys">
    <!-- pc端样式 -->
    <div style="transform: scale(0.8)" class="text-align-center font-size10 bold" v-if="!from">
      {{ item.title }}
      <div v-if="item.reportId" class="font-size2 color-333 text-align-right">报告ID: {{ item.reportId }}</div>
    </div>
    <!-- 手机端样式 -->
    <div v-else class="phone_title">
      <div class="title_bg">
        <img src="~@/assets/images/ncdReport.png" alt />
      </div>

      <div class="float_text">
        <div class="title">{{ item.title }}</div>
        <div class="text">报告ID: {{ item.reportId }}</div>
      </div>
    </div>
    <div v-if="item.patientDisplay&&!from" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">基本信息</div>
    <div v-if="item.patientDisplay&&!from">
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
          <td class="table-value">{{ bloodSugar || "-" }}</td>
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
      <div class="card" v-for="item in chartDataListX" :key="item.label">
        <ve-line class="margin-top10" :title="{ text: item.label, left: 16 }" :data="item.data" :colors="VLineColors" :grid="VLineGrid" :settings="{ labelMap: item.labelMap }"></ve-line>
      </div>
    </el-row>
    <el-row v-if="item.riskDisplay" type="flex" justify="space-between" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">
      风险评估
      <p>{{ item.riskResult }}</p>
    </el-row>
    <div v-if="item.riskDisplay" id="frambox" style="height: 60vh">
      <iframe id="iframex" style="height: 60vh" width="100%" :src="url" frameborder="0"></iframe>
    </div>
    <div v-if="item.suggestionDisplay" class="padding-bottom12 font-size2 color-333 margin-top20">健康建议</div>
    <div v-if="item.suggestionDisplay" class="margin-top20 relative flex-column">
      <p style=" white-space: pre-wrap;" v-text="item.suggestionContent"></p>
    </div>
    <div v-if="item.followDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">随访安排</div>
    <div v-if="item.followDisplay">
      <div class="margin-top14">下次随访安排</div>
      <div class="margin-top10 margin-left20">随访时间：{{ item.followDate || "-" }}</div>
      <div class="margin-top10 margin-left20">随访内容：{{ item.followContent || "-" }}</div>
      <div class="margin-top10 margin-left20">注意事项：{{ item.followMark || "-" }}</div>
    </div>
    <div v-if="item.informedDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">知情同意书</div>
    <div v-if="item.informedDisplay" style="word-wrap: break-word; word-break: break-all" class="pre-wrap margin-top14">{{ item.informedContent }}</div>
    <!-- 手机端患者信息 -->
    <div v-if="from" class="patient_info">
      <div v-if="item.patientDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20 margin-bottom10">基本信息</div>
      <div class="info_item">
        <label>姓名</label>
        <span class="info">{{ patientInfo.patientName }}</span>
      </div>
      <div class="info_item">
        <label>性别</label>
        <span class="info">{{ patientInfo.sex }}</span>
      </div>
      <div class="info_item">
        <label>年龄</label>
        <span class="info">{{ patientInfo.age }}</span>
      </div>
      <div class="info_item">
        <label>电话</label>
        <span class="info">{{ patientInfo.phone }}</span>
      </div>
      <div class="info_item">
        <label>身高</label>
        <span class="info">{{ height || "-" }}</span>
      </div>
      <div class="info_item">
        <label>体重</label>
        <span class="info">{{ weight || "-"}}</span>
      </div>
      <div class="info_item">
        <label>血压</label>
        <span class="info">{{bloodPressure || "-" }}</span>
      </div>
      <div class="info_item">
        <label>血糖</label>
        <span class="info">{{ bloodSugar || "-" }}</span>
      </div>
      <div class="info_item">
        <label>体重指数</label>
        <span class="info">{{ BMI || "-" }}</span>
      </div>
      <div class="info_item">
        <label>吸烟</label>
        <span class="info">{{ patientInfo.smokeHistory || "-" }}</span>
      </div>
      <div class="info_item">
        <label>饮酒</label>
        <span class="info">{{ patientInfo.drinkHistory || "-"}}</span>
      </div>
      <div class="info_item">
        <label>降压情况</label>
        <span class="info">{{ "-" }}</span>
      </div>
      <div class="info_item">
        <label>既往史</label>
        <span class="info">{{ patientInfo.pastHistory}}</span>
      </div>
      <div class="info_item">
        <label>家族慢病史</label>
        <span class="info">{{ patientInfo.familyHistory }}</span>
      </div>
      <div class="info_item">
        <label>入院诊断</label>
        <span class="info">{{ patientInfo.emAdmissionSimpleRecord && patientInfo.emAdmissionSimpleRecord.presentHistory }}</span>
      </div>
      <div class="info_item">
        <label>家庭地址</label>
        <span class="info">{{patientInfo.homeAddrHouseNumber}}</span>
      </div>
    </div>
    <!--解决ios兼容问题-->
    <div style="height:20px"></div>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common';
import 'echarts/lib/component/title';
export default {
  components: {
    [VeLine.name]: VeLine,
  },
  data() {
    this.VLineColors = ['#19d4ae', '#5ab1ef', '#fa6e86'];
    this.VLineGrid = { left: 10 };
    return {
      dialogVisible: false,
      activeName: '1',
      recordList: [],
      patientInfo: {},
      item: {},
      sideRightOpen: false,
      defaultProps: {
        label: 'node',
      },
      activeTemplate: 0,
      configList: [],
      chartDataList: [],
      reportType: null,
      reportList: [],
      showIndex: true,
      active: '当前',
      historyList: [],
      patientInfoX: {},
      chartDataListX: [],
      serialNumberlist: [1],
      historyListx: [],
      historyLists: [],
      url: null,
      bloodPressure: '-',
      bloodSugar: '-',
      weight: '-',
      BMI: '-',
      height: '-',
      from: '', //当前页面适配条件
    };
  },
  created() {
    this.from = this.$route.query.from || '';
  },
  watch: {},
  mounted() {
    this.$apis.cqueryById({ reportId: this.$route.query.reportId }).then((res) => {
      this.item = res;
      this.$apis
        .getFormById({
          id: this.item.riskFormId,
          templateId: this.$route.query.riskType,
        })
        .then((res) => {
          this.url = res;
        });
      this.patientInfo = res.patientSimpleInfo;
      this.dialogVisible = true;
      if (res.healthRiskReportRecordList) {
        this.chartDataListX = res.healthRiskReportRecordList.map((item) => {
          let rows = JSON.parse(item.data);
          rows = rows.map((element) => {
            var valueDetal = element.checkDatetime.split(' ');
            console.log(111, valueDetal);
            element.checkDatetime =
              // this.$utils.formatDate(
              // element.checkDatetime
              valueDetal[0] + '\n' + valueDetal[1];
            // )
            return element;
          });
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
      }
    });
  },
  methods: {},
};
</script>

<style lang="scss">
.ylys {
  padding: 0px 10px 10px;

  // span,
  // p,
  // h1,
  td {
    transform: scale(0.8);
  }
  .table .table-label,
  .table .table-value {
    padding: 0;
    margin: 0;
  }
  .el-carousel__arrow--left,
  .el-carousel__arrow--right {
    background: rgb(255, 255, 255);
    color: black;
  }
  .textarea {
    border: 0;
    padding: 10px;
    flex: 1;
    font-size: 14px;
    font-family: 'PingFangSC-Regular', 'microsoft yahei', 'Arial' !important;
  }
  .side-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    right: 0;
    transition: width ease 0.3s;
    background: #fff;
  }
  .card {
    background: #ffffff;
    box-shadow: 0 4px 21px 0 rgba(0, 0, 0, 0.08);
    border-radius: 8.45px;
    width: 320px;
    height: 400px;
  }
  .level {
    position: relative;
    height: 60px;
    color: #fff;
    text-align: center;
    line-height: 60px;
    // background-color: #32ae57;
    // margin: 0 40px;
  }
  .level-1 {
    background-color: #32ae57;
    margin: 0 40px;
    margin-top: 10px;
  }
  .level-2 {
    background-color: #ff9000;
    margin: 0 80px;
    margin-top: 10px;
  }
  .level-3 {
    background-color: #f15f00;
    margin: 0 120px;
    margin-top: 10px;
  }
  .level-4 {
    width: 0;
    margin: 0 121px;
    border-left: 29px solid transparent;
    border-right: 29px solid transparent;
    border-bottom: 58px solid #ff220a;
    position: relative;
    .text {
      position: absolute;
      width: 40px;
      left: -18px;
      bottom: -55px;
      color: #fff;
      font-size: 12px;
    }
  }
  .level:before {
    z-index: -1;
    content: '';
    display: block;
    width: 40px;
    height: 60px;
    position: absolute;
    transform: skewX(-30deg);
    left: -20px;
    top: 0;
  }
  .level:after {
    content: '';
    z-index: -1;
    display: block;
    width: 40px;
    height: 60px;
    position: absolute;
    transform: skewX(30deg);
    right: -20px;
    top: 0;
  }
  .level-1::before,
  .level-1::after {
    background: #32ae57;
  }
  .level-2::before,
  .level-2::after {
    background: #ff9000;
  }
  .level-3::before,
  .level-3::after {
    background: #f15f00;
  }
  .riskResult {
    background: #ffffff;
    border-radius: 16px;
    line-height: 28px;
    min-width: 90px;
    margin-left: 10px;
    padding: 0 12px;
    text-align: center;
    font-weight: bold;
  }
}
</style>
<style scoped lang="scss">
.ylys {
  .phone_title {
    // height: 88px;

    opacity: 1;
    box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.08);
    font-family: 苹方-简;
    padding: 22px 20px;
    margin-top: 10px;
    // background: #fff url('~@/assets/images/ncdReport.png') no-repeat;
    // background-size: cover;
    padding: 0;
    position: relative;
    .title_bg {
      width: 100%;
      height: 88px;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
    .float_text {
      position: absolute;
      top: 0;
      left: 20px;
      .title {
        font-size: 17px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.2px;
        color: #ffffff;
        text-shadow: 0px 2px 2px 0px rgba(1, 54, 97, 0.24);
        margin-bottom: 8px;
        padding-top: 24px;
      }
      .text {
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0.17px;
        color: rgba(255, 255, 255, 0.8);
        padding-bottom: 22px;
      }
    }
  }
  .patient_info {
    // padding: 14px;
    .info_item {
      font-family: 苹方-简;
      font-size: 16px;
      font-weight: normal;
      line-height: 19px;
      display: flex;
      margin-bottom: 10px;
      label {
        letter-spacing: 0.2px;
        color: #666666;
        display: inline-block;
        width: 90px;
      }
      .info {
        letter-spacing: 0.2px;
        color: #111111;
        display: inline-block;
        width: 100%;
        text-align: right;
      }
    }
  }
}
</style>
