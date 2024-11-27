<template>
  <div class="manager">
    <operationHeader class="margin-bottom20">
      <div class="label">搜索</div>
      <!-- <el-input
        class="width200px value"
        v-model="keyword"
        placeholder="请输入"
        clearable
        @keyup.enter.native="onSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
      </el-input>-->
      <el-select style="margin-left: 20px" v-model="keyword" clearable @change="onSearch">
        <el-option v-for="item in factoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <template v-slot:right>
        <el-button type="primary" @click="onAddConfig" plain>新增</el-button>
      </template>
    </operationHeader>
    <el-table
      style="margin-bottom:60px"
      class="margin-top20"
      :data="mainList"
      highlight-current-row
      border
      stripe
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="ipcc" label="IPCC厂家" :formatter="formatIpcc"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in columnList"
        :key="item.value"
        :label="item.key"
      >
        <template slot-scope="scope">{{ scope.row[item.value] }}</template>
      </el-table-column>
      <el-table-column prop="isEnable" label="有效" width="70">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable"
            :active-value="1"
            :inactive-value="0"
            @change="updateIpccConfig(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column prop="comment" label="操作">
        <template slot-scope="scope">
          <el-button @click.stop="onEditConfig(scope.row)" type="text">编辑</el-button>
          <el-button @click="onDeleteConfig(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
      background
    ></el-pagination>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <el-form
        :model="ipccConfig"
        ref="ipccConfig"
        label-width="120px"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item label="IPCC厂家" prop="ipcc">
          <el-select v-model="ipccConfig.ipcc">
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="ipccConfig.ipcc"></el-input> -->
        </el-form-item>
        <el-form-item label="服务器地址" prop="address">
          <el-input v-model="ipccConfig.address"></el-input>
        </el-form-item>
        <el-form-item label="客服热线" prop="phone">
          <el-input v-model="ipccConfig.phone"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="isEnable">
          <el-switch
            style="padding: 16px 0"
            v-model="ipccConfig.isEnable"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="描述" prop="phone">
          <el-input type="textarea" v-model="ipccConfig.comment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bc">提 交</el-button>
      </span>
    </el-dialog>
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
        { value: 'address', key: '服务器地址' },
        { value: 'phone', key: '客服热线' },
      ],
      mainList: [],
      dialogVisible: false,
      total: 0,
      ipccConfig: {
        address: '',
        comment: '',
        ipcc: '',
        isEnable: 0,
        phone: '',
        serialNo: '',
      },
      rules: {
        ipcc: [{ required: true, message: '请输入IPCC厂家', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入服务器地址', trigger: 'blur' },
        ],
      },
      factoryList: [
        { id: '0', name: '中兴' },
        { id: '1', name: '全胜' },
      ],
      title: '新增',
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    formatIpcc(val) {
      let ipccName = ''
      try {
        ipccName = this.factoryList.filter((x) => x.id == val.ipcc)[0].name
      } catch (error) {}
      return ipccName
    },
    onSearch() {
      this.$apis
        .getAllIpccConfig({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          value: this.keyword,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
    },
    bc() {
      this.$refs['ipccConfig'].validate((valid) => {
        if (valid) {
          this.$apis.editIpccConfig(this.ipccConfig).then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.reset()
            }
            this.dialogVisible = false
            this.onSearch()
          })
        } else {
          return false
        }
      })
    },
    onEditConfig(row) {
      if (this.$refs['ipccConfig']) {
        this.$refs['ipccConfig'].resetFields()
      }
      this.reset()
      this.title = '修改'
      this.dialogVisible = true
      this.ipccConfig = JSON.parse(JSON.stringify(row))
    },
    onDeleteConfig(row) {
      this.$apis.delIpccConfig({ serialNo: row.serialNo }).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          if (this.mainList.length == 1 && this.pageIndex != 1) {
            this.pageIndex = this.pageIndex - 1
          }
          this.onSearch()
        }
      })
    },
    updateIpccConfig(row) {
      this.$apis
        .enableIpccConfig({
          serialNo: row.serialNo,
          enable: row.isEnable,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            // 刷新 ipcc 列表
            this.onSearch()
          }
          this.reset()
        })
    },
    onAddConfig() {
      this.dialogVisible = true
      if (this.$refs['ipccConfig']) {
        this.$refs['ipccConfig'].resetFields()
      }
      this.reset()
      this.title = '新增'
      this.dialogVisible = true
    },
    reset() {
      this.ipccConfig = {
        address: '',
        comment: '',
        ipcc: '',
        isEnable: 0,
        phone: '',
        serialNo: '',
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.onSearch()
    },
    handleCurrentChange() {
      this.pageNo = val
      this.onSearch()
    },
  },
}
</script>

<style scoped>
.manager {
  padding: 0px 20px 20px 20px;
}
</style>