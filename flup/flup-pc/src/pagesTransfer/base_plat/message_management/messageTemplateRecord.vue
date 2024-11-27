<template>
  <section class="device-manager">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>发送时间</p>
        <el-date-picker
          class="select-time-val"
          type="daterange"
          v-model="date"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          clearable
        ></el-date-picker>
      </div>
      <div class="queryConditions">
        <p>搜索</p>
        <el-input
          placeholder="请输入"
          v-model="searchValue"
          class="input-with-select limiting"
          maxlength="20"
          show-word-limit
        >
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </div>
      <div style="display: flex;align-items: center;" class="butBox"></div>
    </div>

    <el-table
      style="margin-bottom:60px"
      ref="table"
      class="margin-top20"
      :data="mainList"
      border
      stripe
    >
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip width="90" prop="flupType" label="消息类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="channel" label="消息渠道" :formatter="formatChannel"></el-table-column>
      <el-table-column show-overflow-tooltip prop="msContent" label="消息内容"></el-table-column>
      <el-table-column show-overflow-tooltip prop="patientName" label="发送对象"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="手机号码"></el-table-column>
      <el-table-column show-overflow-tooltip prop="sendDatetime" label="发送时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="sendState" label="状态" :formatter="formatState"></el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
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
  </section>
</template>

<script>
import Pagination from '@/mixins/pagination'
export default {
  mixins: [Pagination],
  data() {
    return {
      date: [],
      searchValue: '',
      mainList: [],

      channelList: [{ value: 0, label: '短信' }],
      sendStateList: [
        { value: 0, label: '未发送' },
        { value: 1, label: '已发送' },
        { value: 2, label: '发送失败' },
      ],
      pageNo: 1,
      pageSize: 10,
    }
  },
  async created() {
    this.getMainList()
  },

  methods: {
    onSearch() {
      this.pageNo = 1
      this.getMainList()
    },
    getMainList() {
      !Array.isArray(this.date) && (this.date = [])
      this.$apis
        .getMessageRecordList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchValue: this.searchValue,
          date: this.date.join(','),
        })
        .then((res) => {
          this.mainList = res.list || []
          this.total = res.total
        })
    },

    formatChannel(row) {
      return this.channelList.find((x) => x.value == row.channel).label
    },
    formatState(row) {
      return this.sendStateList.find((x) => x.value == row.sendState).label
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1
      this.pageSize = pageSize
      this.getMainList()
    },
    handleCurrentChange(pageNo) {
      // this.pageNo = this.pageNo
      this.getMainList()
    },
  },
}
</script>


