<template>
  <div class="prescriptionManage">
    <operationHeader class="margin-bottom20">
      <div class="label">状态</div>
      <el-select
        class="width200 value"
        v-model="status"
        placeholder="请选择"
        @change="changeSearchTime"
      >
        <el-option
          v-for="item in statusList"
          :key="item.name"
          :value="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
      <div style="margin-left: 30px" class="label">科室</div>
      <el-select
        class="width200 value"
        v-model="deptId"
        placeholder="科室"
        @change="getMainList"
        clearable
      >
        <el-option
          v-for="item in deptOptions"
          :key="item.serialNo"
          :value="item.serialNo"
          :label="item.deptName"
        ></el-option>
      </el-select>
      <el-select
        class="margin-left10 width100px select-time-key"
        style="width: 150px"
        default-first-option
        v-model="searchTimeKey"
        v-if="searchEnable"
      >
        <el-option
          v-for="item in timeKeyList"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-date-picker
        class="select-time-val"
        type="daterange"
        v-model="searchTimeValue"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="至"
        clearable
        @change="getMainList"
      ></el-date-picker>

      <el-select
        style="margin-left: 20px; width: 110px;margin-right: -5px; z-index: 999; border-right: 0;"
        class="margin-left10 width100px"
        v-model="keyword"
        @change="getMainList"
      >
        <el-option
          v-for="item in keywordList"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-input class="width200px value" v-model="keyValue" placeholder="请输入" clearable>
        <el-button slot="append" icon="el-icon-search" @click="searchMainList"></el-button>
      </el-input>
      <!-- <template v-slot:right>
        <el-button type="info" icon="el-icon-refresh" plain>刷 新</el-button>
      </template> -->
    </operationHeader>
    <div>
      <el-table
        ref="table"
        class="margin-top20 bdert"
        :data="mainList"
        highlight-current-row
        border
        stripe
      >
        <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip width="120px" prop="userId" label="病人ID"></el-table-column>
        <el-table-column prop="patientName" label="姓名" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" label="科室"></el-table-column>
        <el-table-column show-overflow-tooltip prop="diagnosis" label="临床诊断" width="200"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="prescriptionTime"
          label="开方时间"
          :formatter="$utils.formatTableDate('YYYY-MM-DD HH:mm:ss')"
          width="180"
        ></el-table-column>
        <el-table-column
          v-if="status=='1'"
          show-overflow-tooltip
          prop="processingTime"
          label="处理时间"
          :formatter="$utils.formatTableDate('YYYY-MM-DD HH:mm:ss')"
          width="180"
        ></el-table-column>
        <el-table-column
          v-if="status=='1'"
          show-overflow-tooltip
          prop="firstSendTime"
          label="首条发送时间"
          :formatter="$utils.formatTableDate('YYYY-MM-DD HH:mm:ss')"
          width="180"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="状态" width="200" :formatter="formatStatus"></el-table-column>
        <el-table-column show-overflow-tooltip :min-width="100" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.status"
              @click="addPatient(scope.row.serialNo)"
              type="text"
            >处理</el-button>
            <el-button v-else @click="addPatient(scope.row.serialNo)" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="mainList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: '0',
      statusList: [
        { name: ' 未处理', value: '0' },
        { name: '已处理', value: '1' },
      ],
      searchTimeKey: 'prescriptionTime',
      searchTimeValue: [],
      timeKeyList: [
        { name: '开方时间', value: 'prescriptionTime' },
        { name: '处理时间', value: 'handleTime', disabled: true },
        {
          name: '首条发送时间',
          value: 'firstSendTime',
          disabled: true,
        },
      ],

      keyword: 'patientName',
      keywordList: [
        { name: '患者姓名', value: 'patientName' },
        // { name: ' 联系电话', value: 'phone' },
      ],
      deptId: '',
      keyValue: '',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      deptOptions: [],
      mainList: [],
      searchEnable: true,
    }
  },
  async created() {
    await this.getDeptList()
    await this.getMainList()
  },
  methods: {
    getDeptList() {
      return this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.deptOptions = res || []
        })
    },
    searchMainList() {
      this.pageNo = 1
      this.getMainList()
    },
    getMainList() {
      var param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        keyword: this.keyword,
        keyValue: this.keyValue,
        hospitalId: this.$global.hospital_id,
        status: this.status,
        deptId: this.deptId,
        searchTimeKey: this.searchTimeKey,
        searchTimeValue: this.searchTimeValue
          ? this.searchTimeValue.join(',')
          : '',
      }
      this.$apis.getPrescriptionList(param).then((res) => {
        this.mainList = res.list
        this.total = res.total
      })
    },
    formatStatus(value) {
      var name = ''
      var status = this.statusList.filter((x) => x['value'] == value.status)
      if (status.length > 0) {
        name = status[0].name

        if (value == '2') {
          name += '（请手动操作）'
        }
      }
      return name
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1
      this.pageSize = pageSize
      this.getMainList()
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getMainList()
    },
    addPatient(val) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + '/#/prescriptionContinueDetail?serialNo=' + val,
          title: `处方详情`,
        }),
        '*'
      )
    },
    changeSearchTime() {
      this.searchEnable = false
      this.searchTimeKey = 'prescriptionTime'
      this.timeKeyList = [
        { name: '开方时间', value: 'prescriptionTime' },
        { name: '处理时间', value: 'handleTime', disabled: this.status == '0' },
        {
          name: '首条发送时间',
          value: 'firstSendTime',
          disabled: this.status == '0',
        },
      ]
      this.searchEnable = true
      this.getMainList()
    },
  },
}
</script>
<style lang="scss">
.prescriptionManage {
  padding: 0px 20px 20px 20px;
  .el-input-group__prepend {
    color: rgb(96, 98, 102);
    background-color: #fff;
  }
  .select-time-key {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
  .select-time-val {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  // .but {
  //   width: 98px;
  //   background: #f7fcf8;
  //   border-color: #00982d;
  // }
}
</style>