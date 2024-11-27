<template>
  <el-container>
    <el-aside class="fixed height100 scroll-y" width="220px">
      <LeftAside
        :menuList="menuList"
        @handleMenu="handleMenu"
        @handleAdd="handleMenuAdd"
        @handleEdit="handleMenuEdit"
        @handleDelete="del"
      ></LeftAside>
    </el-aside>
    <el-main style="margin-left:230px;padding-top:0">
      <OperationHeader style="margin-bottom:20px">
        <el-button type="primary" @click="handleAdd" plain>新增</el-button>
        <!-- <template v-slot:right>
          <el-input placeholder="名称/编号" clearable v-model="searchKey"></el-input>
          <el-button type="primary" @click="getMainList">查询</el-button>
        </template>-->
      </OperationHeader>
      <el-dialog
        :title="`${serial_no?'编辑':'新增'}接口分类`"
        :visible.sync="dialogVisible"
        width="700px"
        v-if="dialogVisible"
        :close-on-click-modal="false"
      >
        <planForm
          :menuId="menuId"
          :serial_no="serial_no"
          :fatherName="fatherName"
          :fatherId="fatherId"
          @onCancel="dialogVisible = false"
          @onSubmit="onSubmit"
        ></planForm>
      </el-dialog>
      <el-table class="margin-top10" :data="list" stripe border>
        <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="parameter_name" label="参数名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="api_name" label="Api_Name"></el-table-column>
        <el-table-column show-overflow-tooltip prop="required" label="是否必填">
          <template slot-scope="scope">{{scope.row.required == 1 ?"是":'否' }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="description" label="备注"></el-table-column>
        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
            <el-button @click="del(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="parameterbox">
        <div style="margin-right:20px">
          <p>入参示例</p>
          <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="textarea1"></el-input>
        </div>
        <div>
          <p>出参示例</p>
          <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="textarea2"></el-input>
        </div>
      </div>
    </el-main>
    <el-dialog :title="title" :visible.sync="tufa" width="40%" :before-close="handleClose">
      <el-form
        :model="vInterfaceParameter"
        ref="vInterfaceParameter"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="接口名称" prop="interface_name">
          <el-input v-model="vInterfaceParameter.interface_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="参数名称" prop="parameter_name">
          <el-input v-model="vInterfaceParameter.parameter_name"></el-input>
        </el-form-item>
        <el-form-item label="参数类型" prop="parameter_type">
          <el-select v-model="vInterfaceParameter.parameter_type" placeholder="请选择">
            <el-option label="int" value="1"></el-option>
            <el-option label="string" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Api_Name" prop="api_name">
          <el-input v-model="vInterfaceParameter.api_name"></el-input>
        </el-form-item>
        <el-form-item prop="required" label="选项">
          <el-checkbox true-label="1" false-label="0" v-model="vInterfaceParameter.required">启用</el-checkbox>
        </el-form-item>
        <el-form-item prop="description" label="备注">
          <el-input
            type="textarea"
            resize="none"
            placeholder="请输入备注"
            :autosize="{ minRows: 3 , maxRows:5}"
            v-model="vInterfaceParameter.description"
          ></el-input>
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
      vInterfaceParameter: {
        interface_name: null,
        interface_id: null,
        parameter_name: null,
        parameter_type: null,
        parameter_type_name: null,
        api_name: null,
        required: '1',
        description: null,
        serial_no: null,
      },
      title: null,
      tufa: false,
      textarea1: '',
      textarea2: '',
      menuList: [],
      menuId: '',
      dialogVisible: false,
      serial_no: '',
      searchKey: '',
      fatherId: '',
      fatherName: '',
      list: [],
      thList: [
        { value: 'dict_name', key: '名称' },
        { value: 'dict_code', key: '编号' },
        { value: 'description', key: '备注' },
      ],
    }
  },
  async created() {
    this.$startLoading()
    await this.getItemTypesForTree()
    this.$stopLoading()
  },
  methods: {
    bc() {
      this.$apis
        .InterfaceSaveParameter(this.vInterfaceParameter)
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.tufa = false
            this.getMainList()
          }
        })
    },
    //获取菜单
    getItemTypesForTree() {
      return this.$apis.InterfaceGetInterfacesForTree({}).then((res) => {
        this.menuList = res
      })
    },
    //获取数据
    getMainList() {
      // let query = {
      //   keyWorld: this.searchKey,
      //   parentId: this.fatherId
      // }
      if (!this.fatherId) {
        delete query.parentId
      }
      this.$apis
        .InterfaceGetInterfaceBySerialNo({
          serial_No: this.fatherId,
        })
        .then((res) => {
          this.textarea1 = res.input_parameters
          this.textarea2 = res.output_parameters
        })
      this.$apis
        .InterfaceGetInterfaceParameter({
          interfaceId: this.fatherId,
        })
        .then((res) => {
          this.list = res
        })
    },
    //点击菜单
    handleMenu(id, name) {
      this.fatherId = id
      this.fatherName = name
      this.searchKey = ''
      this.getMainList()
    },
    //点击菜单新增
    handleMenuAdd(item) {
      this.menuId = item.parentnodes
      this.serial_no = ''
      this.dialogVisible = true
    },
    //新增
    handleAdd() {
      this.vInterfaceParameter.interface_name = null
      this.vInterfaceParameter.interface_id = null
      this.vInterfaceParameter.parameter_name = null
      this.vInterfaceParameter.parameter_type = null
      this.vInterfaceParameter.parameter_type_name = null
      this.vInterfaceParameter.api_name = null
      this.vInterfaceParameter.description = null
      this.menuId = ''
      if (this.fatherId) {
        this.vInterfaceParameter.interface_name = this.fatherName
        this.vInterfaceParameter.interface_id = this.fatherId
        this.serial_no = ''
        this.tufa = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择接口名称',
          type: 'warning',
        })
      }
    },
    //是否有效
    onEnable(item) {
      this.$apis.BaseDictChengeEnabled(item.serial_no).then((res) => {
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
      this.menuId = ''
      this.serial_no = item.serial_no
      this.tufa = true
      this.vInterfaceParameter.serial_no = item.serial_no
      this.vInterfaceParameter.interface_name = item.interface_name
      this.vInterfaceParameter.interface_id = item.interface_id
      this.vInterfaceParameter.parameter_name = item.parameter_name
      this.vInterfaceParameter.parameter_type = item.parameter_type
      this.vInterfaceParameter.parameter_type_name = item.parameter_type_name
      this.vInterfaceParameter.api_name = item.api_name
      this.vInterfaceParameter.description = item.description
    },
    //点击菜单编辑
    handleMenuEdit(item) {
      this.menuId = item.parentnodes
      this.serial_no = item.id
      this.dialogVisible = true
    },
    //删除
    del(item) {
      this.$confirm(
        `确定要删除"${
          item.parameter_name ? item.parameter_name : item.text
        }"这条数据吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          if (item.parameter_name) {
            this.$apis
              .InterfaceDeleteDictBySerialNo({
                serial_no: item.serial_no ? item.serial_no : item.id,
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                  })
                  if (item.id) {
                    this.fatherId = ''
                  }
                  this.getMainList()
                  this.getItemTypesForTree()
                }
              })
          } else {
            this.$apis
              .InterfaceDeleteInterface({
                serial_no: item.serial_no ? item.serial_no : item.id,
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                  })
                  if (item.id) {
                    this.fatherId = ''
                  }
                  this.getMainList()
                  this.getItemTypesForTree()
                }
              })
          }
        })
        .catch(() => {})
    },
    //提交
    onSubmit(form) {
      this.$apis
        .InterfaceSaveInterfaceName({
          serial_no: this.serial_no,
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
            this.getItemTypesForTree()
          }
        })
    },
    handleClose(done) {
      done()
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
