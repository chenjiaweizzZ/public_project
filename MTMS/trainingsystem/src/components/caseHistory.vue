<template>
  <div class="caseHistory" v-if="showCaseHistory">
    <el-dialog title="成绩变更记录" :visible.sync="showCaseHistory" @close="closeCaseHistory">
      <el-table :data="caseHistoryData" border>
        <el-table-column property="score" label="成绩" width="150"></el-table-column>
        <el-table-column property="createBy" label="变更人" width="150"></el-table-column>
        <el-table-column property="submitScoreTime" label="变更时间"></el-table-column>
        <el-table-column property="changeType" label="变更方式" width="100"></el-table-column>
        <el-table-column property="" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)" v-if="scope.row.changeType != '手动录入'">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="caseHandleSizeChange" @current-change="caseHandleCurrentChange" :current-page="casePageNum"
        :page-sizes="[10, 20, 30, 40]" :page-size="casePagesize" layout="total, sizes, prev, pager, next, jumper" :total="caseTotal"
        class="caseHistoryPagin">
      </el-pagination>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="showDetail" class="detailDailog">
      <p class="marginBott15">
        <span>{{detailTips}}</span>
        <span v-if="scoreDetail.length > 0">{{scoreDetail[0].avgScore}}</span>
      </p>
      <el-table :data="scoreDetail" v-if="detail.scoreType != 4" border>
        <el-table-column property="examItemName" label="考核项目" width="200" fixed></el-table-column>
        <el-table-column property="score" label="平均成绩" width="200"></el-table-column>
        <el-table-column :label="item" v-for="(item,index) in scoreDetail[0].scoreList" property="scoreList">
          <span slot="header">考官-{{item.name}}</span>
          <template slot-scope="scope">
            <span>{{scope.row.scoreList[index].score}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="scoreDetail" v-else>
        <el-table-column property="examItemName" label="病历文件名称" width="200" fixed></el-table-column>
        <el-table-column property="score" label="成绩" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.score == null || scope.row.score == "" ? '待评分' : scope.row.score}}</span>
          </template>
        </el-table-column>
        <el-table-column property="submitTime" label="评分时间"></el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="caseHistoryPagin">
      </el-pagination>
    </el-dialog>
  </div>
</template>
<script>
  import { post, get, getCookie } from '../config/util'
  export default {
    data() {
      return {
        caseHistoryData: [
          { name: "测试数据", type: 1 }
        ],
        scoreDetail: [{ avgScore: 0 }],
        title: "详情",
        detailTips: "",
        detail: {},
        showDetail: false,
        pageSize: 10,
        pageNum: 1,
        total: 0,
        casePageSize: 10,
        casePageNum: 1,
        caseTotal: 0
      }
    },
    props: {
      currentRow: {
        type: Object,
        default: {}
      },
      showCaseHistory: {
        type: Boolean,
        default: false
      },
      scoreType: {
        type: Number,
        default: false
      }
    },
    watch: {
      showCaseHistory: {
        handler(newVal) {
          if (newVal) {
            this.casePageNum = 1
            this.casePageSize = 10
            this.getCaseHistoryList()
          }
        }
      }
    },
    created() {
      this.getCaseHistoryList()
    },
    methods: {
      closeCaseHistory() {
        this.$emit('closeHistory', false)
      },
      getCaseHistoryList() {
        get(`/base/turnscorehistory/list?turnScoreId=${this.currentRow.turnscoreid}&scoreType=${this.scoreType}&pageSize=${this.casePageSize}&pageNum=${this.casePageNum}`).then(res => {
          if (res && res.resCode == 200) {
            this.caseTotal = res.total;
            this.caseHistoryData = res.rows
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.queryScoreList(this.detail)
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.queryScoreList(this.detail)
      },
      caseHandleSizeChange(val) {
        this.casePageSize = val
        this.getCaseHistoryList()
      },
      caseHandleCurrentChange(val) {
        this.casePageNum = val
        this.getCaseHistoryList()
      },
      renderHeader(h, { column, $index }) {
        return (
          <span>考官-{column.label.name}</span>
        )
      },
      queryScoreList(row) {
        let params = `turnScoreId=${row.turnScoreId}&turnScoreDetailId=${row.turnScoreDetailId}&turnExamId=${row.turnExamId}&examId=${row.examId}&stuId=${row.stuId}&scoreType=${row.scoreType}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`
        get(`/base/turnExamInfo/queryScoreList?${params}`).then(res => {
          if (res && res.resCode == 200) {
            // 大病历
            if (res.rows.length > 0) {
              this.scoreDetail = res.rows
              this.total = res.total
              this.showDetail = true
            } else {
              this.$message({
                type: "warning",
                message: "请求成绩详情失败！"
              })
            }
          } else {
            this.$message({
              type: "warning",
              message: "请求成绩详情失败！"
            })
          }
        })
      },
      checkDetail(row) {
        this.detail = row
        // 1、技能成绩 2、综合成绩 3、理论成绩  4、大病历成绩
        if (row.scoreType == 1) {
          this.title = "技能考核详情"
          this.detailTips = "技能平均成绩"
        } else if (row.scoreType == 2) {
          this.title = "综合考核详情"
          this.detailTips = "综合平均成绩"
        } else if (row.scoreType == 3) {
          this.title = "理论考核详情"
          this.detailTips = "理论平均成绩"
        } else if (row.scoreType == 4) {
          this.detailTips = "病历书写平均成绩"
        }
        this.queryScoreList(this.detail)
      },
    }
  }

</script>
<style>
  .caseHistoryPagin {
    margin-top: 20px;
  }

  .detailDailog .el-dialog {
    width: 70%;
  }

  .marginBott15 {
    margin-bottom: 15px;
    font-size: 14px;
  }
</style>