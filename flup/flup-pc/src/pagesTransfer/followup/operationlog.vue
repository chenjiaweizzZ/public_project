//操作日志
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <div class="conditionbox">
        <p>操作时间</p>&emsp;
        <el-date-picker
          v-model="time"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="cx"
        ></el-date-picker>&emsp;&emsp;
        <el-input
          placeholder="请输入业务名称"
          v-model="conditionObj.businessName"
          class="input-with-select limiting"
          maxlength="20"
          show-word-limit
        >
          <el-button slot="append" icon="el-icon-search" @click="cx"></el-button>
        </el-input>
        <el-popover v-model="fatr" placement="bottom" width="335" trigger="click">
          <el-form ref="conditionObj" :model="conditionObj" label-width="80px">
            <el-form-item label="操作类型">
              <el-select v-model="conditionObj.operationType" placeholder="请选择活动区域">
                <el-option
                  v-for="(item, index) in operationList"
                  :key="index"
                  :label="item.Text"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务名称">
              <el-input
                v-model="conditionObj.businessName"
                class="input-with-select limiting"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="conditionObj.remark"
                class="input-with-select limiting"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="操作人">
              <el-input
                v-model="conditionObj.createUserName"
                class="input-with-select limiting"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <div style="text-align: right;">
              <el-button @click="fatr=false">取消</el-button>
              <el-button type="info" @click="deletex" plain>清空</el-button>
              <el-button type="primary" @click="ss" plain>确认</el-button>
            </div>
          </el-form>
          <el-button style="margin-right:20px" type="info" slot="reference" plain>高级查询</el-button>
        </el-popover>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="businessName" label="业务名称"></el-table-column>
      <el-table-column prop="operationType" label="操作类型">
        <template
          slot-scope="scope"
        >{{$utils.getDeptNameByQu(scope.row.operationType,operationList)}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="createLoginId" label="操作人登录名"></el-table-column>
      <el-table-column prop="createUserName" label="操作人"></el-table-column>
      <el-table-column prop="createTime" label="操作时间" width="200"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="xq(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="conditionObj.pageNo"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog
      title="操作日志详情"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <div class="mainbox">
        <p>
          <span class="title">业务名称</span>
          <span class="main">{{mian.businessName}}</span>
        </p>
        <p>
          <span class="title">操作类型</span>
          <span class="main">{{$utils.getDeptNameByQu(mian.operationType,operationList) }}</span>
        </p>
        <p>
          <span class="title">病人user_id</span>
          <span class="main">{{mian.patientUserId}}</span>
        </p>
        <p>
          <span class="title">病人名字</span>
          <span class="main">{{mian.patientName}}</span>
        </p>
        <p>
          <span class="title">操作人登录名</span>
          <span class="main">{{mian.createLoginId}}</span>
        </p>
        <p>
          <span class="title">操作人</span>
          <span class="main">{{mian.createUserName}}</span>
        </p>
        <p>
          <span class="title">操作时间</span>
          <span class="main">{{mian.createTime}}</span>
        </p>
        <p>
          <span class="title">备注</span>
          <span class="main">{{mian.remark}}</span>
        </p>
      </div>
      <h2 class="titlexg">
        修改详情
        <span>(新值为null则不会更新该值)</span>
      </h2>
      <el-table :data="vallist" border style="width: 100%" stripe>
        <el-table-column prop="text" label="字段"></el-table-column>
        <el-table-column prop="old" label="旧值"></el-table-column>
        <el-table-column prop="new" label="新值"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      fatr: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      time: [],
      conditionObj: {
        businessName: null,
        operationType: null,
        remark: null,
        createUserName: null,
        startDate: null,
        endDate: null,
        pageNo: 1,
        pageSize: 10,
        businessId: null,
      },
      operationList: [
        {
          Text: '全部',
          Value: null,
        },
        {
          Text: '增加',
          Value: 1,
        },
        {
          Text: '修改',
          Value: 2,
        },
        {
          Text: '删除',
          Value: 3,
        },
        {
          Text: '查询',
          Value: 4,
        },
        {
          Text: '其他',
          Value: 5,
        },
      ],
      mian: {
        businessName: null,
        operationType: null,
        patientUserId: null,
        patientName: null,
        createLoginId: null,
        createUserName: null,
        createTime: null,
        remark: null,
      },
      vallist: [],
      hospitalId: null,
      tableData: [],
      total: 0,
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    if (this.$route.query) {
      this.conditionObj.businessName = this.$route.query.businessName
      this.conditionObj.businessId = this.$route.query.serialNo
    }
    console.log(this.$route.query)
    this.getsystemManagequeryOperationLogList()
  },
  methods: {
    deletex() {
      this.conditionObj.businessName = null
      this.conditionObj.operationType = null
      this.conditionObj.remark = null
      this.conditionObj.createUserName = null
      this.conditionObj.startDate = null
      this.conditionObj.endDate = null
      this.time = []
    },
    xq(row) {
      this.vallist = []
      this.dialogVisible = true
      this.mian.businessName = row.businessName
      this.mian.operationType = row.operationType
      this.mian.patientUserId = row.patientUserId
      this.mian.patientName = row.patientName
      this.mian.createLoginId = row.createLoginId
      this.mian.createUserName = row.createUserName
      this.mian.createTime = row.createTime
      this.mian.remark = row.remark
      let newData = JSON.parse(row.newData)
      let oldData = JSON.parse(row.oldData)
      let arr = []
      for (let i in newData) {
        for (let j in oldData) {
          let a = {
            new: null,
            old: null,
            text: null,
          }
          if (i == j) {
            a.text = i
            a.new = newData[i]
            a.old = oldData[j]
            this.vallist.push(a)
          }
        }
      }
    },
    cx() {
      // this.conditionObj.pageNo = 1
      // this.getsystemManagequeryOperationLogList()
      this.ss()
    },
    getsystemManagequeryOperationLogList() {
      this.$apis
        .systemManagequeryOperationLogList({
          ...this.conditionObj,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
        })
    },
    ss() {
      this.conditionObj.pageNo = 1
      if (this.time && this.time.length != 0) {
        this.conditionObj.startDate = this.time[0]
        this.conditionObj.endDate = this.time[1]
      } else {
        this.conditionObj.startDate = null
        this.conditionObj.endDate = null
      }
      this.getsystemManagequeryOperationLogList()
    },
    handleSizeChange(val) {
      this.conditionObj.pageSize = val
      this.conditionObj.pageNo = 1
      this.getsystemManagequeryOperationLogList()
    },
    handleCurrentChange(val) {
      this.conditionObj.pageNo = val
      this.getsystemManagequeryOperationLogList()
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .conditionbox {
    // width: 100%;
    // height: 50px;
    // padding: 15px;
    // margin-bottom: 15px;
    background-color: #f8f8f8;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-input {
      width: 200px;
    }
    .el-button {
      margin: 0 5px;
    }
    > .el-input {
      width: 300px;
      .el-button {
        margin: -10px -20px;
      }
    }
  }
  .mainbox {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    p {
      width: 50%;
      line-height: 30px;
      .title {
        width: 120px;
        font-weight: 600;
        text-align: right;
        display: inline-block;
        color: #888;
      }
      .main {
        padding-left: 10px;
        display: inline-block;
        color: #666;
      }
    }
  }
  .titlexg {
    padding: 20px;
    color: #888;
    border-bottom: 1px solid #ccc;
    span {
      font-size: 13px;
      color: #555;
    }
  }
}
</style>