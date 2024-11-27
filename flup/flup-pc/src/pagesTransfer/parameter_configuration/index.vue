<template>
  <el-container>
    <el-aside class="fixed height100 scroll-y" width="220px">
      <LeftAside :menuList="menuList" @handleMenu="handleMenu" @handleAdd="handleMenuAdd" @handleEdit="handleMenuEdit" @handleDelete="del"></LeftAside>
    </el-aside>
    <el-main style="margin-left:230px;padding-top:0">
      <OperationHeader style="margin-bottom:20px">
        <!-- <el-button type="primary" @click="handleAdd" plain>新增</el-button> -->
        <template v-slot:right>
          <p style="width:50px">搜索</p>
          <el-input placeholder="请输入名称" v-model="searchVal" class="input-with-select limiting" maxlength="20" show-word-limit>
            <el-button slot="append" icon="el-icon-search" @click="getMainList"></el-button>
          </el-input>
        </template>
      </OperationHeader>
      <el-dialog :title="`${serialNo ? '编辑' : '新增'}接口分类`" :visible.sync="dialogVisible" width="700px" v-if="dialogVisible" :close-on-click-modal="false">
        <planForm :serialNo="serialNo" :parameterTypeName="parameterTypeName" :parameterTypeCode="parameterTypeCode" :description="description" :enabled="enabled" @onCancel="dialogVisible = false" @onSubmit="onSubmit"></planForm>
      </el-dialog>
      <el-table class="margin-top10" :data="list" stripe border>
        <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parameterName" label="名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="parameterKey" label="Key值"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parameterValue" label="Value值"></el-table-column>
        <el-table-column show-overflow-tooltip prop="required" label="是否启用">
          <template slot-scope="scope">
            <el-switch @change="switchx(scope.row)" v-model="scope.row.enabled" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="description" label="描述"></el-table-column>

        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
            <!-- <el-button @click="del(scope.row)" type="text" icon="el-icon-delete">删除</el-button> -->
          </template>
        </el-table-column>

        <!-- <div v-if="parameterName=='移动端模块控制'" class="margin-top10" :data="list" stripe border> -->
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="健康监测移动端" name="first">
            <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterKey" label="Key值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterValue" label="Value值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="required" label="是否启用">
              <template slot-scope="scope">
                <el-switch @change="switchx(scope.row)" v-model="scope.row.enabled" active-value="1" inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="description" label="描述"></el-table-column>
          </el-tab-pane>
          <el-tab-pane label="医护移动端" name="second">
            <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterKey" label="Key值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterValue" label="Value值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="required" label="是否启用">
              <template slot-scope="scope">
                <el-switch @change="switchx(scope.row)" v-model="scope.row.enabled" active-value="1" inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="description" label="描述"></el-table-column>
          </el-tab-pane>
          <el-tab-pane label="患者移动端" name="third">
            <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterKey" label="Key值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="parameterValue" label="Value值"></el-table-column>
            <el-table-column show-overflow-tooltip prop="required" label="是否启用">
              <template slot-scope="scope">
                <el-switch @change="switchx(scope.row)" v-model="scope.row.enabled" active-value="1" inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="description" label="描述"></el-table-column>
          </el-tab-pane>
        </el-tabs> -->
        <!-- </div> -->
      </el-table>
    </el-main>
    <el-dialog :title="title + '参数'" :visible.sync="tufa" width="40%" :before-close="handleClose">
      <el-form :model="parameterType" ref="parameterType" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="参数类型" prop="parameterTypeId">
          <el-input v-model="parameterType.parameterTypeId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="parameterName">
          <el-input :disabled="true" v-model="parameterType.parameterName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="Key" prop="parameterKey">
          <el-input :disabled="true" v-model="parameterType.parameterKey" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="Value" prop="parameterValue">
          <el-input :disabled="true" v-model="parameterType.parameterValue" maxlength="1800" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="enabled" label="选项">
          <el-checkbox :disabled="true" true-label="1" false-label="0" v-model="parameterType.enabled">启用</el-checkbox>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input type="textarea" resize="none" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 5 }" v-model="parameterType.description" maxlength="100" show-word-limit></el-input>
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
      deptlist: [],
      parameterType: {
        parameterKey: null,
        parameterName: null,
        parameterTypeId: null,
        parameterValue: null,
        serialNo: null,
        enabled: '1',
        description: null,
      },
      title: null,
      tufa: false,
      menuList: [],
      menuId: '',
      dialogVisible: false,
      serialNo: '',
      searchKey: '',
      parameterTypeId: '',
      searchVal: '',
      list: [],
      parameterTypeName: null,
      description: null,
      parameterTypeCode: null,
      enabled: '1',
      activeName: 'first',      
      rules: {
        parameterName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        parameterKey: [
          { required: true, message: '请输入Key', trigger: 'blur' },
        ],
        parameterValue: [
          { required: true, message: '请输入Value', trigger: 'blur' },
        ],
      },
    }
  },
  async created() {
    this.$startLoading()
    await this.getParameterselectParameterType()
    this.$stopLoading()
  },
  methods: {
    switchx(row) {
      this.serialNo = row.serialNo
      this.parameterType.enabled = row.enabled
      this.parameterType.parameterKey = row.parameterKey
      this.parameterType.parameterName = row.parameterName
      this.parameterType.parameterTypeId = row.parameterTypeId
      this.parameterType.parameterValue = row.parameterValue
      this.parameterType.serialNo = row.serialNo
      this.parameterType.description = row.description
      this.$apis.ParameterupdateParameter(this.parameterType).then((res) => {
        if (res) {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
        }
      })
    },
    bc() {
      this.$refs['parameterType'].validate((valid) => {
        if (valid) {
          this.parameterType.parameterTypeId = this.parameterTypeId
          if (this.title == '新增') {
            this.$apis
              .ParametersaveParameter(this.parameterType)
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '新增成功',
                    type: 'success',
                  })
                  this.tufa = false
                  this.getMainList()
                }
              })
          } else {
            this.$apis
              .ParameterupdateParameter(this.parameterType)
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                  })
                  this.tufa = false
                  this.getMainList()
                }
              })
          }
        } else {
          return false
        }
      })
    },
    //获取菜单
    getParameterselectParameterType() {
      return this.$apis.ParameterselectParameterType({}).then((res) => {
        console.log(res);
        this.menuList = res
      })
    },
    //获取数据
    getMainList() {
      this.$apis
        .ParameterselectParametersByParameterTypeId({
          parameterTypeId: this.parameterTypeId,
          searchVal: this.searchVal,
        })
        .then((res) => {
          this.list = res
        })
    },
    //点击菜单
    handleMenu(serialNo, parameterTypeName) {
      this.parameterTypeId = serialNo
      this.parameterTypeName = parameterTypeName
      this.getMainList()
    },
    //点击菜单新增
    handleMenuAdd(item) {
      this.serialNo = null
      this.dialogVisible = true
    },
    //新增
    handleAdd() {
      this.title = '新增'
      this.parameterType.parameterKey = null
      this.parameterType.parameterName = null
      this.parameterType.parameterTypeId = null
      this.parameterType.parameterValue = null
      this.parameterType.serialNo = null
      this.parameterType.description = null
      this.menuId = ''
      if (this.parameterTypeName) {
        this.parameterType.parameterTypeId = this.parameterTypeName
        this.tufa = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择参数类型',
          type: 'warning',
        })
      }
    },
    //是否有效
    onEnable(item) {
      this.$apis.BaseDictChengeEnabled(item.serialNo).then((res) => {
        this.$message({
          showClose: true,
          message: res.message,
          type: res.state,
        })
        this.getMainList()
      })
    },
    //编辑
    edit(item) {
      this.title = '编辑'
      this.menuId = ''
      this.serialNo = item.serialNo
      this.tufa = true
      this.parameterType.parameterKey = item.parameterKey
      this.parameterType.parameterName = item.parameterName
      this.parameterType.parameterTypeId = this.parameterTypeName
      this.parameterType.parameterValue = item.parameterValue
      this.parameterType.serialNo = item.serialNo
      this.parameterType.description = item.description
      this.parameterType.enabled = item.enabled
    },
    //点击菜单编辑
    handleMenuEdit(item) {
      this.serialNo = item.serialNo
      this.description = item.description
      this.parameterTypeCode = item.parameterTypeCode
      this.parameterTypeName = item.parameterTypeName
      this.enabled = item.enabled
      this.dialogVisible = true
    },
    //删除
    del(item) {
      this.$confirm(
        `确定要删除"${
          item.parameterTypeName ? item.parameterTypeName : item.parameterName
        }"这条数据吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          if (item.parameterName) {
            this.$apis.ParameterdeleteParameter(item.serialNo).then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                this.getParameterselectParameterType()
                this.getMainList()
              }
            })
          } else {
            this.$apis
              .ParameterdeleteParameterType(item.serialNo)
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                  })
                  this.getMainList()
                  this.getParameterselectParameterType()
                }
              })
          }
        })
        .catch(() => {})
    },
    //提交
    onSubmit(form) {
      if (form.serialNo) {
        this.$apis
          .ParameterupdateParameterType({
            ...form,
          })
          .then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.dialogVisible = false
              this.getMainList()
              this.getParameterselectParameterType()
            }
          })
      } else {
        this.$apis
          .ParametersaveParameterType({
            ...form,
          })
          .then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.dialogVisible = false
              this.getMainList()
              this.getParameterselectParameterType()
            }
          })
      }
    },
    handleClose(done) {
      done()
    },
    handleClick(tab, event) {
      getMainList()
    },
  },
}
</script>

<style scoped>
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
<style lang="scss">
.el-tooltip__popper {
  max-width: 80%;
}
</style>