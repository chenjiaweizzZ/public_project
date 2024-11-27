<!-- 雷达图 -->
<template>
    <div v-if="realUseOS">
    <div class="data-cofig-item">
      <div class="item-title">线条粗细</div>
      <div class="item-config">
        <div class="item-config-child">
          <el-input v-model="realUseOS.series.width" style="width: 180px"></el-input>
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
  watch:{
    otherSetting: {
      handler: function (newV) {
        this.realUseOS = _.deepCopy(newV)
      },
      deep: true
    },
    'realUseOS.series': {
      handler: function (newV) {
        this.$emit('changeOS', newV, 'RadarOS')
      },
      deep: true
    },
  },
  data() {
    return {
        realUseOS: null
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import './public.scss'
</style>
