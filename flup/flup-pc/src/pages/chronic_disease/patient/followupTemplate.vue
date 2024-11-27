//随访管理模板
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <div class="inquirebox">
        <el-button
          style="margin-left:20px"
          type="primary"
          @click="add"
          plain
          :disabled="hospitalId!=$global.hospital_id"
        >新增</el-button>
        <div class="flex">
          <div>
            所属医院
            <el-select v-model="hospitalId" placeholder="请选择" @change="changeDept">
              <el-option
                v-for="item in hospitallist"
                :key="item.serial_no"
                :label="item.hospital_name"
                :value="item.serial_no"
                :disabled="item.serial_no != $global.hospital_id"
              ></el-option>
            </el-select>
          </div>
          <div>
            随访科室
            <el-select v-model="deptId" placeholder="请选择" @change="search">
              <el-option
                v-for="item in deptOptions"
                :key="item.serialNo"
                :label="item.deptName"
                :value="item.serialNo"
              ></el-option>
            </el-select>
          </div>
          <div>
            模板名称
            <el-input
              placeholder="请输入内容"
              v-model="templateName"
              class="input-with-select limiting"
              maxlength="20"
              show-word-limit
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </div>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="questionnaireName" label="模版名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="随访科室">
        <template slot-scope="scope">{{findDept(scope.row.flupDept)}}</template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="ifOperation(scope.row,'alter')"
            :disabled="hospitalId!=$global.hospital_id"
          >修改</el-button>
          <el-button
            type="text"
            @click="ifOperation(scope.row,'skip')"
            :disabled="hospitalId!=$global.hospital_id"
          >编辑模板</el-button>
          <el-button
            type="text"
            @click="ifOperation(scope.row,'deletex')"
            :disabled="hospitalId!=$global.hospital_id"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog
      title="随访问卷"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="模版名称" prop="questionnaireName">
          <el-input
            class="limiting"
            v-model.trim="form.questionnaireName"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospitalId">
          <el-select v-model="form.hospitalId" placeholder="请选择所属医院">
            <el-option
              :disabled="item.serial_no!=$global.hospital_id"
              v-for="item in hospitallist"
              :key="item.serial_no"
              :label="item.hospital_name"
              :value="item.serial_no"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访科室" prop="flupDept">
          <el-select v-model="form.flupDept" placeholder="请选择随访科室">
            <el-option
              v-for="item in deptOptions"
              :key="item.serialNo"
              :label="item.deptName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="checkBtn" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: null,
      tableData: [],
      hospitallist: [],
      deptOptions: [],
      hospitalId: null,
      templateName: null,
      deptId: null,
      pageNo: 1,
      pageSize: 10,
      total: null,
      dialogVisible: false,
      checkBtn: false,
      allHospital: [],
      form: {
        questionnaireName: null,
        flupDept: null,
        hospitalId: null,
        contentHtml: '1',
        questionnaireTypeId: '1',
        createUser: '1',
        content: '1',
        serialNo: null,
      },
      rules: {
        questionnaireName: [
          { required: true, message: '请输入模版名称', trigger: 'blur' },
        ],
        hospitalId: [
          { required: true, message: '请选择所属医院', trigger: 'change' },
        ],
        flupDept: [
          { required: true, message: '请选择随访科室', trigger: 'change' },
        ],
      },
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.$apis.hospitalgetAllHospitals().then((res) => {
      this.hospitallist = res
    })
    this.$apis
      .departmentgetDeptByHospitalId({ hospitalId: this.hospitalId })
      .then((res) => {
        this.allHospital = res
      })
    this.changeDept()
    this.gettemplatequeryTemplateList()
  },
  methods: {
    ifOperation(row, fun) {
      this.$apis.existBusinessData({ serialNo: row.serialNo }).then((res) => {
        if (!res) {
          this[fun](row)
        } else {
          this.$message({
            message: '模板已有业务数据不可进行此项操作!',
            type: 'warning',
          })
        }
      })
    },
    deletex(row) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$apis
          .templatedelTemplateData({
            hospitalId: row.hospital,
            serialNo: row.serialNo,
          })
          .then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              if (this.tableData.length == 1 && this.pageNo != 1) {
                this.pageNo = this.pageNo - 1
              }
              this.gettemplatequeryTemplateList()
            }
          })
      })
    },
    skip(row) {
      let smartFormUrl = JSON.parse(
        sessionStorage.getItem('base_url')
      ).SmartFormUrl
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            smartFormUrl +
            '/view/template/create?appid=flupsystem&businessId=78978900011&saveHook=' +
            smartFormUrl +
            '/saveHook&templateId=' +
            row.serialNo,
          title: `模板编辑`,
        }),
        '*'
      )
    },
    add() {
      this.form = {
        questionnaireName: null,
        flupDept: null,
        hospitalId: null,
        contentHtml: '1',
        questionnaireTypeId: '1',
        createUser: '1',
        content: '1',
        serialNo: null,
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }

      this.dialogVisible = true
    },
    alter(row) {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form = {
        questionnaireName: row.questionnaireName,
        flupDept: row.flupDept,
        hospitalId: row.hospital,
        contentHtml: row.content,
        questionnaireTypeId: row.questionnaireTypeId,
        createUser: row.createUser,
        content: row.content,
        serialNo: row.serialNo,
      }
      this.dialogVisible = true
    },
    submit() {
      let form = this.form
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.checkBtn = true
          let formData = new window.FormData()
          for (var key in form) {
            if (form[key] != null) {
              formData.append(key, form[key])
            }
          }
          this.$apis.templatesaveTemplateData(formData).then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.dialogVisible = false
              this.gettemplatequeryTemplateList()
            }
          })
        } else {
          this.checkBtn = false
          return false
        }
        let _this = this
        setTimeout(function () {
          _this.checkBtn = false
        }, 2000)
      })
    },
    search() {
      this.pageNo = 1
      this.gettemplatequeryTemplateList()
    },
    gettemplatequeryTemplateList() {
      this.tableData = []
      this.$apis
        .templatequeryTemplateList({
          hospitalId: this.hospitalId,
          type: 1,
          deptId: this.deptId,
          templateName: this.templateName,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          res.list.filter((item) => {
            console.log(1, item)
            item.flupDept === this.deptOptions.deptCode ||
              item.flupDept === this.deptOptions.serialNo

            if (item) {
              this.tableData = res.list
              this.total = res.total
            }
          })
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.gettemplatequeryTemplateList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.gettemplatequeryTemplateList()
    },
    findDept(id) {
      let item = this.allHospital.find(
        (item) => item.deptCode === id || item.serialNo === id
      )
      if (item) return item.deptName
      // return id
    },
    changeDept() {
      this.deptId = ''
      this.$apis
        .systemManagequeryCurrentUserDept({
          // flupDepartment: '1',
          hospitalId: this.hospitalId,
          // pageNo: 1,
          // pageSize: 100,
        })
        .then((res) => {
          this.deptOptions = res
          if (this.deptOptions.length > 0) {
            this.deptId = this.deptOptions[0].serialNo
          }
          this.search()
        })
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .inquirebox {
    display: flex;
    justify-content: space-between;
    > div {
      > div {
        margin-right: 20px;
      }
    }
    .el-input {
      width: 280px;
    }
  }
}
</style>