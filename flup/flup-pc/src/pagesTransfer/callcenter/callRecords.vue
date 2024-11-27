<template>
  <div class="callRecords">
    <div>
      <div class="queryConditionsBox">
        <div class="queryConditions">
          <el-input
            style="width: 320px"
            placeholder="请输入内容"
            v-model="phoneValue"
            class="input-with-select limiting"
            maxlength="20"
            show-word-limit
            clearable
          >
            <el-select style="width: 100px" v-model="phoneType" slot="prepend" placeholder="请选择">
              <el-option label="主叫号码" value="src"></el-option>
              <el-option label="被叫号码" value="dst"></el-option>
            </el-select>
          </el-input>
        </div>
        <div class="queryConditions">
          <span style="margin-right: 10px">应答时间</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div v-if="hidden" class="queryConditions">
          <p>呼入/呼出</p>
          <el-select v-model="callType" placeholder="请选择" clearable>
            <el-option label="来电" value="1"></el-option>
            <el-option label="去电" value="2"></el-option>
          </el-select>
        </div>
        <div v-if="hidden" class="queryConditions">
          <p>接听情况</p>
          <el-select v-model="callStatus" placeholder="请选择" clearable>
            <el-option label="未接听" value="0"></el-option>
            <el-option label="接听" value="1"></el-option>
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
          <el-button class="margin-left10" type="primary" plain @click="Inquire">查询</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%; margin-bottom: 60px">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="src" label="主叫号码" width="130">
          <template slot-scope="scope">{{ scope.row.src | hideInfo("phone") }}</template>
        </el-table-column>
        <el-table-column prop="dst" label="被叫号码" width="130">
          <template slot-scope="scope">{{ scope.row.dst | hideInfo("phone") }}</template>
        </el-table-column>
        <el-table-column prop="calldate" label="应答时间" min-width="170"></el-table-column>
        <el-table-column prop="callagent" label="工号" width="80"></el-table-column>
        <el-table-column prop="calltype" label="呼入/呼出" width="90">
          <template slot-scope="scope">
            {{
            scope.row.calltype == 1 ? "来电" : "去电"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="callstatus" label="接听情况" width="80">
          <template slot-scope="scope">
            {{
            scope.row.callstatus == 0 ? "未接听" : "接听"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="billsecs" label="通话时长" width="110"></el-table-column>
        <el-table-column prop="recordname" label="录音文件" min-width="460">
          <template slot-scope="scope">
            <div
              @click="play(scope.row.recordname)"
              style="display: flex; align-items: center"
              v-if="scope.row.recordname"
            >
              <img
                style="width: 20px; height: 20px; margin-right: 10px"
                src="~@/assets/images/bf.png"
                alt
              />
              {{ scope.row.recordname }}
            </div>
            <div v-else>无</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="录音播放"
      :visible.sync="dialogTableVisible"
      width="380px"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <div class="recordbox">
        <span>录音</span>
        <audio v-if="recordUrl" controls="controls">
          <source :src="recordUrl" type="audio/Wav" />
          <embed height="100" width="100" :src="recordUrl" />
        </audio>
      </div>
    </el-dialog>
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
      dialogTableVisible: false,
      phoneType: 'src',
      phoneValue: null,
      callType: null,
      callStatus: null,
      startDate: null,
      endDate: null,
      hidden: false,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      time: null,
      tableData: [],
      recordUrl: null,
    }
  },
  created() {
    this.getgetCallRecord()
  },
  computed: {},
  watch: {},
  methods: {
    play(row) {
      this.recordUrl = null
      // if (row) {
      //   this.$nextTick(() => {
      //     this.dialogTableVisible = true
      //     this.recordUrl =
      //       this.$baseURL.ICDMApiUrl +
      //       '/b/callCenter/getFtpRecordUrl?recordName=' +
      //       row
      //   })
      // }
      this.$apis
        .getRecordUrl({
          recordName: row,
        })
        .then((res) => {
          this.$nextTick(() => {
            this.dialogTableVisible = true
            this.recordUrl = res
          })
        })
    },
    Inquire() {
      this.pageNo = 1
      if (this.time) {
        this.startDate = this.time[0]
        this.endDate = this.time[1]
      } else {
        this.startDate = null
        this.endDate = null
      }
      this.getgetCallRecord()
    },
    getgetCallRecord() {
      this.$apis
        .getCallRecord({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          phoneType: this.phoneType,
          phoneValue: this.phoneValue,
          startDate: this.startDate,
          endDate: this.endDate,
          callType: this.callType,
          callStatus: this.callStatus,
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
      this.getgetCallRecord()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getgetCallRecord()
    },
  },
}
</script>

<style lang="scss">
.callRecords {
  padding: 0 20px;
  .recordbox {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
}
</style>