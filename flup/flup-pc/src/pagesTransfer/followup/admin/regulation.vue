//慢病随访规则管理
<template>
  <div class="container">
    <el-form class="inquirebox" label-width="80px">
      <el-form-item label="关联科室">
        <el-select v-model="relationDept" placeholder="请选择" @change="cax" clearable>
          <el-option
            v-for="(item, index) in deptlist"
            :key="index"
            :label="item.deptName"
            :value="item.deptName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索">
        <el-input placeholder="请输入名称查询" v-model="name" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="cax"></el-button>
        </el-input>
      </el-form-item>
      <el-button type="primary" plain @click="xz">新增</el-button>
    </el-form>
    <el-table :data="tableData" border style="width: 100%" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="ruleName" label="规则名称"></el-table-column>
      <el-table-column prop="relationDept" label="关联科室"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="address" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="xg(scope.row)">修改</el-button>
          <!-- <el-button type="text" size="small" @click="onConfig(scope.row)">配置</el-button> -->
          <el-button type="text" size="small" @click="xg(scope.row)">修改记录</el-button>
          <el-button type="text" size="small" @click="deletex(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog :title="title" :visible.sync="tufa" width="40%" :before-close="handleClose">
      <el-form
        :model="fuFlupRule"
        :rules="rules"
        ref="fuFlupRule"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="fuFlupRule.ruleName"></el-input>
        </el-form-item>
        <el-form-item label="关联科室" prop="relationDept">
          <el-select v-model="fuFlupRule.relationDept" multiple placeholder="请选择">
            <el-option
              v-for="item in deptlist"
              :key="item.value"
              :label="item.deptName"
              :value="item.deptName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tufa = false">取 消</el-button>
        <el-button type="primary" @click="bc">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      fuFlupRule: {
        relationDept: [],
        ruleName: null,
        ruleType: 0,
        serialNo: null,
        hospitalId: null,
      },

      deptlist: [],
      tufa: false,
      hospitalId: null,
      name: '',
      tableData: [],
      total: null,
      pageNo: 1,
      pageSize: 10,
      ruleType: null,
      relationDept: null,
      rules: {
        name: [
          { required: true, message: '请输入随访类型名称', trigger: 'blur' },
        ],
        value1: [
          { required: true, message: '请输入随访业务', trigger: 'blur' },
        ],
      },
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.fuFlupRule.hospitalId = this.hospitalId
    this.$apis.systemManagequeryCurrentUserDept({}).then((res) => {
      this.deptlist = res
    })
    this.getflupRulequeryFollowUpRuleList()
  },
  methods: {
    deletex(row) {
      this.$apis.flupRuledelFollowRule(row.serialNo).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          this.getflupRulequeryFollowUpRuleList()
        }
      })
    },
    xz() {
      this.fuFlupRule.serialNo = null
      if (this.$refs['fuFlupRule']) {
        this.$refs['fuFlupRule'].resetFields()
      }
      this.title = '新增规则'
      this.tufa = true
    },
    xg(row) {
      if (this.$refs['fuFlupRule']) {
        this.$refs['fuFlupRule'].resetFields()
      }
      this.title = '修改规则'
      this.tufa = true
      this.fuFlupRule.relationDept = row.relationDept.split('|')
      this.fuFlupRule.serialNo = row.serialNo
      this.fuFlupRule.ruleName = row.ruleName
    },
    bc() {
      this.$refs['fuFlupRule'].validate((valid) => {
        if (valid) {
          let a = this.fuFlupRule.relationDept.join('|')
          this.$apis
            .flupRulesaveFollowRule({
              relationDept: a,
              ruleName: this.fuFlupRule.ruleName,
              ruleType: this.fuFlupRule.ruleType,
              serialNo: this.fuFlupRule.serialNo,
              hospitalId: this.fuFlupRule.hospitalId,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                this.tufa = false
                this.getflupRulequeryFollowUpRuleList()
              }
            })
        } else {
          return false
        }
      })
    },
    cax() {
      this.pageNo = 1
      this.getflupRulequeryFollowUpRuleList()
    },
    getflupRulequeryFollowUpRuleList() {
      this.$apis
        .flupRulequeryFollowUpRuleList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          name: this.name,
          ruleType: 0,
          relationDept: this.relationDept,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
    },
    handleCurrentChange(val) {
      this.pageNo = val
    },
    handleClose(done) {
      done()
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .indicatorbox {
    border-top: 1px solid #d7dae0;
  }
}
</style>