<template>
  <section>
    <el-form
      class="padding20X paddingX20 padding-bottom10"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item prop="description" label="条件类型">
        <el-input placeholder="请填写条件类型" v-model="form.description" clearable></el-input>
      </el-form-item>
      <el-form-item prop="patientType" label="病人类型">
        <el-select class="width100" v-model="form.patientType" placeholder="请选择病人类型">
          <el-option
            v-for="(item, i) in followupPatientTypeList"
            :key="i"
            :label="item.dict_name"
            :value="item.dict_code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表名">
        <el-select
          class="width100"
          v-model="form.tables[0].tableName"
          placeholder="请选择表名"
          clearable
        >
          <el-option
            v-for="(item, i) in followupTableNameList"
            :key="i"
            :label="item.table_name_alias"
            :value="item.table_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(item, i) in form.tables[0].items" :key="i" :label="`字段${i+1}`">
        <el-row type="flex">
          <el-select
            class="width180px"
            :disabled="!form.tables[0].tableName"
            v-model="item.field"
            clearable
          >
            <el-option
              v-for="(item, j) in followupFieldList"
              :key="j"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="flex1 margin-left10"
            :disabled="!form.tables[0].tableName"
            v-model="item.fieldType"
            clearable
          >
            <el-option
              v-for="(item, j) in followupFieldTypeList"
              :key="j"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-input
            class="flex1 margin-left10"
            :disabled="!form.tables[0].tableName"
            v-model="item.fieldContent"
            placeholder="请输入"
            clearable
          ></el-input>
          <div class="margin-left10">
            <el-button
              :disabled="!form.tables[0].tableName"
              v-if="i == 0"
              type="text"
              @click="addField"
            >添加</el-button>
            <el-button v-else type="text" @click="deleteField(i)">删除</el-button>
          </div>
        </el-row>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
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
      },
      followupFieldTypeList: [
        { name: '包含' },
        { name: '>' },
        { name: '<' },
        { name: '=' },
      ],
      followupTableNameList: [],
      followupFieldList: [],
      followupPatientTypeList: [],
      rules: {
        description: [
          { required: true, message: '请填写条件类型', trigger: 'change' },
        ],
        patientType: [
          { required: true, message: '请选择病人类型', trigger: 'change' },
        ],
      },
    }
  },
  props: {
    data: String,
  },
  watch: {
    'form.patientType': {
      handler(newval, oldVal) {
        if (!newval) {
          this.form.tables[0].tableName = ''
          return
        }
        let obj = this.followupPatientTypeList.find((element) => {
          return element.dict_code == newval
        })
        this.followupTableNameList = obj.tables
        if (oldVal !== '') {
          this.form.tables[0].tableName = ''
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
          ]
          return
        }
        let obj = this.followupTableNameList.find((element) => {
          return element.table_name == newval
        })
        this.followupFieldList = obj.fields.items
        if (oldVal !== '') {
          this.form.tables[0].items = [
            {
              field: '',
              fieldType: '',
              fieldContent: '',
            },
          ]
        }
      },
    },
  },
  async created() {
    await this.$apis
      .getPatientTypeInfoList({
        parameterTypeId: '201709141524340858cd',
        keyWord: '入组规则',
        pageIndex: 1,
      })
      .then((res) => {
        if (res.return_code == 0) {
          this.followupPatientTypeList = JSON.parse(res.rows[0].parameter_value)
        } else {
          this.$message({
            message: res.msg,
            type: 'warning',
          })
        }
      })
    if (this.data) {
      this.form = JSON.parse(this.data)
    }
  },
  methods: {
    getData() {
      let data = null
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.structSql()
          data = this.form
        }
      })
      return data
    },
    addField() {
      this.form.tables[0].items.push({
        field: '',
        fieldType: '',
        fieldContent: '',
      })
    },
    deleteField(i) {
      this.form.tables[0].items.splice(i, 1)
    },
    structSql() {
      this.form.tables[0].sql =
        'SELECT * FROM ' + this.form.tables[0].tableName + ' WHERE 1=1'
      this.form.tables[0].items.forEach((res) => {
        switch (res.fieldType) {
          case '包含':
            this.form.tables[0].sql +=
              ' AND ' + res.field + " LIKE '%" + res.fieldContent + "%'"
            break
          case '>':
          case '<':
          case '=':
            this.form.tables[0].sql +=
              ' AND ' + res.field + res.fieldType + res.fieldContent
            break
        }
      })
    },
  },
}
</script>
