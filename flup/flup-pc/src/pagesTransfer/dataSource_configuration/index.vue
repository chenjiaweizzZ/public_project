<template>
  <el-container>
    <el-aside v-if="asideVisible" class="height100 scroll-y" width="220px">
      <LeftAside
        :menuList="menuList"
        @handleMenu="handleMenu"
        @handleAdd="handleMenuAdd"
        @handleEdit="handleMenuEdit"
        @handleDelete="del"
      ></LeftAside>
    </el-aside>
    <div v-else class="divcss5" @click="handleMenuAdd">
      <span>暂无数据，请添加</span>
      <i class="el-icon-plus"></i>
    </div>
    <el-main style="padding-top:0">
      <OperationHeader style="margin-bottom:20px;">
        <el-button type="primary" @click="handleAdd" plain>新增</el-button>
      </OperationHeader>
      <el-dialog
        :title="`${editVisible ? '编辑' : '新增'}数据源分类`"
        :visible.sync="dialogVisible"
        width="700px"
        v-if="dialogVisible"
        :close-on-click-modal="false"
      >
        <planForm
          :menuId="menuId"
          :serialNo="serialNo"
          @onCancel="dialogVisible = false"
          @onSubmit="onSubmit"
        ></planForm>
      </el-dialog>
      <el-table class="margin-top10" :data="list" stripe border>
        <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="fieldName" label="子项名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="fieldCode" label="子项代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="enabled" label="有效">
          <template slot-scope="scope">
            <el-switch
              @change="switchx(scope.row)"
              v-model="scope.row.enabled"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
            <el-button @click="delField(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog
      :title="`${editVisible1 ? '编辑' : '新增'}数据源分类`"
      :visible.sync="tufa"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        :model="dataSetField"
        ref="dataSetField"
        label-width="120px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="数据源名称" prop="datasetName">
          <el-input v-model="datasetName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数据源代码" prop="datasetCode">
          <el-input v-model="datasetCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="子项名称" prop="fieldName">
          <el-input v-model="dataSetField.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="子项代码" prop="fieldCode">
          <el-input v-model="dataSetField.fieldCode"></el-input>
        </el-form-item>
        <el-form-item prop="enabled" label="选项">
          <el-checkbox true-label="1" false-label="0" v-model="dataSetField.enabled">启用</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tufa = false">取 消</el-button>
        <el-button type="primary" @click="bc">提 交</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import LeftAside from './components/left_aside'
import PlanForm from './components/plan_form'

export default {
  name: 'index',
  components: {
    LeftAside,
    PlanForm,
  },
  data() {
    return {
      asideVisible: false,
      editVisible: false,
      editVisible1: false,
      dialogVisible: false,
      menuList: [],
      menuId: '',
      serialNo: '',
      level: '',
      list: [],
      dataSetField: {},
      tufa: false,
      baseId: '',
      datasetId: '',
      datasetCode: '',
      datasetName: '',
      rules: {
        fieldCode: [
          { required: true, message: '请输入子项代码', trigger: 'blur' },
        ],
        fieldName: [
          { required: true, message: '请输入子项名称', trigger: 'blur' },
        ],
      },
    }
  },
  async created() {
    this.$startLoading()
    await this.getDatasetList()
    this.$stopLoading()
  },
  methods: {
    //获取菜单
    getDatasetList() {
      return this.$apis.getDatasetBaseList().then((res) => {
        this.menuList = res
        if (this.menuList.length == 0) {
          this.asideVisible = false
          return
        }
        for (let i in this.menuList) {
          this.$apis
            .getDatasetList({ baseId: this.menuList[i].baseId })
            .then((res) => {
              this.asideVisible = false
              this.menuList[i]['childNodes'] = res
              this.$nextTick(() => {
                console.log(i)
                this.asideVisible = true
              })
            })
        }
      })
    },
    //点击菜单
    handleMenu(item) {
      console.log(item)
      //一级目录下不可添加三级目录
      if (item.childNodes) {
        this.level = 0
        this.baseId = item.baseId
      } else {
        this.level = 1
        this.baseId = item.baseId
        this.datasetId = item.datasetId
        this.datasetCode = item.datasetCode
        this.datasetName = item.datasetName
        this.getMainList()
      }
    },
    //点击菜单新增
    handleMenuAdd(item) {
      this.editVisible = false
      this.serialNo = null
      if (item.childNodes == undefined) {
        this.menuId = '0'
      } else {
        this.menuId = item.baseId
      }

      this.dialogVisible = true
    },
    //点击菜单编辑
    handleMenuEdit(item) {
      this.editVisible = true
      if (item.childNodes) {
        this.menuId = '0'
        this.serialNo = item.baseId
      } else {
        this.menuId = item.baseId
        this.serialNo = item.datasetId
      }
      this.dialogVisible = true
    },
    onSubmit(form, formType) {
      if (formType == 'base') {
        form.baseId = form.baseId == '0' ? '' : form.baseId
        this.$apis.saveDatasetBase({ ...form }).then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.dialogVisible = false
            this.getDatasetList()
          }
        })
      } else if (formType == 'set') {
        this.$apis.saveDataset({ ...form }).then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.dialogVisible = false
            this.getDatasetList()
          }
        })
      }
    },
    del(item) {
      this.$confirm(
        `确定要删除"${
          item.baseName ? item.baseName : item.datasetName
        }"这条数据吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          if (item.baseName) {
            this.$apis.deleteDatasetBase(item.baseId).then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                this.getDatasetList()
                // this.getMainList();
              }
            })
          } else {
            this.$apis.deleteDataset(item.datasetId).then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                // this.getMainList();
                this.getDatasetList()
              }
            })
          }
        })
        .catch(() => {})
    },
    delField(item) {
      this.$confirm(`确定要删除"${item.fieldName}"这条数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.deleteDatasetField(item.fieldId).then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.getDatasetList()
              this.getMainList()
            }
          })
        })
        .catch(() => {})
    },

    //获取数据
    getMainList() {
      console.log(this.datasetId)
      this.$apis
        .getDatasetFieldList({
          datasetId: this.datasetId,
        })
        .then((res) => {
          this.list = res
        })
    },
    //新增
    handleAdd() {
      this.editVisible1 = true
      this.dataSetField = {
        datasetId: '',
        enabled: '',
        fieldCode: '',
        fieldId: '',
        fieldName: '',
        fieldType: '1',
        enabled: '1',
      }

      if (this.level == 1) {
        this.dataSetField.datasetId = this.datasetId
        this.editVisible1 = false
        this.tufa = true
        if (this.$refs['dataSetField']) {
          this.$refs['dataSetField'].resetFields()
        }
      } else {
        if (this.baseId) {
          this.$message({
            showClose: true,
            message: '目前一级目录不支持添加子项，请选择二级目录',
            type: 'warning',
          })
        } else {
          this.$message({
            showClose: true,
            message: '未选择数据源类型',
            type: 'warning',
          })
        }
      }
    },
    bc() {
      this.$refs['dataSetField'].validate((valid) => {
        if (valid) {
          this.$apis.saveDatasetField(this.dataSetField).then((res) => {
            if (res) {
              this.$message({
                message: '新增成功',
                type: 'success',
              })
              this.tufa = false
              this.getMainList()
            } else {
              return false
            }
          })
        }
      })
    },
    switchx(row) {
      this.dataSetField = row
      this.$apis.saveDatasetField(this.dataSetField).then((res) => {
        if (res) {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
        }
      })
    },
    //编辑
    edit(item) {
      this.editVisible1 = true
      this.dataSetField = JSON.parse(JSON.stringify(item))
      if (this.$refs['dataSetField']) {
        this.$refs['dataSetField'].resetFields()
      }
      this.tufa = true
    },

    handleClose(done) {
      done()
    },
  },
}
</script>

<style lang="scss" >
.divcss5 {
  width: 180px;
  height: 53px;
  margin: 25px 0 0 20px;
  border: 2px dashed #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #ccc;
  i {
    font-weight: 900;
  }
}
.parameterbox {
  width: 100%;
  display: flex;
}
.parameterbox > div {
  width: 50%;
  height: 450px;
  margin-top: 20px;
  border: 1px solid #ccc;
}
.parameterbox > div > p {
  font-size: 18px;
  margin: 10px 20px;
  color: #999;
  padding-bottom: 10px;
  border-bottom: 2px solid #ccc;
}
</style>
