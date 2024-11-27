<template>
  <div class="marginX20">
    <filterHeader @onSearch="onSearch" @onClickLeftBtn="onAdd"></filterHeader>
    <el-table
      style="margin-bottom:60px"
      ref="table"
      :data="list"
      stripe
      border
      header-row-class-name="header-height"
    >
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>

      <el-table-column
        show-overflow-tooltip
        v-for="item in thList"
        :key="item.value"
        :label="item.key"
      >
        <template slot-scope="scope">{{scope.row[item.value]}}</template>
      </el-table-column>

      <el-table-column :width="230" label="操作">
        <template slot-scope="scope">
          <el-button @click="openResetDialog(scope.row)" type="text" icon="el-icon-lock">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      class="pwd-dialog"
      title="重置密码"
      :visible.sync="dialogResetPwdVisible"
      width="550px"
      destroy-on-close
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" class="marginX20" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="form.password" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="confrimPassword">
          <el-input v-model="form.confrimPassword" show-password clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="resetPassword">确认修改</el-button>
      </div>
    </el-dialog>

    <div style="margin-top:15px;text-align:right;">
      <el-pagination
        class="pageBottom"
        v-if="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.pageNo"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import filterHeader from './components/filter_header'

export default {
  components: {
    filterHeader,
  },
  data() {
    let pwdValidator = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      thList: [
        { value: 'userName', key: '用户名' },
        { value: 'realName', key: '真实姓名' },
        { value: 'roleName', key: '所属角色' },
        { value: 'hospitalName', key: '所属医院' },
        { value: 'deptName', key: '所属科室' },
      ],
      dialogVisible: false,
      serial_no: '',
      list: [],
      query: {
        keyword: '',
      },
      pageQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      dialogResetPwdVisible: false,
      form: {
        password: '',
        confrimPassword: '',
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confrimPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: pwdValidator, trigger: 'blur' },
        ],
      },
    }
  },
  async created() {
    this.$startLoading()
    await this.getList()
    this.$stopLoading()
  },
  methods: {
    openResetDialog(row) {
      this.serial_no = row.serial_no
      this.dialogResetPwdVisible = true
      this.form = {
        password: '',
        confrimPassword: '',
      }
    },
    resetPassword() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$apis
            .resetUserPassword({
              serial_no: this.serial_no,
              pwd: this.form.password,
            })
            .then(() => {
              this.$message({
                type: 'success',
                message: '重置密码成功',
              })
              this.dialogResetPwdVisible = false
            })
        }
      })
    },
    getList() {
      return this.$apis
        .querygetUsersByHospitalId4Page({
          ...this.query,
          ...this.pageQuery,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.list = res.list
          this.total = res.total
        })
    },
    onSubmit() {
      this.dialogVisible = false
      this.getList()
    },
    onSearch(query) {
      this.query = query
      this.pageQuery.pageNo = 1
      this.getList()
    },
    onAdd() {
      this.serial_no = ''
      this.dialogVisible = true
    },
    handleSizeChange(v) {
      this.pageQuery.pageSize = v
      this.pageQuery.pageNo = 1
      this.getList()
    },
    handleCurrentChange(v) {
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .pwd-dialog {
  .el-dialog__body {
    border: 0;
  }
}
</style>
