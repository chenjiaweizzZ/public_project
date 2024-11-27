<template>
  <div class="marginX20 padding-top20">
    <OperationHeader>
      <template v-slot:right>
        <!-- <el-button type="primary" @click="getFlupPatientPlanList">查询</el-button> -->
        <div class="bold">统计数量：{{ tableData.length }}</div>
      </template>
    </OperationHeader>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="patientName" label="姓名">
        <template slot-scope="scope">{{scope.row.patientName | hideInfo('patientName')}}</template>
      </el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="phone" label="随访电话">
        <template slot-scope="scope">{{scope.row.phone | hideInfo('phone')}}</template>
      </el-table-column>
      <el-table-column prop="deptName" label="随访科室"></el-table-column>
      <el-table-column prop="flupType" label="随访类别"></el-table-column>
      <el-table-column prop="groupName" label="随访组"></el-table-column>
      <el-table-column prop="doctorName" label="随访医生"></el-table-column>
      <el-table-column prop="flupDate" label="随访日期"></el-table-column>
      <el-table-column prop="flupState" label="随访结果"></el-table-column>
    </el-table>
  </div>
</template>

<script>
// import DeptList from '@/mixins/deptList'
export default {
  data() {
    return {
      tableData: [],
      daterange: [],
      deptId: "",
      startDate: "",
      endDate: "",
      deptOptions: [],
      year: "",
    };
  },
  mounted() {
    // this.$apis
    //   .departmentgetFlupDeptByHospitalId({
    //     hospitalId: this.$global.hospital_id,
    //   })
    //   .then((res) => {
    //     this.deptOptions = res || [];
    //   });

    this.getFlupPatientPlanList();
  },
  methods: {
    getFlupPatientPlanList() {
      this.$apis
        .getFlupPatientPlanList({
          groupId: this.$route.query.groupId,
          deptId: this.$route.query.deptId,
          searchTimeVal: this.$route.query.searchTimeVal,
        })
        .then((res) => {
          this.tableData = res;
        });
    },
  },
};
</script>

<style lang="scss">
.proportion-selectQuestion {
  .el-button {
    width: 250px;
  }

  .el-checkbox,
  .el-checkbox + .el-checkbox {
    margin: 10px 0;
  }

  .el-checkbox__label {
    width: 200px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<style scoped>
.proportion-icon {
  font-size: 20px;
  margin-left: 10px;
}
</style>
