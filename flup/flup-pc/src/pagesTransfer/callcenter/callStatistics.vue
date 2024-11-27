<template>
  <div class="callStatistics">
    <div class="sxbox">
      <span style="margin-right: 10px">接听状态</span>
      <el-select
        style="margin-right: 50px"
        v-model="type"
        placeholder="请选择"
        clearable
        @change="getgetCallRecordReport"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-right: 10px">通话日期</span>
      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timefun"
      ></el-date-picker>
    </div>

    <div class="chartbox">
      <div class="title">
        <h3>通话记录总量统计表</h3>
        <el-select style="margin-right: 50px" v-model="chartType" placeholder="请选择" clearable>
          <el-option v-for="item in chartTypes" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <ve-line v-if="chartType == '折线图'" :data="chartData"></ve-line>
      <ve-line v-else-if="chartType == '区域图'" :data="chartData" :settings="chartSettings"></ve-line>
      <ve-histogram v-else-if="chartType == '柱状图'" :data="chartData"></ve-histogram>
      <ve-bar v-else-if="chartType == '条形图'" :data="chartData" :extend="lienExtend"></ve-bar>
    </div>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import bar from 'v-charts/lib/bar.common'
import histogram from 'v-charts/lib/histogram.common'

export default {
  components: {
    [VeLine.name]: VeLine,
    [bar.name]: bar,
    [histogram.name]: histogram,
  },
  data() {
    this.chartSettings = {
      stack: { 总量: ['通话总量', '拨入总量', '拨出总量'] },
      area: true,
    }
    this.lienExtend = { grid: { right: 30 } }
    return {
      options: [
        {
          value: '0',
          label: '未接听',
        },
        {
          value: '1',
          label: '接听',
        },
      ],
      chartTypes: ['柱状图', '折线图', '区域图', '条形图'],
      chartType: '柱状图',
      type: '',
      time: null,
      startDate: null,
      endDate: null,
      chartData: {
        columns: ['工号', '通话总量', '拨入总量', '拨出总量'],
        rows: [],
      },
    }
  },
  created() {
    this.getgetCallRecordReport()
  },
  computed: {},
  watch: {},
  methods: {
    timefun() {
      if (this.time) {
        this.startDate = this.time[0]
        this.endDate = this.time[1]
      } else {
        this.startDate = null
        this.endDate = null
      }
      this.getgetCallRecordReport()
    },
    getgetCallRecordReport() {
      this.$apis
        .getCallRecordReport({
          startDate: this.startDate,
          endDate: this.endDate,
          type: this.type,
        })
        .then((res) => {
          let rows = []
          for (const key in res) {
            let obj = {
              工号: res[key].callagent,
              通话总量: res[key].allCount,
              拨入总量: res[key].inCount,
              拨出总量: res[key].outCount,
            }
            rows.push(obj)
          }
          this.chartData.rows = rows
        })
    },
  },
}
</script>

<style lang="scss">
.callStatistics {
  padding: 0 24px;
  .sxbox {
    background-color: #f8f8f8;
    padding: 16px 20px;
  }
  .chartbox {
    width: 100%;
    height: 488px;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid #ccc;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>