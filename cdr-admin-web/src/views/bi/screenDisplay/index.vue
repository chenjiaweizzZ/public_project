<!-- 大屏呈现 -->
<template>
  <div>
    <div id="target" style="width: 600px; height: 500px"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import * as _biApi from '@/service/biTools'
import _bi from '@/utils/biUtils'
export default {
  name: 'biScreenDisplay',
  components: {},
  data() {
    return {
      myChart: null,
      opt: null
    }
  },
  mounted() {
    _biApi
      .getStatisticsDetail({
        id: 7
      })
      .then(res => {
        // step 1
        this.myChart = echarts.init(document.getElementById('target'), 'dark')

        // step 2
        let obj = _bi.getOption(res)

        if (obj.status) {
          // step 3
          this.myChart.setOption(obj.data)
        }
      })
  },
  methods: {}
}
</script>
<style lang="scss" scoped></style>
