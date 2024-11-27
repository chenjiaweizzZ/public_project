<template>
  <div class="setting">
    <operationHeader class="margin-bottom20">
      <div class="search1">搜索</div>
      <el-input
        class="value limiting"
        style="width: 299px"
        v-model="keyword"
        placeholder="请输入坐席号码"
        @keyup.enter.native="onClickSearch"
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="onClickSearch"></el-button>
      </el-input>
      <template v-slot:right>
        <el-button class="margin-left50" type="primary" @click="dialogVisible=true">新增</el-button>
        <el-button class="margin-left50" type="info" icon="el-icon-refresh" @click="getsyncagent">同步</el-button>
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
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="resetForm"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="工号" prop="id">
            <el-input v-model="ruleForm.id" v-numberSign @blur="ruleForm.id = $event.target.value"></el-input>
          </el-form-item>
          <el-form-item label="坐席账号" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="租户" prop="nodehost">
            <el-input v-model="ruleForm.nodehost"></el-input>
          </el-form-item>
          <el-form-item label="坐席密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="列队" prop="groups">
            <el-input v-model="ruleForm.groups"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="saveAgent">确 定</el-button>
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
        { value: 'id', key: '工号' },
        { value: 'name', key: '坐席账号' },
        { value: 'groups', key: '队列组别' },
      ],
      mainList: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        id: null,
        name: null,
        nodehost: 'TCCRM',
        password: null,
        groups: 7654,
      },
      rules: {
        id: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入坐席账号', trigger: 'blur' }],
        nodehost: [{ required: true, message: '请输入租户', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入坐席密码', trigger: 'blur' },
        ],
        groups: [{ required: true, message: '请输入列队', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    saveAgent() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let obg = {
            ...this.ruleForm,
            type: 2,
            hospitalId: this.$global.hospital_id,
            password: this.$md5(this.ruleForm.password),
          }
          this.$apis
            .saveAgent({
              ...obg,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                this.resetForm()
                this.onClickSearch()
              }
            })
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
      this.dialogVisible = false
    },
    getsyncagent() {
      this.$apis.syncIpccAgent().then((res) => {
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
    onSearch() {
      this.$apis
        .getIpccAllAgent({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          name: this.keyword,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
    },
    onClickSearch() {
      this.pageIndex = 1
      this.onSearch()
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
.setting {
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