<template>
  <div class="chart-detail">
    <el-button class="chart-detail_btn" size="mini" plain @click="$router.back()">返回</el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="用户管理"></el-tab-pane>
      <el-tab-pane label="配置管理"></el-tab-pane>
      <el-tab-pane label="角色管理"></el-tab-pane>
      <el-tab-pane label="定时任务补偿"></el-tab-pane>
    </el-tabs>
    <el-row type="flex">
      <ve-line
        class="margin-top10 flex1"
        :data="$route.params.data"
        :colors="VLineColors"
        :height="VLineHeight"
        :grid="VLineGrid"
        :scale="VLineScale"
      ></ve-line>
      <ve-ring class="flex1 margin-left20" :data="$route.params.data" :settings="VRingSettings"></ve-ring>
    </el-row>
    <div class="padding-top20 padding-bottom10 border-bottom1 font-size2 color-333">血压数据列表</div>
    <el-table class="margin-top20" :data="[]" border stripe>
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import VeRing from 'v-charts/lib/ring.common'
export default {
  components: {
    [VeLine.name]: VeLine,
    [VeRing.name]: VeRing,
  },
  data() {
    this.VRingSettings = {
      selectedMode: 'single',
      hoverAnimation: false,
      radius: [100, 80],
      offsetY: 200,
    }
    this.VLineColors = ['#19d4ae', '#5ab1ef', '#fa6e86']
    // this.VLineWidth = "100%"
    this.VLineHeight = '300px'
    this.VLineGrid = { left: 0 }
    this.VLineScale = { y: true }
    return {
      columns: [{ label: '测量时间', prop: 'type' }],
    }
  },
}
</script>

<style lang="scss">
.chart-detail {
  position: relative;
  &_btn {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 1;
  }
}
</style>