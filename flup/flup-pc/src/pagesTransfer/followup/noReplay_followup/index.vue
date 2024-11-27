<template>
  <div class="marginX20">
    <div class="queryConditionsBox">
      <div class="butBox">
        <!-- <el-checkbox
          style="margin-right:20px"
          true-label="1"
          false-label
          v-model="iaAllReply"
          @change="getReplyConditionList"
        >未全部回收</el-checkbox>-->

        <el-input
          class="width380px value limiting"
          v-model="searchValue"
          placeholder="请输入关键字"
          maxlength="20"
          show-word-limit
        >
          <el-select class="width110px" v-model="searchKey" slot="prepend">
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getReplyConditionList"></el-button>
        </el-input>
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
          <el-button type="text" @click="replayDetail(scope.row.recordSerialNo)">任务详情</el-button>
          <el-button type="text" @click="sendQuestion(scope.row,1)">发送问卷</el-button>
          <el-button type="text" @click="sendQuestion(scope.row,2)">发送宣教</el-button>
          <el-button type="text" @click="phoneFollowup(scope.row.patientName)">电话随访</el-button>
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
    <el-dialog title="任务详情" :visible.sync="showDialog">
      <div class="followupListbox" v-for="(item, index) in followupList" :key="index">
        <div class="titlebox">
          <h3 @click="followupTable(index)">
            {{item.flupPlan}}
            <i v-if="followupIndex == index " class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </h3>
        </div>
        <el-table v-if="followupIndex == index" :data="item.list" border style="width: 100%">
          <el-table-column prop="flupType" label="随访类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="flupStartTime" label="任务开始时间" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="随访状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="replyCondition" label="完成情况" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import template from '../../questionaire/preview/template.vue'
export default {
  components: { template },
  data() {
    return {
      searchValue: '',
      searchKey: 'patientName',
      iaAllReply: '',
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '身份证号', value: 'idNo' },
        { label: '电话', value: 'phone' },
      ],
      columns: [
        {
          prop: 'patientName',
          label: '姓名',
          formatter: (row) => {
            return this.$utils.shield(row.patientName, 1)
          },
        },
        { prop: 'sex', label: '性别' },
        { prop: 'age', label: '年龄' },
        {
          prop: 'phone',
          label: '电话',
          formatter: (row) => {
            return this.$utils.shield(row.phone, 2)
          },
        },
        {
          prop: 'idNo',
          label: '身份证',
          formatter: (row) => {
            return this.$utils.shield(row.idNo, 3)
          },
        },
        { prop: 'flupPlan', label: '随访计划' },
        { prop: 'reply', label: '已完成' },
        { prop: 'unReply', label: '未完成' },
      ],
      mainList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      showDialog: false,
      followupIndex: null,
      followupList: [],
      urlx: '',
    }
  },
  created() {
    if (location.pathname) {
      this.urlx = location.origin + location.pathname
    } else {
      this.urlx = location.origin + '/pc'
    }
    this.getReplyConditionList()
  },
  methods: {
    onSearch() {},
    getReplyConditionList() {
      this.$apis
        .getReplyConditionList({
          searchKey: this.searchKey,
          searchValue: this.searchValue,
          iaAllReply: this.iaAllReply,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
    },
    replayDetail(serialNo) {
      this.$apis
        .getReplyConditionDetail({ recordSerialNo: serialNo })
        .then((res) => {
          this.followupList = res
          this.showDialog = true
        })
    },
    followupTable(index) {
      if (this.followupIndex == index) {
        this.followupIndex = null
      } else {
        this.followupIndex = index
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getReplyConditionList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getReplyConditionList()
    },
    sendQuestion(row, type) {
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            this.urlx +
            '/#/newsendV2/' +
            (type == 1 ? 'WJDC' : 'JKXJ') +
            `?showSendView=true&idNo=${row.idNo}&openId=${row.openId}&patientName=${row.patientName}&serialNo=${row.recordSerialNo}&patientTypeCode=${row.patientTypeCode}&phone=${row.phone}&userId=${row.userId}`,
          title: type == 1 ? '发送问卷' : '发送宣教',
        }),
        '*'
      )
    },
    phoneFollowup(patientName) {
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: this.urlx + '/#/newphonefollowup?patientName=' + patientName,
          title: '电话随访',
        }),
        '*'
      )
    },
  },
}
</script>
<style lang="scss">
.followupListbox {
  padding: 20px 10px;
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
