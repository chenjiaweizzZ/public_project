<template>
  <div class="followup-dept">
    <operationHeader class="margin-bottom20">
      <div class="label">所属医院</div>
      <el-select class="width200 value" v-model="hospitalId" placeholder="所属医院" @change="onSearch">
        <el-option
          v-for="item in hospitalList"
          :key="item.serial_no"
          :value="item.serial_no"
          :label="item.hospital_name"
          :disabled="item.serial_no!==$global.hospital_id"
        ></el-option>
      </el-select>
      <div class="label">是否随访科室</div>
      <el-select
        class="width200 value"
        v-model="queryDto.flupDepartment"
        placeholder="科室"
        @change="onSearch"
      >
        <el-option
          v-for="item in deptTypeList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <div class="label">搜索</div>
      <el-input
        class="limiting width280px value"
        v-model="queryDto.keyword"
        placeholder="请输入手机科室名称或代码"
        @keyup.enter.native="onSearch"
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
      </el-input>
      <el-button
        class="margin-left50"
        type="info"
        icon="el-icon-refresh"
        @click="getsyncdept"
        :disabled="hospitalId!=$global.hospital_id"
      >同步</el-button>
      <el-button
        class="margin-left30"
        type="primary"
        @click="increaseDeptForm"
        v-if="CanEditDepartment"
      >新增</el-button>
    </operationHeader>
    <el-table
      ref="table"
      style="margin-bottom:60px"
      class="margin-top20"
      :data="mainList"
      highlight-current-row
      border
      stripe
    >
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="deptName" label="科室">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;">
            {{scope.row.deptName}}&emsp;
            <span
              v-if="scope.row.updateStatus ==0 "
              style="color: #999;"
            >(更新失败)</span>
            &ensp;
            <el-tooltip v-if="scope.row.updateStatus ==0 " placement="top">
              <div slot="content">用户中心科室信息已删除，本系统中仍正在使用</div>
              <img style="width: 15px;height: 15px;" src="~@/assets/images/yw.png" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="deptCode" label="科室代码"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="科室电话"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="description" label="科室简介"></el-table-column>
      <el-table-column prop="description" label="操作" v-if="CanEditDepartment">
        <template slot-scope="scope">
          <el-button @click.stop="onEdit(scope.row)" type="text">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-size="pageSize"
      :current-page.sync="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog title="编辑科室信息" :visible.sync="dialogFormVisible">
      <el-form :model="rowObj" ref="rowObj">
        <el-form-item
          label="科室名称"
          :label-width="formLabelWidth"
          prop="deptName"
          :rules="[{required: true, message: '科室名不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="rowObj.deptName"></el-input>
        </el-form-item>
        <el-form-item
          label="科室代码"
          :label-width="formLabelWidth"
          prop="deptCode"
          :rules="[{required: true, message: '科室代码不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="rowObj.deptCode"></el-input>
        </el-form-item>
        <el-form-item label="科室类型" :label-width="formLabelWidth">
          <el-select v-model="rowObj.sourceId" placeholder="选择科室类型" clearable>
            <el-option label="门诊" value="门诊"></el-option>
            <el-option label="住院" value="住院"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访科室" :label-width="formLabelWidth">
          <el-select v-model="judgeFlupDept" placeholder="是否为随访科室" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访科室" :label-width="formLabelWidth">
          <el-checkbox v-model="checked">启用</el-checkbox>
        </el-form-item>
        <el-form-item label="机构介绍" :label-width="formLabelWidth">
          <el-input v-model="rowObj.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryDto: {
        keyword: null,
        flupDepartment: '1',
      },
      total: 0,
      pageNo: 1,
      pageSize: 10,
      hospitalId: this.$global.hospital_id,
      mainList: [],
      hospitalList: [],
      deptTypeList: [
        { label: '随访科室', value: '1' },
        { label: '非随访科室', value: '0' },
      ],
      dialogVisible: false,
      dailogData: '',
      dialogFormVisible: false, //编辑表单的状态
      formLabelWidth: '120px',
      checked: false,
      rowObj: {
        //一个空对象用来暂时存储传来的科室对象
        createTime: '',
        deptCode: '', //科室代码
        deptName: '', //科室名称
        deptPinyin: '',
        deptType: null,
        deptTypeCode: null,
        description: '',
        enabled: '', //随访科室是否启用
        hospitalId: '',
        isFlupDept: null, //是否是随访科室
        isFullFlup: null,
        parentDeptId: null,
        parentDeptName: null,
        patientAreaIds: null,
        patientAreaNames: null,
        phone: '',
        serialNo: '',
        sourceId: null, //科室类型
        updateTime: '',
      }, //编辑的行对象
      rowCopy: {},
      judgeFlupDept: null, //是否为随访科室的判断值,将1/0转换成是/否
      increaseDialogFormVisible: false,
      CanEditDepartment: null, //判断编辑科室按钮是否出现
    }
  },
  async created() {
    this.$startLoading()
    await this.$apis.hospitalgetAllHospitals().then((res) => {
      this.hospitalList = res
    })
    await this.getMainList()
    this.$stopLoading()
    //编辑科室按钮是否出现

    this.$apis
      .queryFlupConfigOne({
        hospitalId: this.hospitalId,
        moduleCode: 'followUpSetting',
        componentKey: 'CanEditDepartment',
      })
      .then((res) => {
        if (res.componentValue == '1') {
          this.CanEditDepartment = true
        } else {
          this.CanEditDepartment = false
        }
      })
    // this.$apis
    //   .getByParameterKeyNoCache({ parameterKey: 'CanEditDepartment' })
    //   .then((res) => {
    //     if (res.parameterValue == '1') {
    //       this.CanEditDepartment = true
    //     } else {
    //       this.CanEditDepartment = false
    //     }
    //   })
  },
  methods: {
    getsyncdept() {
      this.$apis.syncdept().then((res) => {
        if (Number(res) >= 0) {
          this.$message({
            message: '同步成功',
            type: 'success',
          })
          this.pageNo = 1
          this.getMainList()
        }
      })
    },
    onSearch() {
      this.pageNo = 1
      this.getMainList()
    },
    getMainList() {
      this.$apis
        .departmentquery({
          ...this.queryDto,
          hospitalId: this.hospitalId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getMainList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getMainList()
    },
    //编辑按钮事件
    onEdit(row) {
      //刷新dialog
      if (this.$refs['rowObj']) {
        this.$refs['rowObj'].resetFields()
      }
      this.increaseDialogFormVisible = false
      ;(this.rowObj.deptCode = row.deptCode),
        (this.rowObj.deptName = row.deptName),
        (this.rowObj.description = row.description),
        (this.rowObj.enabled = row.enabled),
        (this.rowObj.hospitalId = row.hospitalId),
        (this.rowObj.isFlupDept = row.isFlupDept),
        (this.rowObj.serialNo = row.serialNo),
        (this.rowObj.sourceId = row.sourceId),
        (this.rowObj.deptType = row.deptType)
      this.dialogFormVisible = true
      if (row.enabled == 1) {
        this.checked = true
      } else {
        this.checked = false
      }
      if (row.isFlupDept == 1) {
        this.judgeFlupDept = '1'
      } else {
        this.judgeFlupDept = '0'
      }
      this.rowCopy = row
    },
    //编辑确定按钮
    editConfirm(rowObj) {
      //increaseDialogFormVisible用来判断该dialog是新增科室还是编辑科室
      if (this.increaseDialogFormVisible == true) {
        this.dialogFormVisible = false
        this.increaseDialogFormVisible = false
        this.increaseDept()
        return false
      } else {
        //当科室名称或科室代码为空时不能通过点击确定按钮关闭dialog
        if (this.$refs['rowObj']) {
          this.$refs['rowObj'].validate((valid) => {
            if (valid) {
              if (this.checked == true) {
                this.rowObj.enabled = 1
              } else {
                this.rowObj.enabled = 0
              }

              if (this.judgeFlupDept == '1') {
                this.rowObj.isFlupDept = 1
              } else {
                this.rowObj.isFlupDept = 0
              }
              this.rowCopy.deptCode = this.rowObj.deptCode
              this.rowCopy.deptName = this.rowObj.deptName
              this.rowCopy.description = this.rowObj.description
              this.rowCopy.enabled = this.rowObj.enabled
              this.rowCopy.hospitalId = this.hospitalId
              this.rowCopy.isFlupDept = this.rowObj.isFlupDept
              this.rowCopy.serialNo = this.rowObj.serialNo
              this.rowCopy.sourceId = this.rowObj.sourceId
              this.rowCopy.deptType = this.rowObj.deptType
              this.$apis
                .editDept({
                  deptCode: this.rowCopy.deptCode, //必填
                  deptName: this.rowCopy.deptName, //必填
                  description: this.rowCopy.description,
                  enabled: this.rowCopy.enabled, //必填
                  hospitalId: this.hospitalId, //必填字段
                  isFlupDept: this.rowCopy.isFlupDept, //必填字段
                  serialNo: this.rowCopy.serialNo,
                  sourceId: this.rowCopy.sourceId, //必填
                })
                .then((res) => {
                  this.getMainList()
                })
              this.dialogFormVisible = false
            } else {
              return false
            }
          })
        }
        this.increaseDialogFormVisible = false
        //刷新页面
        this.getMainList()
      }
    },
    //新增科室函数
    increaseDept() {
      //如果科室名称和科室代码为空则无法提交
      if (this.$refs['rowObj']) {
        this.$refs['rowObj'].validate((valid) => {
          if (valid) {
            if (this.checked == true) {
              this.rowObj.enabled = 1
            } else {
              this.rowObj.enabled = 0
            }
            if (this.judgeFlupDept == '1') {
              this.rowObj.isFlupDept = 1
            } else {
              this.rowObj.isFlupDept = 0
            }
            this.$apis
              .editDept({
                deptCode: this.rowObj.deptCode,
                deptName: this.rowObj.deptName,
                description: this.rowObj.description,
                enabled: this.rowObj.enabled,
                hospitalId: this.hospitalId,
                isFlupDept: this.rowObj.isFlupDept,
                serialNo: '',
                sourceId: this.rowObj.sourceId,
              })
              .then((res) => {
                this.getMainList()
              })
          } else {
            this.dialogFormVisible = true
            this.increaseDialogFormVisible = true
            return false
          }
        })
      } else {
        return false
      }
    },
    //新增按钮事件
    increaseDeptForm() {
      //点击新增按钮清空dialog
      for (var index in this.rowObj) {
        this.rowObj[index] = null
      }
      this.judgeFlupDept = null
      this.dialogFormVisible = true
      this.increaseDialogFormVisible = true
    },
  },
}
</script>

<style lang="scss">
.followup-dept {
  padding: 0px 20px 20px 20px;
}
</style>