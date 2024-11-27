<template>
  <div class="chat-history">
    <div class="header">
      <div class="search">
        <section>
          <span class="title">时间</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="Search"
          ></el-date-picker>
        </section>
        <section>
          <span class="title">出售机构</span>
          <el-select v-model="hospitalId" filterable placeholder="请选择" clearable @change="Change">
            <el-option v-for="item in hospitalList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name"></el-option>
          </el-select>
        </section>
        <section>
          <span class="title">科室</span>
          <el-select v-model="deptId" filterable clearable placeholder="请选择" @change="Search">
            <el-option v-for="item in deptList" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
          </el-select>
        </section>
        <section>
          <span class="title">健康管理组</span>
          <el-select v-model="groupId" filterable clearable placeholder="请选择" @change="Search">
            <el-option v-for="item in flupGroupList" :key="item.serialNo" :label="item.groupName" :value="item.serialNo"></el-option>
          </el-select>
        </section>
        <section>
          <span class="title">健康管理师</span>
          <el-select v-model="healthyManager" filterable clearable placeholder="请选择" @change="Search">
            <el-option v-for="(item,index) in healthyManagerList" :key="index" :label="item.name" :value="item.manageUserId"></el-option>
          </el-select>
        </section>
      </div>
      <el-button type="primary" @click="Export" plain>导出</el-button>
    </div>
    <div class="main">
      <div class="d-table">
        <el-table :data="mainList" border stripe height="100%">
          <el-table-column type="index" width="80" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip label="健康管理组名称" prop="groupName"></el-table-column>
          <el-table-column show-overflow-tooltip label="健康管理师" prop="realName"></el-table-column>
          <el-table-column v-for="(item,index) in projectList" :key="item.verifyItemCode" :label="item.verifyItemName" :prop="item.verifyItemCode">
            <template slot-scope="scope">
              <div @click="getDetail(scope.row,scope.row.equityTimesViewList[index])">{{ scope.row.equityTimesViewList[index].times }}</div>
            </template>
          </el-table-column>
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
      <el-dialog :title="dialogTitle" :visible.sync="detailDialogVisible" width="80%" class="detailDialog" height="600px">
        <div class="search">
          <section>
            <span class="title">患者名</span>
            <el-input v-model="patientName" placeholder="请输入" maxlength="20" show-word-limit @change="getDetailData"></el-input>
          </section>
          <section>
            <span class="title">健康管理方案</span>
            <el-select v-model="caseId" filterable clearable placeholder="请选择" @change="getDetailData">
              <el-option v-for="item in caseList" :key="item.packageId" :label="item.packageName" :value="item.packageId"></el-option>
            </el-select>
          </section>
        </div>
        <el-table :data="detailData" border stripe height="500px">
          <el-table-column type="index" width="80" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip label="患者名" prop="patientName"></el-table-column>
          <el-table-column show-overflow-tooltip label="健康管理方案" prop="packageName"></el-table-column>
          <el-table-column show-overflow-tooltip label="方案购买时间" prop="packageTime"></el-table-column>
          <el-table-column show-overflow-tooltip label="健康管理规格" prop="specName"></el-table-column>
          <el-table-column show-overflow-tooltip label="权益使用时间" prop="verifyTime">
            <template slot-scope="scope">
              <div>{{ scope.row.verifyTime.substring(0,10) }}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          :page-sizes="[10, 20, 30, 50]"
          @size-change="handleSizeChangeDetail"
          @current-change="handleCurrentChangeDetail"
          background
          :current-page.sync="detailPageNo"
          :page-size="detailPageSize"
          layout="total,sizes,prev, pager, next"
          :total="detailTotal"
        ></el-pagination>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: this.getLastMonth(1),
      groupId: '',
      pageSize: 10,
      pageNo: 1,
      total: 1,
      hospitalList: [],
      deptList: [],
      flupGroupList: [],
      mainList: [],
      hospitalId: this.$global.hospital_id,
      deptId: '',
      projectList: [],
      healthyManager: '',
      healthyManagerList: [],
      detailDialogVisible: false,
      dialogTitle: '',
      detailData: [],
      detailPageSize: 10,
      detailPageNo: 1,
      detailTotal: 1,
      patientName: '',
      caseId: '',
      caseList: [],
      currentDetail: {},
      columnDetail: {},
    };
  },
  created() {
    this.getAllHospitalList();
    this.getDeptList(this.hospitalId);
    this.getHealthyManagerList(this.hospitalId);
    this.getFlupGroupList(this.hospitalId);
    this.getEquityUsedStatistics();
  },
  methods: {
    /**
     * 健康管理组查询
     */
    getFlupGroupList(hospitalId) {
      this.$apis
        .groupgetFlupGroupList({
          hospitalId: hospitalId,
          pageNo: 1,
          pageSize: 999,
        })
        .then((res) => {
          this.flupGroupList = res.list;
        });
    },
    /**
     * 获取医院列表
     */
    getAllHospitalList() {
      this.$apis.getAllHospitalList().then((res) => {
        this.hospitalList = res;
      });
    },
    /**
     * 获取科室列表
     */
    getDeptList(hospitalId) {
      this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId,
        })
        .then((res) => {
          this.deptList = res || [];
        });
    },
    //获取健康管理师筛选列表
    getHealthyManagerList(hospitalId) {
      this.$apis
        .getManagerUserList({
          hospitalId,
        })
        .then((res) => {
          this.healthyManagerList = res || [];
        });
    },
    getEquityUsedStatistics() {
      this.$apis
        .equityUsedStatistics({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          beginDate: this.time && this.time[0] ? this.time[0] : '',
          endDate: this.time && this.time[1] ? this.time[1] : '',
          hospitalId: this.hospitalId,
          deptId: this.deptId,
          groupId: this.groupId,
          manageUserId: this.healthyManager,
        })
        .then((res) => {
          if (res) {
            let list = res.list || [];
            this.mainList = res.list || [];
            this.projectList = res.list.length > 0 ? res.list[0].equityTimesViewList : [];
            list.forEach((item, index) => {
              item.equityTimesViewList.forEach((items) => {
                item[items.verifyItemCode] = items.times;
              });
            });

            this.mainList = list;
            this.total = res.total;
            // console.log(this.mainList);
          } else {
            this.mainList = [];
            this.total = 0;
          }
        });
    },
    /**
     * 分页查询
     */
    handleSizeChange(v) {
      this.pageNo = 1;
      this.pageSize = v;
      this.getEquityUsedStatistics();
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getEquityUsedStatistics();
    },
    handleSizeChangeDetail(v) {
      this.detailPageNo = 1;
      this.detailPageSize = v;
      this.getDetailData();
    },
    handleCurrentChangeDetail(v) {
      this.detailPageNo = v;
      this.getDetailData();
    },
    Change() {
      this.deptId = '';
      this.groupId = '';
      this.getDeptList(this.hospitalId);
      this.getFlupGroupList(this.hospitalId);
      this.Search();
    },
    Search() {
      this.pageNo = 1;
      this.pageSize = 10;
      this.getEquityUsedStatistics();
    },
    Export(event) {
      event.target.blur();
      if (event.target.nodeName == 'SPAN') {
        event.target.parentNode.blur();
      }
      this.$apis
        .exclEquityUsedStatistics({
          beginDate: this.time && this.time[0] ? this.time[0] : '',
          endDate: this.time && this.time[1] ? this.time[1] : '',
          hospitalId: this.hospitalId,
          deptId: this.deptId,
          groupId: this.groupId,
          manageUserId: this.healthyManager,
        })
        .then((res) => {
          let url = window.URL.createObjectURL(
            // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
            new Blob([res], { type: 'application/ms-excel' })
          );
          // 进行基本思路的操作
          let link = document.createElement('a');
          link.href = url;
          link.download = '服务权益使用统计.xlsx';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    getLastMonth(i) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let dateArr = new Array(2);
      dateArr[1] = year + '-' + month + '-' + day;
      let nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
      if (i == 12) {
        //如果是12月，年数往前推一年<br>
        dateArr[0] = year - 1 + '-' + month + '-' + day;
      } else if (month - i <= 0) {
        // 如果前推i月小于0，年数往前推一年<br>
        dateArr[0] = year - 1 + '-' + 12 + '-' + day;
      } else {
        let endTimeMonthDay = new Date(year, parseInt(month) - i, 0).getDate();
        if (endTimeMonthDay < day) {
          // i个月前所在月的总天数小于现在的天日期
          if (day < nowMonthDay) {
            // 当前天日期小于当前月总天数
            dateArr[0] = year + '-' + (month - i) + '-' + (endTimeMonthDay - (nowMonthDay - day));
          } else {
            dateArr[0] = year + '-' + (month - i) + '-' + endTimeMonthDay;
          }
        } else {
          dateArr[0] = year + '-' + (month - i) + '-' + day;
        }
      }
      return dateArr;
    },
    getDetail(row, column) {
      console.log('rowrow', row);
      this.currentDetail = row;
      this.columnDetail = column;
      this.dialogTitle = this.columnDetail.verifyItemName;
      this.patientName = '';
      this.caseId = '';
      this.detailDialogVisible = true;
      this.getCaseList();
      this.getDetailData();
    },
    getCaseList() {
      this.caseList = [];
      this.$apis
        .getPackageList({
          pageNo: this.detailPageNo,
          pageSize: this.detailPageSize,
          beginDate: this.time && this.time[0] ? this.time[0] : '',
          endDate: this.time && this.time[1] ? this.time[1] : '',
          groupId: this.currentDetail.groupId,
          verifyItemCode: this.columnDetail.verifyItemCode,
        })
        .then((res) => {
          // console.log(res, 'jjjjjfffffffffffffffffjjjjjj');
          this.caseList = res;
        });
    },
    getDetailData() {
      // console.log(this.currentDetail, 'jjjjjjjjjjj');
      this.$apis
        .getGroupEquityDetail({
          pageNo: this.detailPageNo,
          pageSize: this.detailPageSize,
          beginDate: this.time && this.time[0] ? this.time[0] : '',
          endDate: this.time && this.time[1] ? this.time[1] : '',
          groupId: this.currentDetail.groupId,
          verifyItemCode: this.columnDetail.verifyItemCode,
          patientName: this.patientName,
          packageId: this.caseId,
        })
        .then((res) => {
          // console.log(res, 'jjjjjfffffffffffffffffjjjjjj');
          this.detailData = res.list;
          this.detailTotal = res.total;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.chat-history {
  height: 100%;
  margin: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f2f2f2;
    padding-right: 20px;
    margin-bottom: 10px;
    .search {
      display: flex;
      flex-wrap: wrap;
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 20px;
      .title {
        flex-shrink: 0;
        margin-right: 14px;
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
  .title {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .detailDialog {
    .search {
      display: flex;
      flex-wrap: wrap;
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 20px;
      .title {
        flex-shrink: 0;
        margin-right: 14px;
      }
    }
  }
}
</style>
