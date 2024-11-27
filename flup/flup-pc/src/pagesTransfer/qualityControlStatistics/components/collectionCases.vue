<template>
  <div class="collection-cases">
    <div class="header">
      <div class="item">
        <span class="key">平均收案人次</span>
        <span class="value">{{ averageOrderNumber }}</span>
      </div>
      <div class="item">
        <span class="key">平均收案率</span>
        <span class="value">{{ averageCollectionRate }}</span>
      </div>
      <div class="item">
        <span>注：数据统计至昨日23时59分59秒</span>
      </div>
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
            label="收案人次"
            prop="sumOrderNumber"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="收案率">
            <template slot-scope="scope">
              {{ scope.row.collectionRate.toFixed(2) }}%
            </template></el-table-column
          >
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
        if (this.activeName != "first") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    },
    groupId: {
      handler(newVal) {
        this.pageNo = 1
        this.pageSize = 10
        if (this.activeName != "first") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    },
    time: {
      handler(newVal) {
        this.pageNo = 1
        this.pageSize = 10
        if (this.activeName != "first") return;
        this.getStatisticsOrderAverage();
        this.getStatisticsOrderList();
      }
    },
    activeName: {
      handler(newVal) {
        if (this.activeName != "first") return;
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
      mainList: [],
      averageCollectionRate: 0,
      averageOrderNumber: 0
    };
  },
  created() {
    if (this.activeName == "first") {
      this.getStatisticsOrderAverage();
      this.getStatisticsOrderList();
    }
  },
  methods: {
    getStatisticsOrderList() {
      this.$apis
        .selectStatisticsOrderQuery({
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
        .selectStatisticsOrderAverage({
          deptId: this.packageDeptId,
          startDate: this.time && this.time[0] ? this.time[0] : null,
          endDate: this.time && this.time[1] ? this.time[1] : null,
          groupId: this.groupId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(res => {
          this.averageCollectionRate = res.averageCollectionRate
            ? `${res.averageCollectionRate.toFixed(2)}%`
            : "0%";
          this.averageOrderNumber = res.averageOrderNumber
            ? res.averageOrderNumber.toFixed(2)
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
.collection-cases {
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
      overflow: hidden;
    }
    .pagination {
      margin-bottom: 20px;
    }
  }
}
</style>
