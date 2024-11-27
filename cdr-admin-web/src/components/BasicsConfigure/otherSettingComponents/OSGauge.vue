<!-- 仪表盘 -->
<template>
 <div v-if="realUseOS">
    <div class="data-cofig-item">
      <div class="item-title">隐藏刻度</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-switch v-model="realUseOS.series.axisTick.show" />
        </div>
      </div>
    </div>
    <div class="data-cofig-item">
      <div class="item-title">隐藏详情指标</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-switch v-model="realUseOS.series.data[0].detail.show" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from '@/utils'
export default {
  name: '',
  props: {
    otherSetting: {
      type: Object
    }
  },
   watch: {
    otherSetting: {
      handler: function (newV) {
        this.realUseOS = _.deepCopy(newV)
      },
      deep: true
    },
    'realUseOS.series.axisTick': {
      handler: function (newV) {
        this.$emit('changeOS', newV, 'gaugeOS')
      },
      deep: true
    },
       'realUseOS.series.data': {
      handler: function (newV) {
        console.log("我更新啦111");
        this.$emit('changeOS', newV, 'gaugeOSData')
      },
      deep: true
    },
  },
  data() {
    return {
      realUseOS: null,
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import './public.scss'
</style>
