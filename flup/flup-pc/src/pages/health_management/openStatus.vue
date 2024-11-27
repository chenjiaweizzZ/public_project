<template>
  <div class="open-status">
    <div class="header">
      <span class="title">医院名称</span>
      <el-input
        placeholder="请输入关键字查询"
        v-model="keyWord"
        style="width: 280px;"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="Search"
        ></el-button>
      </el-input>
    </div>
    <div class="content">
      接入医院<span class="num">{{ detail.hospitalNum }}</span
      >家，合计出售套餐<span class="num">{{ detail.salesPackageNum }}</span>
    </div>

    <div class="d-table">
      <el-table :data="mainList" border stripe>
        <el-table-column
          type="index"
          width="80px"
          label="序号"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="医院名称"
          prop="hospitalName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="入驻时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="开通套餐"
          prop="openNum"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="售卖总量"
          prop="salesNum"
        ></el-table-column>
        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="Dredge(scope.row)">开通</el-button>
            <el-button type="text" @click="Detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page.sync="pageNum"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      keyWord: "",
      mainList: [],
      detail: {}
    };
  },
  created() {
    this.getListPlatPackageOpenInfo();
    this.getHospitalNumber();
  },
  methods: {
    /**
     * 获取开通情况列表
     */
    getListPlatPackageOpenInfo() {
      this.$apis
        .listPlatPackageOpenInfo({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyword: this.keyWord
        })
        .then(res => {
          this.total = res.total;
          this.mainList = res.list;
        });
    },
    getHospitalNumber() {
      this.$apis.getHospitalNumber({}).then(res => {
        this.detail = res;
      });
    },
    Search() {
      this.pageNum = 1;
      this.getListPlatPackageOpenInfo();
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getListPlatPackageOpenInfo();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getListPlatPackageOpenInfo();
    },
    Dredge(row) {
      let urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      console.log(
        `${urlx}/#/health_management/dredge?hospitalId=${row.hospitalId}&hospitalName=${row.hospitalName}`
      );
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: `${urlx}/#/health_management/dredge?hospitalId=${row.hospitalId}&hospitalName=${row.hospitalName}`,
          title: `开通`
        }),
        "*"
      );
    },
    Detail(row) {
      let urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      console.log(
        `${urlx}/#/health_management/detail?hospitalId=${row.hospitalId}&hospitalName=${row.hospitalName}`
      );
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: `${urlx}/#/health_management/detail?hospitalId=${row.hospitalId}&hospitalName=${row.hospitalName}`,
          title: `详情`
        }),
        "*"
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.open-status {
  height: calc(100% - 82px);
  margin: 0 24px 20px;
  display: flex;
  flex-direction: column;
  .d-table {
    overflow-y: auto;
    flex: 1;
  }
  .header {
    display: flex;
    align-items: center;
    height: 64px;
    line-height: 64px;
    background: #fbfbfb;
    .title {
      margin: 0 14px 0 20px;
    }
  }
  .content {
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 14;
    margin: 16px 0;
    .num {
      font-weight: 600;
      color: #ff7b35;
    }
  }
}
</style>
