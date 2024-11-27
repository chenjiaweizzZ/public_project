<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <template v-slot:right>
        <div class="bold">随访科室</div>
        <el-select class="marginX10" v-model="deptId" clearable @change="queryFlupYearWorkload">
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <div class="bold">随访年度</div>
        <el-date-picker
          class="marginX10"
          v-model="year"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
          @change="queryFlupYearWorkload"
        ></el-date-picker>
        <el-button type="primary" @click="queryFlupYearWorkload" plain>查询</el-button>
        <el-button type="primary" @click="exportFile">导出</el-button>
      </template>
    </OperationHeader>
    <el-tabs v-model="activeName">
      <el-tab-pane label="图表展示" name="1">
        <ve-histogram v-if="activeName == 1" :data="chartData"></ve-histogram>
      </el-tab-pane>
      <el-tab-pane label="列表展示" name="2">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="flupType" label="随访类型" width="100"></el-table-column>
          <el-table-column prop="count1" label="1月"></el-table-column>
          <el-table-column prop="count2" label="2月"></el-table-column>
          <el-table-column prop="count3" label="3月"></el-table-column>
          <el-table-column prop="count4" label="4月"></el-table-column>
          <el-table-column prop="count5" label="5月"></el-table-column>
          <el-table-column prop="count6" label="6月"></el-table-column>
          <el-table-column prop="count7" label="7月"></el-table-column>
          <el-table-column prop="count8" label="8月"></el-table-column>
          <el-table-column prop="count9" label="9月"></el-table-column>
          <el-table-column prop="count10" label="10月"></el-table-column>
          <el-table-column prop="count11" label="11月"></el-table-column>
          <el-table-column prop="count12" label="12月"></el-table-column>
          <el-table-column prop="countall" label="总数量"></el-table-column>
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
      deptId: '',
      startDate: '',
      endDate: '',
      deptOptions: [],
      year: '',
      chartData: {
        columns: ['日期'],
        rows: [],
      },
      activeName: '2',
    }
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    // this.$startLoading()
    await this.getNewDeptList()
    // this.$stopLoading()
  },
  mounted() {
    // this.$apis
    //   .departmentgetFlupDeptByHospitalId({
    //     hospitalId: this.$global.hospital_id,
    //   })
    //   .then((res) => {
    //     this.deptOptions = res || [];
    //   });

    this.queryFlupYearWorkload()
  },
  methods: {
    queryFlupYearWorkload() {
      this.chartData = {
        columns: ['日期'],
        rows: [],
      }
      this.$apis
        .queryFlupYearWorkload({
          hospitalId: this.$global.hospital_id,
          deptId: this.deptId,
          year: this.year,
        })
        .then((res) => {
          this.tableData = res
          res.forEach((element) => {
            this.chartData.columns.push(element.flupType)
            let i = 0
            for (let itme in element) {
              if (itme.indexOf('count') != -1 && itme != 'countall') {
                if (!this.chartData.rows[i]) {
                  this.chartData.rows[i] = {}
                }
                this.chartData.rows[i]['日期'] = i + 1 + '月'
                this.chartData.rows[i][element.flupType] = element[itme]
                i = i + 1
              }
            }
          })
        })
    },
    exportFile() {
      let query = {
        hospitalId: this.$global.hospital_id,
        deptId: this.deptId,
        year: this.year,
      }
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/flup/exportFlupYearWorkload?' +
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
