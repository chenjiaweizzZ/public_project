<template>
  <div class="processingRecords">
    <div>
      <div class="queryConditionsBox">
        <div class="queryConditions">
          <p>来电号码</p>
          <el-input class="limiting" v-model="calledPhone" maxlength="20" show-word-limit></el-input>
        </div>
        <div class="queryConditions">
          <div style="display: flex;align-items: center;">
            <el-select class="margin-left10 width110px select-time-key" v-model="timeKey">
              <el-option
                v-for="item in timeList"
                :key="item.label"
                :value="item.value"
                :label="item.label"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
            <el-date-picker
              clearable
              class="select-time-val"
              type="daterange"
              v-model="dateList"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
            ></el-date-picker>
          </div>
        </div>
        <div v-if="hidden" class="queryConditions">
          <p>问题分类</p>
          <el-select v-model="problemType" placeholder="请选择" clearable>
            <el-option
              v-for="item in problemList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </div>
        <div v-if="hidden" class="queryConditions">
          <p>紧急程度</p>
          <el-select v-model="urgencyType" placeholder="请选择" clearable>
            <el-option
              v-for="item in urgencyList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </div>
        <div v-if="hidden" class="queryConditions">
          <p>涉及科室</p>
          <el-select v-model="involveDeptId" placeholder="请选择" clearable>
            <el-option
              v-for="item in newDeptOptions"
              :key="item.serialNo"
              :label="item.deptName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </div>
        <div class="butBox">
          <el-button
            style="width:80px"
            class="margin-left10"
            v-if="!hidden"
            type="text"
            @click="showOrHide"
          >高级查询</el-button>
          <el-button
            style="width:80px"
            class="margin-left10"
            v-else
            type="text"
            @click="showOrHide"
          >收起</el-button>
          <el-button class="margin-left10" type="primary" @click="Inquire" plain>查询</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%;margin-bottom:60px">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="calledTime" label="来电时间"></el-table-column>
        <el-table-column prop="processTime" label="处理时间"></el-table-column>
        <el-table-column prop="calledPhone" label="来电号码">
          <template slot-scope="scope">{{ scope.row.calledPhone | hideInfo("phone") }}</template>
        </el-table-column>
        <el-table-column prop="urgencyName" label="紧急程度"></el-table-column>
        <el-table-column prop="problemName" label="问题分类"></el-table-column>
        <el-table-column prop="involveDeptName" label="涉及科室"></el-table-column>
        <el-table-column prop="involveDoctorName" label="涉及医生"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="push(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page.sync="pageNo"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
// import DeptList from '@/mixins/deptList'
export default {
  // mixins: [DeptList],
  data() {
    return {
      calledPhone: null,
      timeKey: 'process',
      startDate: null,
      endDate: null,
      problemType: null,
      urgencyType: null,
      involveDeptId: null,
      hidden: false,
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      tableData: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      timeList: [
        {
          label: '处理时间',
          value: 'process',
        },
        {
          label: '来电时间',
          value: 'called',
        },
      ],
      dateList: null,
      problemList: [],
      urgencyList: [],
      newDeptOptions: [],
    }
  },
  created() {
    // this.getAllNewDept()
    this.$apis.systemManagequeryCurrentUserDept({}).then((res) => {
      this.newDeptOptions = res
    })
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'CallCenter',
        parentDictCode: 'problem_type',
      })
      .then((res) => {
        this.problemList = res
      })
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'CallCenter',
        parentDictCode: 'urgency_type',
      })
      .then((res) => {
        this.urgencyList = res
      })
    this.getgetFeedbackRecord()
  },
  computed: {},
  watch: {},
  methods: {
    Inquire() {
      this.pageNo = 1
      if (this.dateList) {
        this.startDate = this.dateList[0]
        this.endDate = this.dateList[1]
      } else {
        this.startDate = null
        this.endDate = null
      }
      this.getgetFeedbackRecord()
    },
    getgetFeedbackRecord() {
      this.$apis
        .getFeedbackRecord({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          calledPhone: this.calledPhone,
          timeKey: this.timeKey,
          startDate: this.startDate,
          endDate: this.endDate,
          problemType: this.problemType,
          urgencyType: this.urgencyType,
          involveDeptId: this.involveDeptId,
        })
        .then((res) => {
          this.total = res.total
          this.tableData = res.list
        })
    },
    showOrHide() {
      this.hidden = !this.hidden
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getgetFeedbackRecord()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getgetFeedbackRecord()
    },
    push(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: urlx + '/#/processingDetails?id=' + row.id,
            title: '处理详情',
          }),
          '*'
        )
      } else {
        window.open(urlx + '/#/processingDetails?id=' + row.id)
      }
    },
  },
}
</script>

<style lang="scss">
.processingRecords {
  padding: 0 20px;
  .queryConditionsBox {
    padding: 10px 0;
    margin-bottom: 10px;
    background-color: #f8f8f8;
    zoom: 1;
    .queryConditions {
      margin: 10px 20px;
      display: inline-block;
      p {
        display: inline-block;
        margin-right: 10px;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
      }
      > .el-input {
        width: 260px;
        .el-input-group__append,
        .el-input-group__prepend {
          background-color: #fff;
        }
      }
    }
    .butBox {
      margin: 10px 20px;
      float: right;
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
  }
  .queryConditionsBox:after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
    visibility: hidden;
  }
}
</style>