<template>
  <div class="sendRecord">
    <div>
      <div class="sxk">
        <div class="queryconditions1">
          <span style="margin-right: 10px;">发送时间</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-select
            class="margin-left10 width110px select-time-key"
            v-model="questionnaireType"
            @change="getoptions"
            clearable
          >
            <el-option label="健康宣教" value="健康宣教"></el-option>
            <el-option label="调查问卷" value="调查问卷"></el-option>
            <el-option label="短信随访" value="短信随访"></el-option>
          </el-select>
          <el-select
            :disabled="questionnaireType?false:true"
            class="select-time-val"
            v-model="questionnaireId"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.serialNo"
              :label="item.questionnaireName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
          <el-input
            style=" width: 300px; margin-left: 20px;"
            placeholder="请输入内容"
            v-model="keyValue"
            class="input-with-select limiting"
            maxlength="20"
            show-word-limit
          >
            <el-select style=" width: 100px;" v-model="keyword" slot="prepend" placeholder="请选择">
              <el-option label="姓名" value="patientName"></el-option>
              <el-option label="病案号" value="patientId"></el-option>
              <el-option label="电话" value="phone"></el-option>
            </el-select>
          </el-input>
          <el-button class="margin-left10" type="primary" plain @click="Inquire">查询</el-button>
          <el-button type="primary" @click="exportFile">导出</el-button>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100% ;margin-bottom: 60px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="targetUserName" label="姓名"></el-table-column>
      <el-table-column prop="patientId" label="病案号"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="sendTime" label="发送时间" width="200"></el-table-column>
      <el-table-column prop="sendType" label="发送类型"></el-table-column>
      <el-table-column prop="questionnaireName" label="发送标题"></el-table-column>
      <el-table-column prop="senderName" label="发送人"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <p style="color:#0066ff" v-if="scope.row.status">已读</p>
          <p style="color:#ff0000" v-else>未读</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            :disabled="!scope.row.status||!scope.row.sendDetailUrl"
            @click="detailPage(scope.row)"
            type="text"
            size="small"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page.sync="pageNo"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionnaireType: '调查问卷',
      time: null,
      options: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      keyword: 'patientName',
      keyValue: null,
      sendTimeStart: null,
      sendTimeEnd: null,
      questionnaireId: null,
    }
  },
  async created() {
    if (this.$route.query.flupType) {
      if (this.$route.query.flupType == 'JKXJ') {
        this.questionnaireType = '健康宣教'
      } else {
        this.questionnaireType = '调查问卷'
      }
    }
    await this.getoptions()
    if (this.$route.query.serialNo) {
      this.questionnaireId = this.$route.query.serialNo
    }
    await this.getlist()
  },
  computed: {},
  watch: {},
  methods: {
    detailPage(row) {
      this.$confirm('此操作将打开新界面查看详情, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          var urlx
          if (location.pathname) {
            urlx = location.origin + location.pathname
          } else {
            urlx = location.origin + '/pc'
          }
          console.log(
            urlx + '/#/preview?src=' + encodeURIComponent(row.sendDetailUrl)
          )
          window.parent.postMessage(
            JSON.stringify({
              method: 'addTab',
              url:
                urlx +
                '/#/preview?src=' +
                encodeURIComponent(row.sendDetailUrl),
              title: `查看`,
            }),
            '*'
          )
        })
        .catch(() => {})
    },
    Inquire() {
      if (this.time) {
        this.sendTimeStart = this.time[0]
        this.sendTimeEnd = this.time[1]
      } else {
        this.sendTimeStart = null
        this.sendTimeEnd = null
      }
      this.pageNo = 1
      this.getlist()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getlist()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getlist()
    },
    getlist() {
      this.$apis
        .querySendDetailList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyword: this.keyword,
          keyValue: this.keyValue,
          hospitalId: this.$global.hospital_id,
          sendTimeStart: this.sendTimeStart,
          sendTimeEnd: this.sendTimeEnd,
          questionnaireId: this.questionnaireId,
          questionnaireType: this.questionnaireType,
        })
        .then((res) => {
          this.total = res.total
          this.tableData = res.list
        })
    },
    getoptions() {
      this.questionnaireId = null
      this.options = []
      this.$apis
        .flupPathqueryFollowUpContent({
          name: this.questionnaireType,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.options = res
        })
    },
    exportFile() {
      let query = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        keyword: this.keyword,
        keyValue: this.keyValue,
        hospitalId: this.$global.hospital_id,
        sendTimeStart: this.sendTimeStart,
        sendTimeEnd: this.sendTimeEnd,
        questionnaireId: this.questionnaireId,
        questionnaireType: this.questionnaireType,
      }
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/template/exportSendDetailExport?' +
        this.$qs.stringify({
          ...query,
        })
    },
  },
}
</script>

<style lang="scss">
.sendRecord {
  padding: 0 20px;
  .sxk {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f8f8f8;
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
  .queryconditions1 {
    display: flex;
    align-items: center;

    p {
      width: 80px;
      margin: 0 0 0 20px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
    }
  }
  .recordbox {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
}
</style>