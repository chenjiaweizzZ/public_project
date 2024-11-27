<template>
  <div class="echart-example">
    <div class="title">
      {{ title }}
      <span>{{ money }}</span>
    </div>
    <div class="echart">
      <Echart :options="options"></Echart>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import Echart from "./echart";
export default {
  components: {
    Echart
  },
  data() {
    return {
      options: {}
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    money: {
      type: [String, Number],
      default: "0"
    },
    color: {
      type: Array,
      default: () => ["rgba(50,174,87,0.5)", "rgba(50,174,87,0.00)"]
    },
    datas: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    datas: {
      handler() {
        this.options = {
          tooltip: {
            trigger: "axis",
            transitionDuration: 0
          },
          grid: {
            left: "5%",
            right: "5%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              // type: "category",
              // boundaryGap: false,
              type: "category",
              axisTick: {
                show: false
              },
              axisLine: {
                show: true
              },
              data: this.datas.nameList

              // data: [
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02",
              //   "2022-01-01",
              //   "2022-01-02",
              //   "2022-01-02"
              // ]
            }
          ],
          yAxis: [
            {
              type: "value",
              splitLine: {
                show: false
              },
              axisLine: { show: false },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              }
            }
          ],
          series: [
            {
              type: "line",
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: this.color[0]
                  },
                  {
                    offset: 1,
                    color: this.color[1]
                  }
                ])
              },
              emphasis: {
                focus: "series"
              },
              data: this.datas.dataList
              // data: [0.04, 0.05, 0.01]
            }
          ]
        };
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.echart-example {
  width: 100%;
  height: 100%;
  .title {
    position: relative;
    padding-left: 9px;
    font-size: 18px;
    font-weight: normal;
    color: #111111;
    span {
      color: #ff7b35;
    }
  }
  .title::before {
    position: absolute;
    content: "";
    width: 3px;
    height: 17px;
    background: #32ae57;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
  .echart {
    height: calc(100% - 27px);
  }
}
</style>
