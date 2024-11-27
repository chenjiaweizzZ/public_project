<template>
  <el-dialog
    :title="this.data?'修改科室':'新增科室'"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-esc="false"
    @close="$emit('update:show', false)"
  >
    <el-form class="dialog-dept" ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="所属医院" prop="hospital_id">
        <el-select class="width100" v-model="form.hospital_id" placeholder="所属医院">
          <el-option
            v-for="item in $parent.hospitalList"
            :key="item.serial_no"
            :value="item.serial_no"
            :label="item.hospital_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" prop="dept_name">
        <el-input v-model="form.dept_name" placeholder="科室"></el-input>
      </el-form-item>
      <el-form-item label="科室代码" prop="dept_code">
        <el-input v-model="form.dept_code" placeholder="科室代码"></el-input>
      </el-form-item>
      <el-form-item label="是否是全科">
        <el-radio v-model="form.is_full_flup" :label="1">是</el-radio>
        <el-radio v-model="form.is_full_flup" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="是否是随访">
        <el-radio v-model="form.is_flup_dept" :label="1">是</el-radio>
        <el-radio v-model="form.is_flup_dept" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="科室电话">
        <el-input v-model="form.phone" placeholder="科室电话"></el-input>
      </el-form-item>
      <el-form-item label="科室简介">
        <el-input v-model="form.description" placeholder="科室简介"></el-input>
      </el-form-item>
      <el-form-item label="病区">
        <el-row class="dialog-dept_area" type="flex" v-for="(item,index) in areaList" :key="index">
          <el-input class="flex1" v-model="item.code" placeholder="病区编号"></el-input>
          <el-input
            class="flex1 margin-left10 margin-right10"
            v-model="item.name"
            placeholder="病区名称"
          ></el-input>
          <el-button v-if="index===0" type="text" @click="addArea">添加</el-button>
          <el-button v-else type="text" @click="deleteArea(index)">删除</el-button>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'group-dialog',
  props: {
    data: Object,
    show: Boolean
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    },
  },
  created() {
    if (this.data) {
      this.form = { ...this.data }
      let areaCodeList
      let areaNameList
      try {
        areaCodeList =  this.form.patient_area_ids ? this.form.patient_area_ids.split('|') : []
      } catch (err) {
        areaCodeList = []
      }
      try {
        areaNameList = this.form.patient_area_names ? this.form.patient_area_names.split('|') : []
      } catch (err) {
        areaNameList = []
      }
      let len = areaCodeList.length
      for (let i = 0; i < len; i++) {
        this.areaList.push({ code: areaCodeList[i], name: areaNameList[i] })
      }
    }
    this.areaList.push({ code: '', name: '' })
  },
  data() {
    return {
      dialogVisible: this.show,
      form: {
        hospital_id: '',
        is_flup_dept: 0,
        is_full_flup: 0,
        dept_code: '',
        dept_name: '',
        description: '',
        phone: ''
      },
      areaList: [],
      rules: {
        hospital_id: [
          { required: true, message: '请选择所属医院', trigger: 'change' },
        ],
        dept_code: [
          { required: true, message: '请填写科室代码', trigger: 'blur' },
        ],
        dept_name: [
          { required: true, message: '请填写科室名称', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.areaList.forEach(item => {
            if (!item.code === !!item.name) {
              this.$message.warning('请同时填写病区编号及名称')
              return
            }
          })
          this.form.patient_area_ids = this.areaList.map(item=>item.code).join('|')
          this.form.patient_area_names = this.areaList.map(item=>item.name).join('|')
          this.$apis.saveDept(this.form).then(() => {
            this.$message.success('成功')
            this.dialogVisible = false
            this.$parent.onSearch()
          })
        }
      })
    },
    onSelectDept(v) {
      let obj = this.$parent.deptOptions.find(item => {
        return item.Value = v
      })
      this.form.dept_name = obj && obj.Text
    },
    addArea() {
      this.areaList.push({ code: '', name: '' })
    },
    deleteArea(index) {
      this.areaList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.dialog-dept {
  &_area + &_area {
    margin-top: 10px;
  }
}
</style>