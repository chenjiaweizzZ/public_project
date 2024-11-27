<template>
  <div class="container">
    <div class="queryConditionsBox">
      <el-form class="inquirebox" label-width="80px">
        <el-form-item label="搜索">
          <el-input
            placeholder="请输入名称查询"
            v-model="keyWord"
            class="input-with-select limiting"
            maxlength="20"
            show-word-limit
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="cax"></el-button>
          </el-input>
        </el-form-item>
        <!-- <el-button style="margin-left: 30px" type="primary" plain @click="xz">新增</el-button> -->
      </el-form>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="patientTypeName" label="名称"></el-table-column>
      <el-table-column prop="patientTypeAlias" label="别名"></el-table-column>
      <el-table-column prop="patientTypeCode" label="代码"></el-table-column>
      <!-- <el-table-column prop="patientRelationTable" label="关联表名称"></el-table-column> -->
      <el-table-column prop="enabled" label="启用">
        <template slot-scope="scope">
          <!-- <el-switch
            v-if="scope.row.isEdit"
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
            @change="save(scope.row)"
          ></el-switch>
          <el-switch
            v-else
            disabled
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>-->
          <el-switch
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
            @change="alterSwitch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="xg(scope.row)">修改</el-button>
            <!-- <el-button
              v-if="scope.row.isEdit"
              type="text"
              size="small"
              @click="deletex(scope.row)"
            >删除</el-button>-->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      :current-page.sync="pageNo"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <el-form
        label-width="100px"
        :rules="rules"
        ref="patient"
        :model="patient"
        class="demo-ruleForm"
      >
        <el-form-item prop="patientTypeName" label="类型名称">
          <el-input
            :disabled="disabled"
            class="limiting"
            v-model="patient.patientTypeName"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="patientTypeAlias" label="别名">
          <el-input
            class="limiting"
            v-model="patient.patientTypeAlias"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="patientTypeCode" label="类型代码">
          <el-input
            :disabled="disabled"
            class="limiting"
            v-model="patient.patientTypeCode"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- <el-form-item prop="patientRelationTable" label="关联表名称">
          <el-input
            :disabled="disabled"
            class="limiting"
            v-model="patient.patientRelationTable"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>-->
        <!-- <el-form-item prop="enabled" label="是否启用">
          <el-switch
            :disabled="disabled"
            v-model="patient.enabled"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>-->
        <!-- <el-form-item prop="description" label="描述">
          <el-input
            type="textarea"
            maxlength="50"
            show-word-limit
            :autosize="{minRows:2,maxRows:4}"
            v-model="patient.description"
          ></el-input>
        </el-form-item>-->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="checkBtn" @click="baocun">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      keyWord: '',
      dialogVisible: false,
      disabled: false,
      total: null,
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      patient: {
        hospitalId: this.$global.hospital_id,
        patientTypeName: '',
        patientTypeCode: '',
        patientTypeAlias: '',
        // patientRelationTable: 'clinic_record',
        isEdit: 1,
        isDelete: 0,
        enabled: 1,
        description: '',
      },
      rules: {
        patientTypeName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        patientTypeCode: [
          { required: true, message: '请输入代码', trigger: 'blur' },
        ],
        patientRelationTable: [
          { required: true, message: '关联表名称', trigger: 'blur' },
        ],
      },
      checkBtn: false,
    }
  },
  created() {
    this.getPatientList()
  },
  methods: {
    getPatientList() {
      // if (this.pageNo > 1 && this.total % this.pageSize == 0) {
      //   --this.pageNo
      // }
      this.$apis
        .queryPatientTypeList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyWord: this.keyWord,
          //hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.tableData = res.list.filter((x) => !x.isDelete)
          this.total = res.total
        })
    },
    xz() {
      if (this.$refs['patient']) {
        this.$refs['patient'].resetFields()
      }
      this.title = '新增患者类型'
      this.reset()
      this.disabled = false
      this.dialogVisible = true
    },
    reset() {
      this.patient.id = ''
      this.patient.patientTypeName = ''
      this.patient.patientTypeCode = ''
      this.patient.patientTypeAlias = ''
      // this.patient.patientRelationTable = 'clinic_record'
      this.patient.isEdit = 1
      this.patient.isDelete = 0
      this.patient.enabled = 1
      this.patient.description = ''
    },
    xg(row) {
      if (this.$refs['patient']) {
        this.$refs['patient'].resetFields()
      }
      this.title = '修改患者类型'
      this.patient = JSON.parse(JSON.stringify(row))
      this.disabled = !row.isEdit
      this.dialogVisible = true
    },
    deletex(row) {
      this.$confirm('确认删除患者类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.delPatientType(row.id).then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.total--
              this.getPatientList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    baocun() {
      let _this = this
      _this.checkBtn = true
      this.$refs['patient'].validate((valid) => {
        if (valid) {
          this.patient.enabled = parseInt(this.patient.enabled)
          this.save(this.patient)
          this.dialogVisible = false

          setTimeout(function () {
            _this.checkBtn = false
          }, 2000)
        } else {
          _this.checkBtn = false
          return false
        }
      })
    },
    save(patient) {
      this.$apis.savePatientType(patient).then((res) => {
        if (res) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.getPatientList()
        }
      })
    },
    alterSwitch(patient) {
      this.$apis.updateStatus(patient).then((res) => {
        if (res) {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
          this.getPatientList()
        }
      })
    },
    cax() {
      this.pageNo = 1
      this.getPatientList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getPatientList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getPatientList()
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  .inquirebox {
    display: flex;
    align-content: center;
    background-color: #f8f8f8;

    // margin-top: -20px;
    // margin-left: -14px;
    // margin-bottom: 0px;
  }
  .indicatorbox {
    border-top: 1px solid #d7dae0;
    .el-form .demo-ruleForm {
      .el-form-item {
        .el-form-item__content {
          margin-left: 48px;
        }
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        .demo-ruleForm {
          .el-form-item {
            .el-form-item__label {
              padding-left: 4px;
            }
          }
        }
      }
    }
  }
}
</style>