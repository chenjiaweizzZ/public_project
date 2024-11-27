<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <el-button type="danger" @click="deleteall" plain>删除全部</el-button>
      <template v-slot:right>
        <p style="width:50px">搜索</p>
        <el-input
          placeholder="请输入key"
          v-model="key"
          class="input-with-select limiting"
          maxlength="20"
          show-word-limit
        >
          <el-button slot="append" icon="el-icon-search" @click="cx"></el-button>
        </el-input>
      </template>
    </OperationHeader>
    <el-dialog
      v-if="dialogVisible"
      title="缓存详情"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <el-row class="margin20X" type="flex">
        <el-col :span="10" class="bold flex-align-end margin-right20">Key</el-col>
        <el-col>
          <div class="dialog">{{viewKey}}</div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10" class="bold flex-align-end margin-right20">Value</el-col>
        <el-col class="margin-bottom20">
          <div class="dialog">{{value}}</div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-table style="margin-bottom:60px" class="margin-top10" :data="list" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in thList"
        :prop="item.value"
        :key="item.value"
        :label="item.key"
      ></el-table-column>
      <el-table-column :width="140" label="操作">
        <template slot-scope="scope">
          <el-button @click="view(scope.row)" type="text" icon="el-icon-view">查看</el-button>
          <el-button @click="del(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="list.length"
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
import Pagination from '@/mixins/pagination'

export default {
  mixins: [Pagination],
  data() {
    return {
      dialogVisible: false,
      key: '',
      value: '',
      list: [],
      viewKey: '',
      thList: [
        { value: 'key', key: 'Key' },
        { value: 'value', key: 'Value' },
      ],
    }
  },
  async created() {
    this.$startLoading()
    await this.getMainList()
    this.$stopLoading()
  },
  methods: {
    deleteall() {
      this.$confirm(`确定要删除全部缓存数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.CacheManageDeleteAllCache().then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              if (this.list.length == 1 && this.pageIndex != 1) {
                this.pageIndex = this.pageIndex - 1
              }
              this.search()
            }
          })
        })
        .catch(() => {})
    },
    //获取统计数据
    getMainList() {
      this.list = []
      return this.$apis
        .cacheManageGetKeys({
          pageSize: this.pageSize,
          pageNo: this.pageIndex,
        })
        .then((res) => {
          res.list.forEach((element) => {
            this.list.push({
              key: element.key,
              value: JSON.stringify(element.value),
            })
          })
          this.total = res.total
        })
    },
    //查询
    search() {
      this.pageIndex = 1
      this.getMainList()
    },
    cx() {
      this.list = []
      this.$apis
        .CacheManageGetKey({
          key: this.key,
          pageSize: this.pageSize,
          pageNo: 1,
        })
        .then((res) => {
          res.list.forEach((element) => {
            this.list.push({
              key: element.key,
              value: JSON.stringify(element.value),
            })
          })
          this.total = res.total
        })
    },
    //查看
    view(item) {
      this.dialogVisible = true
      this.viewKey = item.key
      this.value = item.value
    },
    //删除
    del(item) {
      this.$confirm(`确定要删除"${item.key}"这条数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis
            .CacheManagedeleteCacheByKey({
              key: item.key,
              value: item.value,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                this.search()
              }
            })
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped>
.dialog {
  width: 80%;
  background-color: #eee;
  padding: 5px 15px;
  border: 1px solid #ccc;
  max-height: 300px;
  overflow-y: scroll;
}
</style>
