<template>
  <div class="response-dimension">
    <div class="header">
      <div class="item">
        <span class="key">咨询总人数</span>
        <span class="value">{{ allConsultPatientNum }}</span>
      </div>
      <div class="item">
        <span class="key">回复总条数</span>
        <span class="value">{{ allChatRecordNum }}</span>
      </div>
      <div class="item">
        <span class="key">平均每次响应时长</span>
        <span class="value">{{ averageResponseEveryDuration }}分钟</span>
      </div>
    </div>
    <div class="main">
      <div class="d-table">
        <el-collapse v-model="activeName2" accordion>
          <el-collapse-item
            v-for="(item, index) in mainList"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <div class="title-header">
                <div class="number">{{ index + 1 }}</div>
                <span class="teamName">{{ item.groupName }}</span>
                <div class="item">
                  <span class="key">咨询总人数</span>
                  <span class="value">{{ item.sumConsultPatientNum }}</span>
                </div>
                <div class="item">
                  <span class="key">回复总条数</span>
                  <span class="value">{{ item.sumChatRecordNum }}</span>
                </div>
                <div class="item">
                  <span class="key">平均首次响应时长</span>
                  <span class="value"
                    >{{
                      item.averageResponseEveryDuration.toFixed(2)
                    }}分钟</span
                  >
                </div>
              </div>
            </template>
            <table>
              <tr>
                <td class="index title">序号</td>
                <td class="value title">医生姓名</td>
                <td class="value title">咨询人数</td>
                <td class="value title">回复条数</td>
                <td class="value title">平均首次响应时长</td>
              </tr>
              <tr
                class="background"
                v-for="(item2, index2) in item.statisticsUserResponseVoList"
                :key="index2"
              >
                <td class="index">{{ index2 + 1 }}</td>
                <td class="value">{{ item2.userName }}</td>
                <td class="value">咨询人数：{{ item2.consultPatientNum }}</td>
                <td class="value">回复条数：{{ item2.chatRecordNum }}</td>
                <td class="value">
                  平均首次响应时长：{{
                    item2.averageResponseEveryDuration.toFixed(2)
                  }}分钟
                </td>
              </tr>
            </table>
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-pagination
        class="pagination"
        :page-sizes="[10, 20, 30, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page.sync="pageNo"
        :page-size="pageSize"
        layout="total,sizes,prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "collectionCases",
  props: {
    packageDeptId: {
      type: String,
      default: ""
    },
    groupId: {
      type: String,
      default: ""
    },
    time: {
      type: Array,
      default: () => []
    },
    activeName: {
      type: String,
      default: ""
    }
  },
  watch: {
    packageDeptId: {
      handler(newVal) {
        this.pageNo = 1;
        this.pageSize = 10;
        if (this.activeName != "third") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    },
    groupId: {
      handler(newVal) {
        this.pageNo = 1;
        this.pageSize = 10;
        if (this.activeName != "third") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    },
    time: {
      handler(newVal) {
        this.pageNo = 1;
        this.pageSize = 10;
        if (this.activeName != "third") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    },
    activeName: {
      handler(newVal) {
        if (this.activeName != "third") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      activeName2: null,
      mainList: [],
      allChatRecordNum: 0,
      allConsultPatientNum: 0,
      averageResponseEveryDuration: 0
    };
  },
  created() {
    if (this.activeName == "third") {
      this.getStatisticsOrderAverage();
      this.getStatisticsOrderList();
    }
  },
  methods: {
    getStatisticsOrderList() {
      this.$apis
        .selectStatisticsResponseQuery({
          deptId: this.packageDeptId,
          startDate: this.time && this.time[0] ? this.time[0] : null,
          endDate: this.time && this.time[1] ? this.time[1] : null,
          groupId: this.groupId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(res => {
          this.mainList = res.list;
          this.total = res.total;
        });
    },
    getStatisticsOrderAverage() {
      this.$apis
        .selectStatisticsResponseAverage({
          deptId: this.packageDeptId,
          startDate: this.time && this.time[0] ? this.time[0] : null,
          endDate: this.time && this.time[1] ? this.time[1] : null,
          groupId: this.groupId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(res => {
          this.allChatRecordNum = res.allChatRecordNum;
          this.allConsultPatientNum = res.allConsultPatientNum;
          this.averageResponseEveryDuration = res.averageResponseEveryDuration
            ? res.averageResponseEveryDuration.toFixed(2)
            : 0;
        });
    },
    handleSizeChange(v) {
      this.pageNo = 1;
      this.pageSize = v;
      this.getStatisticsOrderAverage();
      this.getStatisticsOrderList();
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getStatisticsOrderAverage();
      this.getStatisticsOrderList();
    }
  }
};
</script>
<style lang="scss" scoped>
.response-dimension {
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 20px;
  .header {
    display: flex;
    margin-bottom: 18px;
    .item {
      margin-right: 30px;
      .key {
        font-size: 14px;
        color: #3d3d3d;
        margin-right: 14px;
      }
      .value {
        font-size: 14px;
        font-weight: bold;
        color: #ff7b35;
      }
    }
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .d-table {
      flex: 1;
      overflow-y: auto;
      .title {
        font-size: 14px;
        color: #666666;
        font-weight: 700;
      }
      table {
        border-collapse: collapse;
        border: 1px solid #ebeef5;
        // border-top: none;
        width: 100%;
        text-align: center;
        tr,
        th {
          height: 49px;
          td {
            border: 1px solid #ebeef5;
            border-top: none;
          }
          .value {
            width: 24%;
          }
        }
      }
      .title-header {
        width: 100%;
        display: flex;
        .number {
          width: 4%;
          text-align: center;
          border-right: 1px solid #ebeef5;
        }
        .teamName {
          color: #333333;
          font-weight: bold;
          font-size: 14px;
          margin-left: 40px;
          margin-right: 60px;
        }
        .item {
          margin-right: 30px;
          .key {
            font-size: 14px;
            color: #111111;
            margin-right: 14px;
          }
          .value {
            font-size: 14px;
            font-weight: bold;
            color: #ff7b35;
          }
        }
      }
    }
    .pagination {
      margin-bottom: 20px;
    }
  }
  .background {
    background: #ffffff;
  }
  .background:nth-child(2n) {
    background: #fbfbfb;
  }
}
</style>
<style lang="scss">
.response-dimension {
  .el-collapse {
    border: none !important;
  }
  .el-collapse-item__header {
    border: 1px solid #ebeef5 !important;
    // border-bottom: none;
  }
  .el-collapse-item__wrap {
    border-bottom: none !important;
  }
  .el-collapse-item__content {
    padding: 20px !important;
    border: 1px solid #ebeef5 !important;
  }
}
</style>
