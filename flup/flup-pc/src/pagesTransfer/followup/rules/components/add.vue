<template>
  <el-dialog :title="this.data?'修改规则':'新增规则'" :visible="show" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" @close="onClose">
    <section v-if="show" class="rule-add">
      <el-form class="rule-add-form" ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item prop="rule_name" label="规则名称">
          <el-row type="flex" align="middle">
            <el-input class="limiting" v-model.trim="form.rule_name" maxlength="20" show-word-limit></el-input>
          </el-row>
        </el-form-item>
        <el-form-item label="关联科室" prop="relation_dept">
          <el-select class="width100" v-model="form.relation_dept" filterable :disabled="this.data&&this.data.resource==1">
            <el-option v-for="(item, i) in deptList" :key="i" :label="item.deptName" :value="item.deptName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="patientType" label="患者类型">
          <el-select class="width100" v-model="form.patientType" placeholder="请选择病人类型" :disabled="(!!this.data)&&(!!this.data.enrollmentConfig)">
            <el-option v-for="(item, i) in followupPatientTypeList" :key="i" :label="item.patientTypeName" :value="item.patientTypeCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则来源" v-if="this.data">
          <div class="source_text">{{this.form.sourceType==1?'系统开通':this.form.sourceType==2?'自主创建':''}}{{ this.data.name}}</div>
        </el-form-item>
        <el-form-item label="入组条件" prop="conditionEnable">
          <el-switch v-model="form.conditionEnable" :active-value="1" :inactive-value="0" :key="form.serialNo"></el-switch>
        </el-form-item>
        <template v-if="form.conditionEnable">
          <div class="rule-add_block_title">入组条件</div>
          <el-form-item label="表名">
            <el-select class="width100" v-model="form.tables[0].tableName" placeholder="请选择表名" clearable>
              <el-option v-for="(item, i) in followupTableNameList" :key="i" :label="item.table_name_alias" :value="item.table_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, i) in form.tables[0].items" :key="i" :label="`字段${i+1}`">
            <el-row type="flex">
              <el-select style="width:120px" :disabled="!form.tables[0].tableName" v-model="item.field" clearable>
                <el-option v-for="(item, j) in followupFieldList" :key="j" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <el-select style="width:120px" class="margin-left10" :disabled="!form.tables[0].tableName" v-model="item.fieldType" clearable>
                <el-option v-for="(item, j) in followupFieldTypeList" :key="j" :label="item.name" :value="item.name"></el-option>
              </el-select>
              <el-input class="width200px margin-left10" :disabled="!form.tables[0].tableName" v-model="item.fieldContent" placeholder="请输入" clearable></el-input>
              <div class="margin-left10">
                <el-button :disabled="!form.tables[0].tableName" v-if="i == 0" type="text" @click="addField">添加</el-button>
                <el-button v-else type="text" @click="deleteField(i)">删除</el-button>
              </div>
            </el-row>
          </el-form-item>
        </template>
      </el-form>
    </section>
    <span class="rule-add-footer" slot="footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'rule-add',
  data() {
    return {
      form: {
        rule_name: '',
        relation_dept: '',
        conditionEnable: 0,
        sourceType: 0,
      },
      followupFieldTypeList: [{ name: '包含' }, { name: '>' }, { name: '<' }, { name: '=' }],
      followupTableNameList: [],
      followupFieldList: [],
      followupPatientTypeList: [],
      rules: {
        rule_name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        relation_dept: [{ required: true, message: '请选择关联科室', trigger: 'change' }],
        patientType: [{ required: true, message: '请选择患者类型', trigger: 'change' }],
      },
      deptList: [],
    };
  },
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    type() {
      if (this.$route.params.type === 'specialist') {
        return 1;
      } else if (this.$route.params.type === 'whole') {
        return 0;
      } else if (this.$route.params.type === 'icdm') {
        return 2;
      }
    },
  },
  watch: {
    data: {
      handler() {
        if (this.data) {
          if (this.data.enrollmentConfig) {
            this.form = {
              rule_name: this.data.ruleName,
              relation_dept: this.data.relationDept,
              conditionEnable: this.data.conditionEnable,
              sourceType: this.data.sourceType || 0,
              ...JSON.parse(this.data.enrollmentConfig),
            };
          } else if (!this.data.enrollmentConfig) {
            this.form = {
              rule_name: this.data.ruleName,
              relation_dept: this.data.relationDept,
              conditionEnable: this.data.conditionEnable,
              description: '',
              patientType: '',
              tables: [
                {
                  tableName: '',
                  items: [
                    {
                      field: '',
                      fieldType: '',
                      fieldContent: '',
                    },
                  ],
                  sql: '',
                },
              ],
            };
          }
          //所有类型都需要添加入组条件，故删除此处
          // else {
          //   this.form = {
          //     rule_name: this.data.ruleName,
          //     relation_dept: this.data.relationDept
          //       ? this.data.relationDept.split('|')
          //       : '',
          //     conditionEnable: this.data.conditionEnable,
          //   }
          // }
        } else {
          this.form = {
            rule_name: '',
            relation_dept: '',
            description: '',
            patientType: '',
            conditionEnable: this.type == '0' ? 1 : 0,
            tables: [
              {
                tableName: '',
                items: [
                  {
                    field: '',
                    fieldType: '',
                    fieldContent: '',
                  },
                ],
                sql: '',
              },
            ],
          };
        }
      },
      immediate: true,
    },
    'form.patientType': {
      handler(newval, oldVal) {
        if (!newval) {
          this.form.tables[0].tableName = '';
          return;
        }
        let obj = this.followupPatientTypeList.find((element) => {
          return element.patientTypeCode == newval;
        });
        this.followupTableNameList = JSON.parse(obj.description);

        if (oldVal !== '') {
          this.form.tables[0].tableName = '';
        }
      },
    },
    'form.tables.0.tableName': {
      handler(newval, oldVal) {
        if (!newval) {
          this.form.tables[0].items = [
            {
              field: '',
              fieldType: '',
              fieldContent: '',
            },
          ];
          return;
        }
        let obj = this.followupTableNameList.find((element) => {
          return element.table_name == newval;
        });
        this.followupFieldList = obj.fields.items;
        if (oldVal !== '') {
          this.form.tables[0].items = [
            {
              field: '',
              fieldType: '',
              fieldContent: '',
            },
          ];
        }
      },
    },
  },
  created() {
    this.$apis.queryPatientTypeAll().then((res) => {
      if (res.length != 0) {
        this.followupPatientTypeList = res;
        let obj = this.followupPatientTypeList.find((element) => {
          console.log(22, element);
          return element.patientTypeCode == this.form.patientType;
        });
        this.followupTableNameList = (obj && JSON.parse(obj.description)) || [];
        console.log(33, this.followupTableNameList);

        obj = this.followupTableNameList.find((element) => {
          return element.table_name == this.form.tables[0].tableName;
        });
        this.followupFieldList = (obj && obj.fields.items) || [];
      } else {
        this.$message({
          message: '暂无患者类型数据!',
          type: 'warning',
        });
      }
    });
    this.$apis.systemManagequeryCurrentUserDept().then((res) => {
      this.deptList = res;
    });
    // if(this.data.enrollment_config) {
    //   this.form = JSON.parse(this.data.enrollment_config)
    // }
  },
  methods: {
    onClose() {
      this.$emit('update:show', false);
    },
    onSave() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let enrollmentConfig = JSON.stringify({
            description: this.form.description,
            patientType: this.form.patientType,
            tables: this.form.tables,
          });
          await this.$apis.flupRulesaveFollowRule({
            serialNo: this.data ? this.data.serialNo : '',
            hospitalId: this.$global.hospital_id,
            ruleName: this.form.rule_name,
            ruleType: this.type,
            conditionEnable: this.form.conditionEnable,
            relationDept: this.form.relation_dept,
            enrollmentConfig: enrollmentConfig,
            sourceType: 2, //规则来源
          });
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.onClose();
          this.$emit('save');
        }
      });
    },
    getData() {
      let data = null;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.structSql();
          data = this.form;
        }
      });
      return data;
    },
    addField() {
      this.form.tables[0].items.push({
        field: '',
        fieldType: '',
        fieldContent: '',
      });
    },
    deleteField(i) {
      this.form.tables[0].items.splice(i, 1);
    },
    structSql() {
      this.form.tables[0].sql = 'SELECT * FROM ' + this.form.tables[0].tableName + ' WHERE 1=1';
      this.form.tables[0].items.forEach((res) => {
        switch (res.fieldType) {
          case '包含':
            this.form.tables[0].sql += ' AND ' + res.field + " LIKE '%" + res.fieldContent + "%'";
            break;
          case '>':
          case '<':
          case '=':
            this.form.tables[0].sql += ' AND ' + res.field + res.fieldType + res.fieldContent;
            break;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.rule-add {
  .el-form-item__content .el-select {
    display: inline-block;
  }
  &_block_title {
    padding: 10px 0 5px 0;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
  }
  // padding: 20px 20px;
  // &-footer {
  //   display: flex;
  //   justify-content: center;
  //   .el-button + .el-button {
  //     margin-left: 60px;
  //   }
  // }
  .source_text {
    line-height: 40px;
  }
}
</style>