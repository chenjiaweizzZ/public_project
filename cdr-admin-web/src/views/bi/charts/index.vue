<!-- 
@description 统计图查看
@author 陈家伟
@time 2022/5/18
 -->
<template>
  <div class="chartsView">
    <div class="chartsList" v-loading="isLoading">
      <div class="chartss">
        <el-col
          class="chartsBox"
          :span="6"
          v-for="(charts, index) in chartsList"
          :key="index"
        >
          <div class="chartsContent">
            <div class="content">
              <div class="chartsTitle">{{ charts.name }}</div>
              <div class="imgBox">
                <img :src="charts.pic" alt />
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </div>
    <el-pagination
      align="right"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[8, 16]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="totalNumber"
      style="margin-top: 66px; margin-bottom: 10px; width: 100%"
    ></el-pagination>
  </div>
</template>
<script>
import { viewStatistics } from "@/service/biTools";
export default {
  name: "biCharts",
  components: {},
  data() {
    return {
      isLoading: true,
      chartsList: [],
      pageIndex: 1,
      pageSize: 8,
      totalNumber: 100,
    };
  },
  created() {
    this.getChartsList();
  },
  methods: {
    getChartsList() {
      this.isLoading = true;
      viewStatistics({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
      }).then((res) => {
        console.log(res);
        this.chartsList = res.list;
        this.totalNumber = res.total;
        this.isLoading = false;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getChartsList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getChartsList();
    },
  },
};
</script>
<style lang="scss" scoped>
.chartsView {
  background-color: #ffffff;
  position: absolute;
  left: 10px;
  right: 10px;
  top: 40px;
  bottom: 10px;
}
</style>
<style lang="scss">
.chartsView {
  .chartsList {
    // background: blue;
    position: absolute;
    top: 0px;
    bottom: 110px;
    left: 0px;
    right: 0px;
    // margin: 5px;
    overflow: scroll;
    overflow-x: hidden;
    .chartss {
      // padding: 5px;
      height: 100%;
      width: 100%;
      .chartsBox {
        // background: blue;
        height: calc(50%);
        // margin: 5px;
        .chartsContent {
          height: 100%;
          width: 100%;
          // padding: 5px;
          padding-left: 10px;
          padding-top: 10px;
          .content {
            border: 1px solid #d7dae0;
            height: 100%;
            width: 100%;
            position: relative;
            .chartsTitle {
              line-height: 22px;
              font-size: 14px;
              color: #111111;
              margin-left: 12px;
              margin-top: 10px;
            }
            .imgBox {
              position: absolute;
              top: 42px;
              left: 12px;
              right: 12px;
              bottom: 12px;
              border: 1px solid #e6e6e6;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #fbfbfb;
              img {
                display: block;
                max-width: calc(100%);
                max-height: calc(100%);
                padding: 40px 40px;
              }
            }
          }
        }
      }
    }
  }
  .el-pagination {
    position: absolute;
    bottom: 30px;
    .el-pagination__total {
      float: left;
      margin-left: 10px;
    }
    .el-pagination__sizes {
      float: left;
      right: 10px;
      margin-right: 10px;
    }
  }
}
</style>
