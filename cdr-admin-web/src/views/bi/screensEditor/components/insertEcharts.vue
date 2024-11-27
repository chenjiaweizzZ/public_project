<!-- DEMO -->
<template>
  <div :style="{width:echartw-10+'px', height: echarth-10+'px'}">
    <div :id="id" :style="{width:echartw-10+'px', height: echarth-10+'px',margin:'5px'}" :class="id"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import * as _biApi from '@/service/biTools';
import _bi from '@/utils/biUtils';
export default {
  name: 'biScreenDisplay',
  components: {},
  props: {
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    targetData: {
      type: Object,
      default: {},
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      myChart: null,
      opt: null,
      echartw: this.width,
      echarth: this.height,
      timerconfigSon: {},
    };
  },
  watch: {
    width() {
      this.echartw = this.width;
      this.echartsDemo();
    },
    height() {
      this.echarth = this.height;
      this.echartsDemo();
    },
    targetData() {
      this.init();
    },
  },
  mounted() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    this.$nextTick(function () {
      // step 1 初始化init echarts dom
      this.myChart = echarts.init(document.getElementById(this.id), 'dark', { renderer: 'svg' });
      // step 2 解析指标option
      let optionResult = _bi.getOption(this.targetData.baseData);
      if (optionResult.status) {
        // step 3 setOption
        this.myChart.setOption(optionResult.data);
      }
      if (this.$route.query.opentype == 1 || this.$route.query.opentype == 2) {
        this.timerconfigSon = this.targetData.baseData.configJson.timer;
        this.autorefresh();
      }
    });
  },
  methods: {
    //图表渲染（整个图表样式+数据源）
    echartsDemo() {
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.$nextTick(function () {
        // step 1 初始化init echarts dom
        this.myChart = echarts.init(document.getElementById(this.id), 'dark', { renderer: 'svg' });
        // step 2 解析指标option
        let optionResult = _bi.getOption(this.targetData.baseData);
        if (optionResult.status) {
          // step 3 setOption
          this.myChart.setOption(optionResult.data);
        }
      });
    },
    //刷新图表（只刷新数据源，样式不刷新）
    refresh(index, refreshData) {
      // console.log(index);
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.$nextTick(function () {
        // step 1 初始化init echarts dom
        this.myChart = echarts.init(document.getElementById('target_' + index), 'dark', { renderer: 'svg' });
        // step 2 解析指标option
        let configJson = this.targetData.baseData.configJson;
        let apiCode = this.targetData.baseData.apiCode;
        let apiParameterVos = this.targetData.baseData.apiParameterVos;
        let optionResult = {};
        if (!refreshData) {
          optionResult = _bi.getOption(this.targetData.baseData); //刷新数据样式
        } else {
          optionResult = _bi.getOption({ apiParameterVos, apiCode, configJson }); //刷新数据不刷先样式
        }
        if (optionResult.status) {
          // step 3 setOption
          this.myChart.setOption(optionResult.data);
        }
      });
    },
    init() {
      let index = this.id.split('_')[1];
      this.$emit('refreshTarget', this.targetData, index);
      if (this.$route.query.opentype == 2) {
      } else {
        this.refresh(index, false);
      }
    },
    autorefresh() {
      //预览、发布自动刷新
      if (this.timerconfigSon.isOpen && this.timerconfigSon.type == 1) {
        this.timer = setInterval(() => {
          this.init();
        }, this.timerconfigSon.value * 1000);
      } else if (this.timerconfigSon.isOpen && this.timerconfigSon.type == 2) {
        this.timer = setInterval(() => {
          var hs = new Date().getHours();
          var ms = new Date().getMinutes();
          let timeDate = hs + ':' + ms;
          if (timeDate == this.timerconfigSon.value) {
            this.init();
          }
        }, 1000 * 59);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
