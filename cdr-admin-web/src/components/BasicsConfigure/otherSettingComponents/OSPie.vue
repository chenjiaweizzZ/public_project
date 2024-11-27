<!-- 饼图 -->
<template>
  <div v-if="realUseOS">
    <div class="data-cofig-item">
      <div class="item-title">饼图外圈半径</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-input v-model="realUseOS.series.radius[1]" style="width: 180px"></el-input>
        </div>
      </div>
    </div>
    <div class="data-cofig-item" style="padding-bottom: 10px">
      <div class="item-title">饼图内圈半径</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-input v-model="realUseOS.series.radius[0]" style="width: 180px"></el-input>
        </div>
      </div>
    </div>
    <div class="data-cofig-item">
      <div class="item-title">设为南丁格尔图</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-switch v-model.trim="realUseOS.series.roseType" />
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
      handler: function(newV) {
        this.realUseOS = _.deepCopy(newV)
      },
      deep: true
    },
    'realUseOS.series': {
      handler: function(newV) {
        this.$emit('changeOS', newV, 'PieOS')
      },
      deep: true
    }
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
@import './public.scss';
</style>
