<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <el-button type="primary" @click="exportFile" plain>导出</el-button>
      <template v-slot:right>
        <div class="bold">科室</div>
        <el-select class="marginX10" v-model="deptCode" clearable>
          <el-option
            v-for="item in deptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <div class="bold">统计日期</div>
        <el-date-picker
          class="marginX10"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"
        ></el-date-picker>
        <el-button type="primary" @click="getgetSignReport" plain>查询</el-button>
      </template>
    </OperationHeader>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="packageName" label="服务内容" width="180"></el-table-column>
      <el-table-column prop="deptName" label="关联科室" width="180"></el-table-column>
      <el-table-column prop="applyCount" label="申请签约人数"></el-table-column>
      <el-table-column prop="auditCount" label="通过人数"></el-table-column>
      <el-table-column prop="returnCount" label="退回人数"></el-table-column>
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
      deptCode: '',
      startDate: '',
      endDate: '',
      deptOptions: [],
    }
  },
  mounted() {
    this.$apis
      .departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.deptOptions = res || []
      })

    this.getgetSignReport()
  },
  methods: {
    dateChange(date) {
      if (!date) {
        this.startDate = ''
        this.endDate = ''
      } else {
        this.startDate = date[0]
        this.endDate = date[1]
      }
      this.getgetSignReport()
    },
    getgetSignReport() {
      this.$apis
        .getSignReport({
          deptCode: this.deptCode,
          startDate: this.startDate,
          endDate: this.endDate,
        })
        .then((res) => {
          this.tableData = res
        })
    },
    exportFile() {
      let query = {
        deptCode: this.deptCode,
        startDate: this.startDate,
        endDate: this.endDate,
      }
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/signApplyRecord/exportSignReport?' +
        this.$qs.stringify({
          ...query,
        })
    },
  },
}
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
