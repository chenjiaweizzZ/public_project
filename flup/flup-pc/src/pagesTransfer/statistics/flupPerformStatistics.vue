<template>
  <div class="flupPerform_statis">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>随访科室</p>
        <el-select
          class="value width200px"
          v-model="deptId"
          placeholder="请选择"
          clearable
          @change="setDeptId"
        >
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>随访/慢病组</p>
        <el-select
          class="value width200px"
          v-model="groupId"
          placeholder="请选择"
          @change="search"
          clearable
        >
          <el-option
            v-for="item in flupGroups"
            :key="item.serialNo"
            :label="item.groupName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>

      <div class="queryConditions">
        <el-input
          class="width380px value limiting"
          v-model="keyValue"
          placeholder="请输入关键字"
          maxlength="20"
          show-word-limit
        >
          <el-select class="width110px" v-model="keyword" slot="prepend">
            <el-option
              v-for="item in searchKeyList"
              :key="item.key"
              :value="item.key"
              :label="item.value"
            ></el-option>
          </el-select>

          <!-- <el-button slot="append" icon="el-icon-search" @click="search"></el-button> -->
        </el-input>
      </div>

      <div class="queryConditions">
        <p>就诊日期</p>
        <el-date-picker
          class="value"
          type="daterange"
          v-model="date"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          clearable
          @change="search"
        ></el-date-picker>
      </div>
      <div class="butBox">
        <el-button type="primary" @click="search" plain>查询</el-button>
      </div>
    </div>
    <el-table :data="mainList" border style="width: 100%;margin-bottom: 60px;">
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        v-for="colum in columns"
        :key="colum.prop"
        :label="colum.label"
        :prop="colum.prop"
        :name="colum.label"
        :formatter="colum.formatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column width="350px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="replayDetail(scope.row.doctorId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详情" :visible.sync="showDialog">
      <div class="followupListbox" v-for="(item, index) in detailList" :key="index">
        <div class="titlebox">
          <h3 @click="followupTable(index)">
            {{item.groupName}}
            <i v-if="followupIndex == index " class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </h3>
        </div>
        <el-table
          v-if="followupIndex == index"
          :data="item.groupDetailList"
          border
          style="width: 100%"
        >
          <el-table-column prop="flupPlan" label="随访计划" show-overflow-tooltip></el-table-column>
          <el-table-column prop="total" label="随访任务总数" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="autoTotal" label="自动随访" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phoneTotal" label="电话随访" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const invalidVal = ['', undefined, null]
import DeptList from '@/mixins/deptList'

export default {
  mixins: [DeptList],
  data() {
    return {
      deptId: '',
      groupId: '',
      searchKey: '',
      searchValue: '',
      keyword: 'doctorName',
      keyValue: '',
      date: [],
      deptOptions: [],
      flupGroups: [],

      searchKeyList: [
        { key: 'doctorName', value: '医护姓名' },
        { key: 'phone', value: '医护电话号码' },
      ],
      columns: [
        {
          prop: 'doctorName',
          label: '医护姓名',
          formatter: (row) => {
            return this.$utils.shield(row.doctorName, 1)
          },
        },
        { prop: 'deptName', label: '科室' },
        { prop: 'groupName', label: '随访组' },
        {
          prop: 'phone',
          label: '医护电话号码',
          formatter: (row) => {
            return this.$utils.shield(row.phone, 2)
          },
        },
        { prop: 'total', label: '随访任务总数' },
        { prop: 'autoTotal', label: '自动随访' },
        { prop: 'phoneTotal', label: '电话随访' },
      ],
      mainList: [],
      detailList: [],
      followupIndex: null,
      pageNo: 1,
      pageSize: 10,
      showDialog: false,
    }
  },
  created() {
    this.getNewDeptList()
    this.search()
  },
  methods: {
    setDeptId() {
      this.groupId = null
      this.flupGroups = []
      if (this.deptId) {
        this.getFlupGroups()
      }
    },
    getFlupGroups() {
      this.$apis
        .groupgetFlupGroupList({
          hospitalId: this.$global.hospital_id,
          dept: this.deptId,
          pageNo: 1,
          pageSize: 10,
        })
        .then((res) => {
          this.flupGroups = res.list
        })
      this.search()
    },

    search() {
      this.$apis.getFlupPerformStatistics(this.createQuery()).then((res) => {
        this.mainList = res.list
      })
    },
    replayDetail(val) {
      this.$apis
        .getFlupPerformStatisticsDetail({
          ...this.createQuery(),
          doctorId: val,
        })
        .then((res) => {
          this.detailList = res
          this.showDialog = true
        })
    },
    createQuery() {
      return {
        pageNo: this.pageNo,
        pageSize: 1000,
        keyword: this.keyword,
        keyValue: this.keyValue,
        hospitalId: this.$global.hospital_id,
        deptCode: this.deptId,
        groupCode: this.groupId,
        recordTime: this.date ? this.date.join(',') : '',
      }
    },
    followupTable(index) {
      if (this.followupIndex == index) {
        this.followupIndex = null
      } else {
        this.followupIndex = index
      }
    },
  },
}
</script>
<style lang="scss">
.flupPerform_statis {
  padding: 0px 20px 20px 20px;
  .titlebox {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
  }
}
</style>
