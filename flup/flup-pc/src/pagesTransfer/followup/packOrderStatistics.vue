<template>
  <div class="pack-order-statistics">
    <div class="search-container">
      <span class="search-title">订单时间</span>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        unlink-panels
        end-placeholder="结束日期"
        @change="dateChange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <span class="search-title">出售机构</span>
      <el-select v-model="sourceId" placeholder="请选择" @change="listPackageOrderStatistics(1)" filterable clearable>
        <el-option v-for="item in sellingList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name"></el-option>
      </el-select>
      <span class="search-title">科室</span>
      <el-select v-model="dept" placeholder="请选择" @change="listPackageOrderStatistics(1)" filterable clearable>
        <el-option v-for="item in deptList" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
      </el-select>
      <span class="search-title">支付方式</span>
      <el-select v-model="payType" placeholder="请选择" @change="listPackageOrderStatistics(1)" clearable>
        <el-option v-for="item in paymentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span class="search-title">服务内容名称</span>
      <el-select v-model="pack" placeholder="请选择" @change="listPackageOrderStatistics(1)" filterable clearable>
        <el-option v-for="item in packList" :key="item.packageId" :label="item.packageName" :value="item.packageId"></el-option>
      </el-select>
      <span class="search-title"></span>
      <el-button type="primary" @click="exportTable" plain>导出</el-button>
    </div>
    <div class="table-container">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item v-for="(item, index) in tableData" :key="index" :name="index">
          <template slot="title">
            <span class="table-index">{{ index + 1 }}</span>
            <span class="table-package">{{ item.packageName }}</span>
            <span class="table-column">
              <span>总订单数:</span>
              <span>{{ item.orderCount }}</span>
            </span>
            <span class="table-column">
              <span>总订单金额:</span>
              <span>{{ item.orderFee | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>取消订单数:</span>
              <span>{{ item.cancelOrderCount }}</span>
            </span>
            <span class="table-column">
              <span>取消订单金额:</span>
              <span>{{ item.cancelOrderFee | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>退款订单数:</span>
              <span>{{ item.refundedOrderCount }}</span>
            </span>
            <span class="table-column">
              <span>退款订单金额:</span>
              <span>{{ item.refundedOrderFee | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>有效订单数:</span>
              <span>{{ item.effectiveOrderCount }}</span>
            </span>
            <span class="table-column">
              <span>有效订单金额:</span>
              <span>{{ item.effectiveOrderFee | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>医院费用:</span>
              <span>{{ item.hospitalAmount | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>公司费用:</span>
              <span>{{ item.zhuojianAmount | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>税费:</span>
              <span>{{ item.taxesFee | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>健康管理组费用:</span>
              <span>{{ item.groupAmount | keepTwoNum }}</span>
            </span>
            <span class="table-column">
              <span>第四方费用:</span>
              <span>{{ item.otherAmount | keepTwoNum }}</span>
            </span>
          </template>
          <el-table :data="tableInData" style="width: 100%;">
            <template slot="empty">
              <i class="el-icon-loading" v-if="isLoading"></i>
              <span v-else>暂无数据</span>
            </template>
            <el-table-column type="index" width="55" label="序号"></el-table-column>
            <el-table-column prop="specName" width="300" label="规格"></el-table-column>
            <el-table-column prop="specPrice" label="单价">
              <template slot-scope="scope">
                <span>{{ scope.row.specPrice | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderCount" label="总订单数"></el-table-column>
            <el-table-column prop="orderFee" label="总订单金额">
              <template slot-scope="scope">
                <span>{{ scope.row.orderFee | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cancelOrderCount" label="取消订单数"></el-table-column>
            <el-table-column prop="refundedOrderCount" label="退款订单数"></el-table-column>
            <el-table-column prop="refundedOrderFee" label="退款订单金额">
              <template slot-scope="scope">
                <span>{{ scope.row.refundedOrderFee | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveOrderCount" label="有效订单数"></el-table-column>
            <el-table-column prop="effectiveOrderFee" label="有效订单金额">
              <template slot-scope="scope">
                <span>{{ scope.row.effectiveOrderFee | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hospitalAmount" label="医院费用">
              <template slot-scope="scope">
                <span>{{ scope.row.hospitalAmount | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="zhuojianAmount" label="公司费用">
              <template slot-scope="scope">
                <span>{{ scope.row.zhuojianAmount | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taxesFee" label="税费">
              <template slot-scope="scope">
                <span>{{ scope.row.taxesFee | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="groupAmount" label="健康管理组费用">
              <template slot-scope="scope">
                <span>{{ scope.row.groupAmount | keepTwoNum }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="groupAmount" label="第四方费用">
              <template slot-scope="scope">
                <span>{{ scope.row.otherAmount | keepTwoNum }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="page-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      activeNames: [],
      time: [],
      sellingList: [], //出售机构列表
      sourceId: '',
      deptList: [], //科室列表
      dept: '',
      paymentList: [
        {
          label: '微信支付',
          value: 0,
        },
        {
          label: '支付宝支付',
          value: 1,
        },
        {
          label: '院内收款',
          value: 2,
        },
      ], //支付方式列表
      payType: '',
      packList: [], //服务包列表
      pack: '',
      tableInData: [],
      pageNo: 1,
      pageSize: 10,
      total: 100,
      isLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    console.log(12313, this.$global);
    this.iniTime();
    this.getAllHospitalList();
    this.listPackageOrderStatistics();
    this.getQueryDeptTypeList();
    this.getPackNameList();
  },
  watch: {},
  filters: {
    keepTwoNum: function (value) {
      value = Number(value);
      if (value) {
        return value / 100;
      } else {
        return 0;
      }
    },
  },
  methods: {
    iniTime() {
      this.time = this.getDatesArray();
    },
    getDatesArray() {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      const datesArray = [formatDate(thirtyDaysAgo), formatDate(today)];
      return datesArray;
    },
    listPackageOrderStatistics(pageNo = this.pageNo) {
      pageNo ? (this.pageNo = pageNo) : '';
      this.$apis
        .listPackageOrderStatistics({
          pageNo: pageNo,
          pageSize: this.pageSize,
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          sourceId: this.sourceId,
          payType: this.payType,
          packageDeptId: this.dept,
          targetPackageId: this.pack,
        })
        .then((res) => {
          this.activeNames = [];
          this.tableData = res.list;
          this.total = res.total;
        });
    },
    getAllHospitalList() {
      this.$apis.getAllHospitalList().then((res) => {
        this.sellingList = res;
      });
    },
    getQueryDeptTypeList() {
      // this.$apis.queryDeptTypeList().then(res => {
      //     this.deptList = res;
      // });
      this.$apis
        .selectDeptByUserGroup({
          hospitalId: this.$global.hospital_id,
          userId: JSON.parse(sessionStorage.getItem('global')).userId || '',
        })
        .then((res) => {
          this.deptList = res;
        });
    },
    getPackNameList() {
      this.$apis
        .listPackageOrderStatistics({
          pageNo: 1,
          pageSize: 999999,
        })
        .then((res) => {
          this.packList = res.list;
        });
    },
    dateChange() {
      this.listPackageOrderStatistics(1);
    },
    exportTable() {
      this.$apis
        .exportPackageOrder({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          sourceId: this.sourceId,
          payType: this.payType,
          packageDeptId: this.dept,
          targetPackageId: this.pack,
        })
        .then((res) => {
          let url = window.URL.createObjectURL(
            // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
            new Blob([res], { type: 'application/ms-excel' })
          );
          // 进行基本思路的操作
          let link = document.createElement('a');
          link.href = url;
          link.download = '服务内容售卖统计.xlsx';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    feedback() {
      // this.$apis.feedbackReply({
      //     recordId:
      // }).then(res => {
      //     console.log(res)
      // })
      this.dialogVisible = false;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.activeNames = [];
      this.listPackageOrderStatistics(1);
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.activeNames = [];
      this.listPackageOrderStatistics();
    },
    handleChange(val) {
      this.tableInData = [];
      let obj = this.tableData[val];
      this.isLoading = true;
      this.$apis
        .listPackageOrderStatistics({
          packageId: obj.packageId,
          pageNo: 1,
          pageSize: 999999,
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          payType: this.payType,
          sourceId: this.sourceId,
        })
        .then((res) => {
          this.tableInData = res.list;
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.pack-order-statistics {
  .search-container {
    display: flex;
    align-items: center;
    min-height: 40px;
    margin-bottom: 10px;

    .search-title {
      margin-left: 10px;
      margin-right: 10px;
      white-space: nowrap;
    }
  }

  .table-container {
    margin-left: 10px;
    margin-right: 10px;
    padding-bottom: 56px;

    .table-index {
      margin-left: 10px;
      padding-right: 10px;
      width: 30px;
      min-width: 30px;
      border-right: 1px solid #ccc;
    }

    .table-package {
      margin-left: 10px;
      padding-right: 10px;
      width: 20vw;
      border-right: 1px solid #ccc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .table-column {
      width: 8vw;
      margin-left: 10px;
      padding-right: 10px;
      border-right: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: normal;
      height: 48px;
      justify-content: center;
      white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }

    // }
  }

  .page-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
}
</style>

<style lang="scss">
.pack-order-statistics {
  .el-collapse {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .el-table__body {
    .cell {
      height: 32px;
    }
  }
}
</style>