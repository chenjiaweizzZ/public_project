<!-- 统一封装echarts组件 -->
<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
export default {
  name: "echart",
  props: {
    // class选择器
    className: {
      type: String,
      default: "chart"
    },
    // id
    id: {
      type: String,
      default: "chart"
    },
    // 宽
    width: {
      type: String,
      default: "100%"
    },
    // 高
    height: {
      type: String,
      default: "100%"
    },
    // 图表数据
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    options: {
      handler(options) {
        // 设置true清空echart缓存
        this.chart.setOption(options, true);
      },
      deep: true
    }
  },
  mounted() {
    this.initChart();
    this.$nextTick(() => {
      window.addEventListener("resize", this.listenResize);
    });
  },
  beforeDestroy() {
    // chart组件需要dispose，不然存在内存泄露
    // 在组件销毁前调用dispose函数销毁报表
    this.chart.dispose();
    this.chart = null;
    window.removeEventListener("resize", this.listenResize);
  },
  methods: {
    listenResize() {
      if (this.chart) {
        setTimeout(() => {
          this.chart.resize();
        }, 100);
      }
    },
    chartsResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    initChart() {
      // 初始化echart
      this.chart = echarts.init(this.$el);
      this.chart.setOption(this.options, true);
    }
  }
};
</script>

<style></style>
