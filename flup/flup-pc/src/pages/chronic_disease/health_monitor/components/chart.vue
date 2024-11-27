<template>
  <div>
    <el-row class="border-bottom1 padding-bottom8" type="flex" align="middle" justify="space-between">
      <div>
        {{`${data.label}`}}
        <span v-if="data.unit">( {{`${data.unit}`}} )</span>
      </div>
      <el-button type="primary" size="mini" plain @click="$emit('click-detail')">查看详情</el-button>
    </el-row>
    <ve-line class="margin-top10" :data="vLineData" :colors="VLineColors" :height="VLineHeight" :grid="VLineGrid" :scale="VLineScale" :settings="VLineSetting" :extend="lienExtend"></ve-line>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'

export default {
  props: {
    data: Object,
    title: String,
  },
  components: {
    [VeLine.name]: VeLine,
  },
  computed: {
    columns() {
      switch (this.data.label) {
        case value:
          break

        default:
          break
      }
    },
  },
  data() {
    this.VLineColors = ['#19d4ae', '#5ab1ef', '#fa6e86']
    // this.VLineWidth = "100%"
    this.VLineHeight = '300px'
    this.VLineGrid = { left: 0 }
    this.VLineScale = { y: true }
    this.VLineSetting = {
      labelMap: this.data.labelMap,
    }
    this.lienExtend = {
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          formatter: function (value) {
            // console.log(value);
            var valueDetal = value.split(' ')
            if (valueDetal.length > 0) {
              var temp = valueDetal[0] + '\n' + valueDetal[1]
              return temp
            } else {
              return value
            }
          },
        },
      },
    }
    return {
      vLineData: {
        columns: this.data.columns,
        rows: [...this.data.data],
        // rows: [...this.data.data].map(element => {
        //   element.checkDatetime = this.$utils.formatDate(element.checkDatetime)
        //   return element
        // })
      },
    }
  },
}
</script>