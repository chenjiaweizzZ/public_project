<template>
  <div class="income-statistics">
    <div class="search-container">
      <div class="search-container-left">
        <span class="search-title">订单时间</span>
        <el-date-picker v-model="time" type="month" placeholder="选择月" format="yyyy 年 M 月" value-format="yyyy-M">
        </el-date-picker>
        <el-input style=" width: 280px; margin-left: 20px;" placeholder="请输入关键字查询" v-model="groupName" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getGroupIncome"></el-button>
        </el-input>
      </div>
      <div class="search-container-right">
        <el-button type="success" plain @click="exporTable">导出</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item v-for="(item, index) in tableData" :key="index" :name="index">
          <template slot="title">
            <span class="table-column1">
              <span>{{ item.groupName }}</span>
            </span>
            <span class="table-column2">
              <span>{{ item.effectiveOrderFee | centToYuan }}</span>
            </span>
          </template>
          <div class="linee"></div>
          <el-table :data="groupPackageIncomelist" style="width: 100%;" :show-header="false">
            <el-table-column type="index" width="55"></el-table-column>
            <el-table-column prop="groupName"></el-table-column>
            <el-table-column prop="groupName">
              <template slot-scope="scope">
                <span>{{ scope.row.effectiveOrderFee | centToYuan }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="groupMemberIncomeList" style="width: 100%;">
            <el-table-column prop="realName" label="医生名"></el-table-column>
            <el-table-column prop="percent" label="收入比例">
            </el-table-column>
            <el-table-column prop="groupName" label="收入金额">
              <template slot-scope="scope">
                <span>{{ scope.row.amount | centToYuan }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="page-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
      groupName: "",
      pageSize: 10,
      pageNum: 1,
      tableData: [],
      activeNames: [],
      total: 0,
      groupMemberIncomeList: [],
      groupPackageIncomelist: [],
    };
  },
  filters: {
    centToYuan(value) {
      if (value == 0) {
        return "¥" + 0;
      } else {
        return "¥" + value / 100;
      }
    },
  },
  created() {
    this.iniTime();
  },
  methods: {
    exporTable() {
      this.$apis.exportAllGroupIncome(this.getParams()).then((res) => {
        let url = window.URL.createObjectURL(
          new Blob([res], { type: "application/ms-excel" })
        );
        let link = document.createElement("a");
        link.href = url;
        link.download = "收入统计.xlsx";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.activeNames = [];
      this.getGroupIncome();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.activeNames = [];
      this.getGroupIncome();
    },
    iniTime() {
      this.time = this.getDatesArray();
      this.getGroupIncome();
    },
    getDatesArray() {
      const today = new Date();
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
      }
      return formatDate(today);
    },
    getParams() {
      return {
        year: this.time ? this.time.split("-")[0] : "",
        month: this.time ? this.time.split("-")[1] : "",
        groupName: this.groupName,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
    },
    getGroupIncome() {
      let params = {
        year: this.time ? this.time.split("-")[0] : "",
        month: this.time ? this.time.split("-")[1] : "",
        groupName: this.groupName,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
      this.$apis.listAllGroupIncome(params).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
      });
    },
    handleChange(val) {
      let obj = this.tableData[val];
      if (obj) {
        let params = {
          year: this.time ? this.time.split("-")[0] : "",
          month: this.time ? this.time.split("-")[1] : "",
          pageSize: 999,
          pageNo: 1,
          hospitalId: obj.hospitalId,
          groupId: obj.serialNo,
        };
        this.listGroupMemberIncome(params);
        this.listGroupPackageIncome(params);
      }
    },
    listGroupMemberIncome(params) {
      this.$apis.listGroupMemberIncome(params).then((res) => {
        let { list } = res;
        let totalAmount = list.reduce((sum, obj) => sum + obj.amount, 0);
        let newList = list.map((i) => {
          let percent =
            totalAmount > 0 ? ((i.amount / totalAmount) * 100).toFixed(2) : "0";
          return { ...i, percent: `${percent}%` };
        });
        this.groupMemberIncomeList = newList;
      });
    },
    listGroupPackageIncome(params) {
      this.$apis.listGroupPackageIncome(params).then((res) => {
        this.groupPackageIncomelist = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.income-statistics {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    margin-bottom: 10px;
    height: 50px;
    .search-title {
      margin-left: 10px;
      margin-right: 10px;
      white-space: nowrap;
      border-left: 1px solid #ccc;
    }
  }
  .table-container {
    margin-left: 10px;
    margin-right: 10px;
    padding-bottom: 56px;
    flex: 1;
    overflow: scroll;
    .table-column1 {
      min-width: 28vw;
      padding-left: 10px;
    }
    .table-column2 {
      width: 8vw;
    }
    .linee {
      background-color: #e6e6e6;
      height: 1px;
      width: 100%;
    }
  }
  .page-container {
    height: 60px;
  }
}
</style>

<style lang="scss">
.income-statistics {
  .table-container {
    .el-collapse {
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
  }
}
</style>