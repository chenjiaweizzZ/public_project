<template >
  <div class="rulesWarehouse">
    <OperationHeader class="rule-top-bar">
      <el-button icon="el-icon-back" type="warning" plain @click="retreat">返回</el-button>
      <template v-slot:right>
        <ul>
          <li>
            <span class="margin-left10">关联科室</span>
            <el-select v-model="dept" clearable @change="onSearch"  filterable>
              <el-option v-for="item in newDeptOptions" :key="item.Value" :value="item.deptName" :label="item.deptName"></el-option>
            </el-select>
          </li>
          <li>
            <el-input placeholder="请输入名称" v-model="ruleName" class="input-with-select limiting" maxlength="20" show-word-limit>
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </li>
        </ul>
      </template>
    </OperationHeader>
    <div>
      <el-table style="margin-bottom:60px" class="rules-table" :data="mainList" stripe border>
        <el-table-column width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="ruleName" label="规则名称"></el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="setShowConfig(scope.row)">查看</el-button>
            <el-button type="text" @click="setImport(scope.row)">导入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="导入规则设置" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.dstRuleName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="关联科室" prop="dstRelationDept">
          <el-select v-model="ruleForm.dstRelationDept" placeholder="请选择关联科室" filterable>
            <el-option v-for="item in newDeptOptions" :key="item.Value" :value="item.deptName" :label="item.deptName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则类型" prop="dstRelationDept">
          <el-select v-model="ruleForm.dstRuleType " placeholder="请选择规则类型">
            <el-option label="全院" value="0"></el-option>
            <el-option label="专科" value="1"></el-option>
            <el-option label="慢病" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ruleImportFuRule">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <rule-config v-if="showConfig" :data="row" :show.sync="showConfig" :ruleType="1"></rule-config>
  </div>
</template>
<script>
import deptMixin from '@/mixins/deptList.js';
import RuleConfig from './components/rule';
export default {
  components: { RuleConfig },
  mixins: [deptMixin],
  data() {
    return {
      mainList: [],
      ruleName: '',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      showConfig: false,
      dialogVisible: false,
      row: null,
      ruleForm: {
        dstRuleName: '',
        dstRelationDept: '',
        dstHospitalId: '',
        dstRuleType: '',
        srcRuleId: '',
      },
      rules: {
        dstRelationDept: [{ required: true, message: '请选择关联科室', trigger: 'change' }],
      },
    };
  },
  created() {
    this.getNewDeptList();
    this.getMainList();
  },
  methods: {
    setImport(row) {
      this.ruleForm = Object.assign(
        {},
        {
          dstRuleName: '',
          dstRelationDept: '',
          dstHospitalId: '',
          dstRuleType: '',
          srcRuleId: '',
        }
      );
      this.ruleForm.srcRuleId = row.serialNo;
      this.ruleForm.dstHospitalId = this.$global.hospital_id;
      this.dialogVisible = true;
    },
    getMainList() {
      this.$apis
        .ruleGetQuRule({
          ruleName: this.ruleName,
          deptName: this.dept,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.mainList = res.list;
          this.total = res.total;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getMainList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getMainList();
    },
    retreat() {
      this.$router.go(-1);
    },
    ruleImportFuRule() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$apis
            .ruleImportFuRule({
              ...this.ruleForm,
            })
            .then((res) => {
              if (res) {
                this.dialogVisible = false;
                this.$message({
                  message: '导入成功',
                  type: 'success',
                });
              }
            });
        }
      });
    },
    onSearch() {
      this.handleSizeChange(this.pageSize);
    },
    setShowConfig(row) {
      this.row = row;
      this.showConfig = true;
    },
  },
};
</script>
<style lang="scss">
.rulesWarehouse {
  padding: 10px;
  .rule-top-bar {
    ul {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
    }
    li + li {
      margin-left: 10px;
    }
  }
}
</style>