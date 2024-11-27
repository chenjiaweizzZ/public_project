<template>
  <div class="satisfaction">
    <div class="header">
      注：数据统计至昨日23时59分59秒
      <el-button type="primary" @click="See">查看详细问卷</el-button>
    </div>
    <div class="main">
      <div class="d-table">
        <el-table :data="mainList" border stripe height="100%">
          <el-table-column
            type="index"
            width="80"
            label="序号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="健康管理组"
            prop="groupName"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="总体满意度"
            prop="sumValue"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="流程满意度"
            prop="procedureValue"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="服务满意度"
            prop="serviceValue"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="平均满意度"
            prop="averageValue"
          ></el-table-column>
        </el-table>
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
        this.pageNo = 1
        this.pageSize = 10
        if (this.activeName != "second") return;
        this.getStatisticsOrderList();
      }
    },
    groupId: {
      handler(newVal) {
        this.pageNo = 1
        this.pageSize = 10
        if (this.activeName != "second") return;
        this.getStatisticsOrderList();
      }
    },
    time: {
      handler(newVal) {
        this.pageNo = 1
        this.pageSize = 10
        if (this.activeName != "second") return;
        this.getStatisticsOrderList();
      }
    },
    activeName: {
      handler(newVal) {
        if (this.activeName != "second") return;
        this.getStatisticsOrderList();
      }
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      mainList: []
    };
  },
  created() {
    if (this.activeName == "second") {
      this.getStatisticsOrderList();
    }
  },
  methods: {
    handleSizeChange(v) {
      this.pageNo = 1;
      this.pageSize = v;
      this.getStatisticsOrderList();
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getStatisticsOrderList();
    },
    getStatisticsOrderList() {
      this.$apis
        .selectVerifySatisfactionStatistics({
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
    See() {
      let urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: `${urlx}/#/satisfactionQuestionnaireStatistics`,
          title: "咨询满意度"
        }),
        "*"
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.satisfaction {
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .d-table {
      flex: 1;
      overflow: hidden;
    }
    .pagination {
      margin-bottom: 20px;
    }
  }
}
</style>
