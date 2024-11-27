<template>
  <section class="health_monitor">
    <div class="health_monitor_wrapper">
      <section class="health_monitor_aside">
        <el-input class="limiting" v-model.trim="keywords" placeholder="请输入姓名" @keyup.enter.native="onSearch" show-word-limit :maxlength="20">
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
        <div ref="health_monitor_list" class="health_monitor_list">
          <el-table ref="table" :data="patientList" highlight-current-row stripe border @current-change="changePatient">
            <el-table-column prop="patientName" label="姓名">
              <template slot-scope="scope">{{ scope.row.patientName | hideInfo("patientName") }}</template>
            </el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
          </el-table>
        </div>
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :pager-count="3" :current-page.sync="pageIndex" @current-change="handleCurrentChange" background small style="text-align: center"></el-pagination>
      </section>
      <div class="health_monitor_main">
        <template v-if="currentItem">
          <div class="health_monitor_main_header">
            <div>
              <span class="color-333 font-size2 bold">{{ currentItem.patientName | hideInfo("patientName") }}</span>
              <span class="color-111">{{ ` ${currentItem.sex} ${currentItem.age}` }}</span>
              <span class="color-333 margin-left30">联系电话 {{ currentItem.phone | hideInfo("phone") }}</span>
              <i class="icon-phone"></i>
            </div>
            <el-row class="bgcolor-white margin-top16 border1" type="flex" align="middle">
              <div style="width: 80px; flex: none;" class="padding10 border-right1 color-333 bold">最近数据</div>
              <div class="mianbox">
                <div class="padding15" v-for="item in options" :key="item.label">
                  <div class="text-align-center">{{ `${item.label} ${item.unit && "( " + item.unit + " )"}` }}</div>
                  <div class="text-align-center margin-top9">{{ item.lastData }}</div>
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
import Charts from './components/charts'
import ChartDetail from './components/detail'
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
    valueKey: 'bloodSugarBeforeMeal|bloodSugarAfterMeal|bloodSugar',
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
    }
  },
  async mounted() {
    this.$startLoading()
    var ro = new ResizeObserver(this.$_.debounce(this.setPageSize, 300))
    ro.observe(this.$refs['health_monitor_list'])
    this.pageSize = Math.floor(
      (this.$refs['health_monitor_list'].clientHeight - 75) / 40
    )
    this.getMainList(this.$route.query.userId, this.$route.query.patientName)
    this.$stopLoading()
  },
  methods: {
    async setPageSize(entries) {
      for (let entry of entries) {
        const cr = entry.contentRect
        let oldPageSize = this.pageSize
        this.pageSize = Math.floor((cr.height - 75) / 40)
        if (this.pageSize <= 0) {
          this.pageSize = 1
        }
        if (oldPageSize !== this.pageSize) {
          await this.getMainList()
          this.$stopLoading()
        }
      }
    },
    getMainList(userId, patientName) {
      return this.$apis
        .getEmrPatient2({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          name: patientName ? patientName : this.keywords,
          planId: this.$route.query.planId,
          userId: userId,
        })
        .then((res) => {
          this.patientList = res.list
          this.total = res.total
          if (this.patientList.length > 0) {
            this.$nextTick(() => {
              this.$refs.table.setCurrentRow(this.patientList[0] || null)
            })
          }
        })
    },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
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
        this.currentItem = { ...val }
        this.show = false
        this.$apis
          .queryTelemonitorDataByUserId({
            userId: this.currentItem.userId,
            range:
              'bloodPressure|heartRate|spo2|bloodSugar|temperature|weight|height|bmi|waistLine|boneDensity',
            number: 6,
            scope: 0,
            planId: this.$route.query.planId,
          })
          .then((res) => {
            let data = this.$_.cloneDeep(enumData)
            this.isNoData = true
            Object.keys(res).forEach((item) => {
              let returnData = res[item]
              if (returnData && returnData.length > 0) {
                this.isNoData = false
                let obj = data[item]
                obj.lastData = getLastData(returnData, obj.valueKey)
                obj.data = returnData
                if (obj.unitKey) {
                  obj.unit = returnData[0] && returnData[0][obj.unitKey]
                }
              }
            })
            this.options = { ...data }
            this.show = true
          })
      } else {
        this.currentItem = null
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
    // min-width: 280px;
    min-width: 330px!important;
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
  .el-pagination {
    display: flex;
    margin: 0 auto
  }
  .el-pager {
    display: flex;
  }
}
</style>
