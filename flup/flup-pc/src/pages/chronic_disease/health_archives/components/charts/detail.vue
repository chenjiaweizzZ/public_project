<template>
  <div class="chart-detail">
    <el-button class="chart-detail_btn" size="mini" plain @click="$parent.showDetail = false">返回</el-button>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="近一周" name="1"></el-tab-pane>
      <el-tab-pane label="近一月" name="2"></el-tab-pane>
      <el-tab-pane label="近三月" name="3"></el-tab-pane>
      <el-tab-pane label="近半年" name="4"></el-tab-pane>
      <el-tab-pane label="全部" name="0"></el-tab-pane>
    </el-tabs>
    <el-row class="margin-top20" type="flex">
      <div class="flex1 border1 padding20">
        <el-row class="border-bottom1 padding-bottom8" type="flex" align="middle" justify="space-between">
          <div>{{ `${title}数据环形图` }}</div>
        </el-row>
        <ve-ring class="margin-top10" :data="vRingData" :colors="VRingColors" :settings="VRingSettings"></ve-ring>
        <el-row class="pre-wrap">{{ `上传总次数：${dataList.length} 上次${title}：${lastData}` }}</el-row>
      </div>
      <div class="flex1 border1 padding20 margin-left20">
        <el-row class="border-bottom1 padding-bottom8" type="flex" align="middle" justify="space-between">
          <div>{{ `${title}数据折线图` }}</div>
        </el-row>
        <ve-line
          class="margin-top10"
          :data="vLineData"
          :colors="VLineColors"
          :height="VLineHeight"
          :grid="VLineGrid"
          :scale="VLineScale"
          :settings="VLineSetting"
          :extend="lienExtend"
        ></ve-line>
      </div>
    </el-row>
    <div class="padding-top20 padding-bottom10 border-bottom1 font-size2 color-333">{{ title }}数据列表</div>
    <el-table class="margin-top20" :data="dataList" border stripe>
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column v-for="item in columns" :key="item.prop" :label="item.label" :prop="item.prop" :formatter="item.formatter" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common';
import VeRing from 'v-charts/lib/ring.common';
let enumData = {
  bloodPressure: {
    unitKey: 'bloodPressureUnit',
    valueKey: 'bloodPressureH|bloodPressureL',
    label: '血压',
    columns: ['checkDatetime', 'bloodPressureH', 'bloodPressureL'],
    labelMap: {
      bloodPressureL: '舒张压',
      bloodPressureH: '收缩压',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '收缩压', prop: 'bloodPressureH' },
      { label: '舒张压', prop: 'bloodPressureL' },
      { label: '脉压差', prop: 'a' },
      { label: '脉率', prop: 'heartRate' },
      { label: '状态', prop: 'state' },
    ],
  },
  spo2: {
    unitKey: 'spo2Unit',
    valueKey: 'spo2',
    label: '血氧',
    columns: ['checkDatetime', 'spo2'],
    labelMap: {
      spo2: '血氧',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '血氧', prop: 'spo2' },
      // { label: '脉率', prop: 'heartRate' },
      { label: '状态', prop: 'state' },
    ],
  },
  bloodSugar: {
    unitKey: 'sugarUnit',
    valueKey: 'bloodSugarBeforeMeal|bloodSugarAfterMeal',
    label: '血糖',
    columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal', "bloodSugar"],
    labelMap: {
      bloodSugarBeforeMeal: '餐前血糖',
      bloodSugarAfterMeal: '餐后血糖',
      bloodSugar: '随机血糖'
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '血糖', prop: 'bloodSugar' },
      // { label: "脉率", prop: "heartRate" },
      { label: '状态', prop: 'state' },
    ],
  },
  temperature: {
    unitKey: 'temperatureUnit',
    valueKey: 'bodyTemperature',
    label: '体温',
    columns: ['checkDatetime', 'bodyTemperature'],
    labelMap: {
      bodyTemperature: '体温',
    },
  },
  heartRate: {
    unitKey: 'heartRateUnit',
    valueKey: 'heartRate',
    label: '心率',
    columns: ['checkDatetime', 'heartRate'],
    labelMap: {
      heartRate: '心率',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '心率', prop: 'heartRate' },
      { label: '状态', prop: 'state' },
    ],
  },
  height: {
    unitKey: '',
    unit: 'cm',
    valueKey: 'height',
    label: '身高',
    columns: ['checkDatetime', 'height'],
    labelMap: {
      height: '身高',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '身高', prop: 'height' },
      { label: '状态', prop: 'state' },
    ],
  },
  weight: {
    unitKey: '',
    unit: 'kg',
    valueKey: 'weight',
    label: '体重',
    columns: ['checkDatetime', 'weight'],
    labelMap: {
      weight: '体重',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '体重', prop: 'weight' },
      { label: '状态', prop: 'state' },
    ],
  },
  bmi: {
    unitKey: '',
    unit: '',
    valueKey: 'bmi',
    label: 'BMI',
    columns: ['checkDatetime', 'bmi'],
    labelMap: {
      bmi: 'BMI',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: 'BMI', prop: 'bmi' },
      { label: '状态', prop: 'state' },
    ],
  },
  waistLine: {
    unitKey: '',
    unit: 'cm',
    valueKey: 'waistLine',
    label: '腰围',
    columns: ['checkDatetime', 'waistLine'],
    labelMap: {
      waistLine: '腰围',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '腰围', prop: 'waistLine' },
      { label: '状态', prop: 'state' },
    ],
  },
  boneDensity: {
    unitKey: '',
    unit: '',
    valueKey: 'checkResult',
    label: '骨密度',
    columns: ['checkDatetime', 'checkResult'],
    labelMap: {
      checkResult: '骨密度',
    },
    tableColumns: [
      { label: '测量时间', prop: 'checkDatetime' },
      { label: '骨密度', prop: 'checkResult' },
      { label: '状态', prop: 'state' },
    ],
  },
};
export default {
  components: {
    [VeLine.name]: VeLine,
    [VeRing.name]: VeRing,
  },
  props: {
    type: String,
    userId: String,
  },
  watch: {
    activeName() {
      this.changeDateRange(this.activeName);
    },
  },
  computed: {
    ringData() {
      let normal = this.dataList.filter((item) => {
        return parseInt(item.state) === 0;
      }).length;
      let disnormal = this.dataList.filter((item) => {
        return parseInt(item.state) === 1;
      }).length;
      return [
        { state: '正常次数', count: normal },
        { state: '异常次数', count: disnormal },
      ];
    },
    lastData() {
      let getLastData = (item, valueKey, unitKey, unit) => {
        if (item.length === 0) {
          return '-';
        }
        return (
          valueKey
            .split('|')
            .map((val) => item[item.length - 1][val])
            .join('/') +
          ' ' +
          (unitKey ? item[item.length - 1][unitKey] : unit)
        );
      };
      return getLastData(this.dataList, enumData[this.type].valueKey, enumData[this.type].unitKey, enumData[this.type].unit);
    },
  },
  data() {
    this.VRingSettings = {
      radius: [50, 100],
    };
    this.VLineColors = ['#32AE57', '#90ABF2', '#4185F3'];
    this.VRingColors = ['#17D0B0', '#FFCD38'];
    this.VLineHeight = '300px';
    this.VLineGrid = { left: 0 };
    this.VLineScale = { y: true };
    this.VLineSetting = {
      labelMap: enumData[this.type].labelMap,
    };
    this.lienExtend = {
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          formatter: function (value) {
            // console.log(value);
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
      columns: [],
      activeName: '1',
      vLineData: {
        columns: enumData[this.type].columns,
        rows: [],
      },
      vRingData: {
        columns: ['state', 'count'],
        rows: [],
      },
      dataList: [],
      title: '',
    };
  },
  created() {
    this.changeDateRange(this.activeName);
    switch (this.type) {
      case 'bloodPressure':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '收缩压', prop: 'bloodPressureH' },
          { label: '舒张压', prop: 'bloodPressureL' },
          { label: '脉压差', formatter: this.formatBetween },
          // { label: "脉率", prop: "heartRate" },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'spo2':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '血氧', prop: 'spo2' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'bloodSugar':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '餐前血糖', prop: 'bloodSugarBeforeMeal' },
          { label: '餐后血糖', prop: 'bloodSugarAfterMeal' },
          { label: '随机血糖', prop: 'bloodSugar' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'temperature':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '体温', prop: 'bodyTemperature' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'heartRate':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '心率', prop: 'heartRate' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'height':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '身高', prop: 'height' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'weight':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '体重', prop: 'weight' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'bmi':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: 'BMI', prop: 'bmi' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'waistLine':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '腰围', prop: 'waistLine' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
      case 'boneDensity':
        this.columns = [
          { label: '测量时间', prop: 'checkDatetime' },
          { label: '骨密度', prop: 'checkResult' },
          {
            label: '状态',
            // prop: 'warningContent',
            formatter: this.formatState,
          },
        ];
        break;
    }
  },
  methods: {
    changeDateRange(val) {
      this.$apis
        .queryTelemonitorDataByUserId({
          userId: this.userId,
          scope: val,
          range: this.type,
        })
        .then((res) => {
          this.dataList = res[this.type];
          this.dataList = [...this.dataList];
          // this.dataList = [...this.dataList].map((element) => {
          //   element.checkDatetime = this.$utils.formatDate(
          //     element.checkDatetime
          //   );
          //   return element;
          // });
          this.vLineData.rows = this.dataList;
          this.vRingData.rows = this.ringData;
          this.title = enumData[this.type].label;
        });
    },
    formatState(row, col, val) {
      return row.state === 0 ? '正常' : row.warningContent || '异常';
    },
    formatBetween(row) {
      return row.bloodPressureH - row.bloodPressureL;
    },
  },
};
</script>

<style lang="scss">
.chart-detail {
  position: relative;
  &_btn {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 1;
  }
}
</style>