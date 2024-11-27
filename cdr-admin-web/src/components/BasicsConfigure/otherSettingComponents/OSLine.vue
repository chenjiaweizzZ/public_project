<!-- 折线其他设置 -->
<template>
  <div v-if="realUseOS">
    <div class="data-cofig-item">
      <div class="item-title">堆积图</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-switch v-model="realUseOS.series.opacity" />
        </div>
      </div>
    </div>
    <div class="data-cofig-item">
      <div class="item-title">平滑线条</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-switch v-model="realUseOS.series.smooth" />
        </div>
      </div>
    </div>
    <div class="data-cofig-item">
      <div class="item-title">线条粗细</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-input v-model="realUseOS.series.width" style="width: 180px"></el-input>
        </div>
      </div>
    </div>
    <div class="data-cofig-item" style="padding-bottom: 10px">
      <div class="item-title">度量旋转角度</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-input v-model="realUseOS.rotate" style="width: 180px"></el-input>
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
    'realUseOS.rotate': {
      handler: function (newV) {
        this.$emit('changeOS', newV, 'rotate')
      },
      deep: true
    },
    'realUseOS.series': {
      handler: function (newV) {
        this.$emit('changeOS', newV, 'lineOS')
      },
      deep: true
    },
  },
  data() {
    return {
      realUseOS: null
    }
  }
}
</script>
<style lang="scss" scoped>
@import './public.scss'
</style>
