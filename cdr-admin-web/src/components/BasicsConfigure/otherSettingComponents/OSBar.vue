<!--  -->
<template>
  <div v-if="realUseOS">
    <div class="data-cofig-item">
      <div class="item-title">XY轴翻转</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-radio-group size="mini" v-model="realUseOS.isXYFan" @change="isXYFanChange">
            <el-radio label="x">以x轴为准</el-radio>
            <el-radio label="y">以y轴为准</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="data-cofig-item" style="padding-bottom: 10px">
      <div class="item-title">度量旋转角度</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-input v-model="realUseOS.rotate" style="width: 180px" @input="rotateChange"></el-input>
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
      deep: true,

    }
  },
  data() {
    return {
      realUseOS: null
    }
  },
  methods: {
    rotateChange(v) {
      this.$emit('changeOS', v, 'rotate')
    },
    isXYFanChange(v) {
      this.$emit('changeOS', v, 'isXYFan')
    },
  }
}
</script>
<style lang="scss" scoped>
@import './public.scss';
</style>
