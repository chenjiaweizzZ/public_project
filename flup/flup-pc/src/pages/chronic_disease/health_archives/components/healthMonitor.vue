<template>
  <section class="health_monitor">
    <div class="health_monitor_wrapper">
      <div class="health_monitor_main">
        <template v-if="currentItem">
          <div class="health_monitor_main_header">
            <el-row class="bgcolor-white margin-top16 border1" type="flex" align="middle">
              <div
                style="width: 80px; flex: none"
                class="padding10 border-right1 color-333 bold"
              >最近数据</div>
              <div class="mianbox">
                <div v-for="item in options" :key="item.label">
                  <div v-if="!(typeof item == 'string') && item.show" class="padding15">
                    <div class="text-align-center">
                      {{
                      `${item.label} ${item.unit && "( " + item.unit + " )"}`
                      }}
                    </div>
                    <div class="text-align-center margin-top9">{{ item.lastData }}</div>
                  </div>
                </div>
              </div>
            </el-row>
          </div>
          <div class="margin-top20">
            <charts v-if="show && !isNoData" :data="options"></charts>
            <div v-if="isNoData" class="nonexistenceData">一条记录都没有</div>
          </div>
        </template>
        <div v-else class="nonexistenceData">暂无数据</div>
      </div>
    </div>
  </section>
</template>

<script>
import Charts from './charts/charts'
import ChartDetail from './charts/detail'
import pagination from '@/mixins/pagination'
let enumData = {
  bloodPressure: {
    type: 'bloodPressure',
    lastData: '-',
    data: [],
    unitKey: 'bloodPressureUnit',
    unit: 'mmHg',
    valueKey: 'bloodPressureH|bloodPressureL',
    label: '血压',
    columns: ['checkDatetime', 'bloodPressureH', 'bloodPressureL'],
    labelMap: {
      bloodPressureL: '舒张压',
      bloodPressureH: '收缩压',
    },
  },
  heartRate: {
    type: 'heartRate',
    lastData: '-',
    data: [],
    unitKey: 'heartRateUnit',
    unit: '次/分',
    valueKey: 'heartRate',
    label: '心率',
    columns: ['checkDatetime', 'heartRate'],
    labelMap: {
      heartRate: '心率',
    },
  },
  spo2: {
    type: 'spo2',
    lastData: '-',
    data: [],
    unitKey: 'spo2Unit',
    unit: '%',
    valueKey: 'spo2',
    label: '血氧',
    columns: ['checkDatetime', 'spo2'],
    labelMap: {
      spo2: '血氧',
    },
  },
  bloodSugar: {
    type: 'bloodSugar',
    lastData: '-',
    data: [],
    unitKey: 'sugarUnit',
    unit: 'mmol/L',
    valueKey: 'bloodSugarBeforeMeal|bloodSugarAfterMeal',
    label: '血糖',
    columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal', 'bloodSugar'],
    labelMap: {
      bloodSugarBeforeMeal: '餐前血糖',
      bloodSugarAfterMeal: '餐后血糖',
      bloodSugar: '随机血糖'
    },
  },
  temperature: {
    type: 'temperature',
    lastData: '-',
    data: [],
    unitKey: 'temperatureUnit',
    unit: '℃',
    valueKey: 'bodyTemperature',
    label: '体温',
    columns: ['checkDatetime', 'bodyTemperature'],
    labelMap: {
      bodyTemperature: '体温',
    },
  },
  height: {
    type: 'height',
    lastData: '-',
    data: [],
    unitKey: '',
    unit: 'cm',
    valueKey: 'height',
    label: '身高',
    columns: ['checkDatetime', 'height'],
    labelMap: {
      height: '身高',
    },
  },
  weight: {
    type: 'weight',
    lastData: '-',
    data: [],
    unitKey: '',
    unit: 'kg',
    valueKey: 'weight',
    label: '体重',
    columns: ['checkDatetime', 'weight'],
    labelMap: {
      weight: '体重',
    },
  },
  bmi: {
    type: 'bmi',
    lastData: '-',
    data: [],
    unitKey: '',
    unit: '',
    valueKey: 'bmi',
    label: 'BMI',
    columns: ['checkDatetime', 'bmi'],
    labelMap: {
      bmi: 'BMI',
    },
  },
  waistLine: {
    type: 'waistLine',
    lastData: '-',
    data: [],
    unitKey: '',
    unit: 'cm',
    valueKey: 'waistLine',
    label: '腰围',
    columns: ['checkDatetime', 'waistLine'],
    labelMap: {
      waistLine: '腰围',
    },
  },
  boneDensity: {
    type: 'boneDensity',
    lastData: '-',
    data: [],
    unitKey: '',
    unit: '',
    valueKey: 'checkResult',
    label: '骨密度',
    columns: ['checkDatetime', 'checkResult'],
    labelMap: {
      checkResult: '骨密度',
    },
  },
}
export default {
  name: 'health_monitor',
  mixins: [pagination],
  components: { Charts, ChartDetail },
  data() {
    return {
      keywords: '',
      currentItem: {},
      options: {},
      patientList: [],
      show: true,
      isNoData: false,
      physicalexaminationindexlist: [],
    }
  },
  async created() {
    //先获取计划关联检测指标
    this.$apis
      .physicalexaminationindex({
        pageNo: 1,
        pageSize: 1000,
        flupPlanId: this.$route.query.flupPlanId,
      })
      .then((res) => {
        this.physicalexaminationindexlist = res.list
        this.changePatient(this.$route.query.userId)
      })
  },
  methods: {
    changePatient(val) {
      let getLastData = (item, valueKey) => {
        if (!item || item.length === 0) {
          return '-'
        }
        return valueKey
          .split('|')
          .map((val) =>
            item[item.length - 1][val] ? item[item.length - 1][val] : '-'
          )
          .join('/')
      }
      if (val) {
        this.show = false
        this.$apis
          .queryTelemonitorDataByUserId({
            userId: val,
            range:
              'bloodPressure|heartRate|spo2|bloodSugar|temperature|weight|height|bmi|waistLine|boneDensity',
            number: 6,
            scope: 0,
            // planId: this.$route.query.planId
          })
          .then((res) => {
            // let data = this.$_.cloneDeep(enumData)
            // this.isNoData = true

            // Object.keys(res).forEach((item) => {
            //   let returnData = res[item]
            //   this.isNoData = false
            //   let obj = data[item]

            //   var showLable = []
            //   if (item == 'bloodPressure') {
            //     showLable = this.physicalexaminationindexlist.filter(
            //       (x) =>
            //         x.code == 'bloodPressureH' || x.code == 'bloodPressureL'
            //     )
            //   } else if (item == 'bloodSugar') {
            //     showLable = this.physicalexaminationindexlist.filter(
            //       (x) =>
            //         x.code == 'bloodSugarBeforeMeal' ||
            //         x.code == 'bloodSugarAfterMeal'
            //     )
            //   } else if (item == 'heartRate') {
            //     var blood = this.physicalexaminationindexlist.filter(
            //       (x) =>
            //         x.code == 'bloodPressureH' || x.code == 'bloodPressureL'
            //     )
            //     showLable.push({
            //       code: 'heartRate',
            //       isSelect: blood.filter((x) => x.isSelect == true).length > 0,
            //       name: '心率',
            //       unit: '次/分',
            //     })
            //   } else {
            //     showLable = this.physicalexaminationindexlist.filter(
            //       (x) => x.code == item
            //     )
            //   }
            //   obj.show = showLable.filter((x) => x.isSelect == true).length > 0

            //   //判断是否显示
            //   if (returnData && returnData.length > 0) {
            //     obj.lastData = getLastData(returnData, obj.valueKey)
            //     obj.data = returnData
            //     if (obj.unitKey) {
            //       obj.unit = returnData[0] && returnData[0][obj.unitKey]
            //     }
            //   }
            // })
            // this.options = { ...data, userId: this.$route.query.userId }
            // console.log(this.options)
            // this.show = true
            let data = this.$_.cloneDeep(enumData)
            this.isNoData = true
            Object.keys(res).forEach((item) => {
              let returnData = res[item]
              if (returnData && returnData.length > 0) {
                this.isNoData = false
                let obj = data[item]
                obj.lastData = getLastData(returnData, obj.valueKey)
                obj.data = returnData
                obj.show = true
                if (obj.unitKey) {
                  obj.unit = returnData[0] && returnData[0][obj.unitKey]
                }
              }
            })
            this.options = { ...data }
            this.show = true
          })
      }
    },
  },
}
</script>

<style lang="scss">
.health_monitor {
  padding: 0px 20px 20px 20px;
  &_wrapper {
    display: flex;
  }
  &_aside {
    width: 330px;
    display: flex;
    flex-direction: column;
    background: #fbfbfb;
    padding: 16px 20px;
    position: sticky;
    top: 20px;
    height: calc(100vh - 40px);
  }
  &_list {
    flex: 1;
    margin-top: 20px;
    overflow: hidden;
  }
  &_main {
    flex: 1;
    margin-left: 20px;
  }
  &_main_header {
    padding: 20px;
    background-color: #f8f8f8;
  }
  .ts-nodata--none-record {
    display: inline-block;
  }
  .mianbox {
    display: flex;
    overflow: scroll;
    > div {
      flex: none;
    }
  }
}
</style>
