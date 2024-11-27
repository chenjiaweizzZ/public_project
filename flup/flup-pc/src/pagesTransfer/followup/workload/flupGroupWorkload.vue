<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <template v-slot:right>
        <div class="bold">随访科室</div>
        <el-select class="marginX10" v-model="deptId" clearable>
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <div class="bold">随访完成日期</div>
        <el-date-picker
          class="marginX10"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="queryFlupGroupWorkload"
        ></el-date-picker>
        <el-button type="primary" @click="queryFlupGroupWorkload" plain>查询</el-button>
        <el-button type="primary" @click="exportFiles" plain>批量导出</el-button>
      </template>
    </OperationHeader>

    <el-tabs v-model="activeName">
      <el-tab-pane label="图表展示" name="1">
        <ve-histogram v-if="activeName == 1" :data="chartData"></ve-histogram>
      </el-tab-pane>
      <el-tab-pane label="列表展示" name="2">
        <el-table :data="tableData" border style="width: 100%" @select="changeSelect">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="groupName" label="随访组名称"></el-table-column>
          <el-table-column prop="count" label="已随访人次"></el-table-column>
          <el-table-column prop="serialNo" label="随访组编号"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="onView(scope.row)" type="text">详情</el-button>
              <el-button @click="exportFile(scope.row)" type="text">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DeptList from '@/mixins/deptList'
import histogram from 'v-charts/lib/histogram.common'
export default {
  mixins: [DeptList],
  components: {
    [histogram.name]: histogram,
  },
  data() {
    return {
      tableData: [],
      daterange: [],
      selection: [],
      selections: [],
      deptId: '',
      startDate: '',
      endDate: '',
      deptOptions: [],
      list: 'flupDate',
      chartData: {
        columns: ['随访组名称', '已随访人次'],
        rows: [],
      },
      activeName: '2',
      timeKeyList: [
        { label: '随访日期', value: 'flupDate' },
        { label: '出院日期', value: 'dischargeDate' },
      ],
    }
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    await this.getNewDeptList()
  },
  mounted() {
    this.queryFlupGroupWorkload()
  },
  methods: {
    queryFlupGroupWorkload() {
      this.$apis
        .queryFlupGroupWorkload({
          hospitalId: this.$global.hospital_id,
          deptId: this.deptId,
          //startDate: this.startDate,
          //endDate: this.endDate,
          searchTimeVal: !this.daterange ? '' : this.daterange.join(','), //2020-09-01,2020-09-30
          groupType: 0,
          keyValue: '',
          keyword: '',
          pageNo: 0,
          pageSize: 1000,
        })
        .then((res) => {
          this.tableData = res.list
          res.list.forEach((element, index) => {
            this.chartData.rows.push({
              随访组名称: element.groupName,
              已随访人次: element.count,
            })
          })
        })
    },
    onView(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      console.log(
        urlx +
          `/#/flupPatientPlanList?groupId=${row.serialNo}&deptId=${
            this.deptId
          }&searchTimeVal=${!this.daterange ? '' : this.daterange.join(',')}`
      )
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/flupPatientPlanList?groupId=${row.serialNo}&deptId=${
              this.deptId
            }&searchTimeVal=${!this.daterange ? '' : this.daterange.join(',')}`,
          title: '随访组任务',
        }),
        '*'
      )
    },
    // exportFile(row) {
    //   let query = {
    //     groupId: row.serialNo,
    //     deptId: this.deptId,
    //     searchTimeVal: !this.daterange ? '' : this.daterange.join(','),
    //   }
    //   location.href =
    //     this.$baseURL.ICDMApiUrl +
    //     '/b/flup/exportFlupPatientPlanList?' +
    //     this.$qs.stringify({
    //       ...query,
    //     })
    // },
    exportFiles() {
      if (this.selection.length == 0) {
        this.$message({
          message: '请先选中要导出的数据!',
          type: 'warning',
        })
        return
      }
      let selected = []
      this.selection.forEach((element) => {
        selected.push(element.serialNo)
      })
      let query = {
        groupId: selected.join(','),
        deptId: this.deptId,
        searchTimeVal: !this.daterange ? '' : this.daterange.join(','),
      }
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/flup/exportFlupPatientPlanList?' +
        this.$qs.stringify({
          ...query,
        })
    },
    changeSelect(val) {
      this.selection = val
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
