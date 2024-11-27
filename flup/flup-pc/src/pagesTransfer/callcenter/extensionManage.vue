<template>
  <div class="manager">
    <operationHeader class="margin-bottom20">
      <div class="search1">搜索</div>
      <el-input
        class="width200px value limiting"
        style="width: 299px"
        v-model="keyword"
        placeholder="请输入分机号码"
        @keyup.enter.native="onSearchkey"
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="onSearchkey"></el-button>
      </el-input>
      <template v-slot:right>
        <el-button
          class="margin-left50"
          type="info"
          icon="el-icon-refresh"
          @click="getsyncdevices"
        >同步</el-button>
      </template>
    </operationHeader>
    <el-table
      style="marght-bottom:60px"
      class="margin-top20"
      :data="mainList"
      highlight-current-row
      border
      stripe
    >
      <el-table-column type="index" width="80px" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in columnList"
        :key="item.value"
        :label="item.key"
      >
        <template slot-scope="scope">{{ scope.row[item.value] }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="mainList.length"
      class="page-custom pageBottom"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyword: '',
      pageIndex: 1,
      pageSize: 10,
      columnList: [
        { value: 'desplayName', key: '显示名称' },
        { value: 'id', key: '分机号码' },
        { value: 'password', key: '密码' },
        { value: 'ip', key: 'ip地址' },
      ],
      mainList: [],
      total: 0,
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    getsyncdevices() {
      this.$apis.syncIpccDevices().then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          this.pageIndex = 1
          this.onSearch()
        }
      })
    },
    onSearchkey() {
      this.pageIndex = 1
      this.onSearch()
    },
    onSearch() {
      this.$apis
        .getIpccAllDevices({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          name: this.keyword,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.onSearch()
    },
  },
}
</script>

<style scoped>
.manager {
  padding: 0px 20px 20px 20px;
}
.search1 {
  width: 30px;
  margin-right: 14px;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: rgb(51, 51, 51);
  letter-spacing: 0px;
  text-align: right;
}
</style>