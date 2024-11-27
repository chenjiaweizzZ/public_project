<template>
  <el-dialog
    :title="this.data?'修改服务内容':'新增服务内容'"
    :visible.sync="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-esc="false"
    @close="$emit('update:show', false)"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="服务内容" prop="packageCode">
        <el-select
          v-model="form.packageCode"
          value-key="Value"
          @change="onSelectDept"
          placeholder="服务内容"
        >
          <el-option
            v-for="item in $parent.PackageTypeList"
            :key="item.deviceTypeCode"
            :value="item.deviceTypeCode"
            :label="item.deviceType"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="科室" prop="deptCode">
        <el-select
          v-model="form.deptCode"
          value-key="Value"
          @change="onSelectDept"
          placeholder="科室"
        >
          <el-option
            v-for="item in $parent.deptOptions"
            :key="item.serialNo"
            :value="item.serialNo"
            :label="item.deptName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期(天)" prop="validityDay">
        <el-input-number :min="1" :max="9999" v-model="form.validityDay" placeholder="有效期(天)"></el-input-number>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number :min="0" :max="99999999" v-model="form.price" placeholder="价格(元)"></el-input-number>
      </el-form-item>
      <el-form-item label="折扣启用" prop="discountState">
        <el-switch v-model="form.discountState"></el-switch>
      </el-form-item>
      <el-form-item
        v-if="form.discountState"
        label="折扣价格(元)"
        prop="discountPrice"
        :rules="{required: true, message: '请输入折扣价格', trigger: 'blur'}"
      >
        <el-input-number :min="0" v-model="form.discountPrice" placeholder="折扣价格(元)"></el-input-number>
      </el-form-item>
      <el-form-item v-if="form.discountState" label="折扣有效期" required>
        <el-col :span="11">
          <el-form-item
            prop="discountStartDatetime"
            :rules="{required: true, message: '请选择折扣时间', trigger: 'change'}"
          >
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="form.discountStartDatetime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="text-align: center" class="line" :span="2">~</el-col>
        <el-col :span="11">
          <el-form-item
            prop="discountEndDatetime"
            :rules="{required: true, message: '请选择折扣时间', trigger: 'change' }"
          >
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="form.discountEndDatetime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="服务内容" prop="packageContent">
        <el-input
          type="textarea"
          v-model="form.packageContent"
          placeholder="备注"
          show-word-limit
          :maxlength="150"
        ></el-input>
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
    show: Boolean,
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    },
  },
  created() {
    if (this.data) {
      this.form = { ...this.data }
    }
  },
  data() {
    return {
      dialogVisible: this.show,
      form: {
        packageName: null,
        packageCode: null,
        packageContent: null,
        deptName: null,
        deptCode: null,
        state: true,
        validityDay: null,
        discountState: null,
        price: null,
        discountPrice: null,
        discountStartDatetime: null,
        discountEndDatetime: null,
        updateDatetime: null,
        updateUser: null,
        createDatetime: null,
        createUser: null,
      },
      rules: {
        packageCode: [
          { required: true, message: '请输入服务内容名称', trigger: 'change' },
        ],
        deptCode: [
          { required: true, message: '请选择科室', trigger: 'change' },
        ],
        validityDay: [
          { required: true, message: '请输入有效期', trigger: 'blur' },
        ],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.form.discountStartDatetime > this.form.discountEndDatetime) {
            let transit
            transit = this.form.discountStartDatetime
            this.form.discountStartDatetime = this.form.discountEndDatetime
            this.form.discountEndDatetime = transit
          }
          for (let i in this.$parent.PackageTypeList) {
            if (
              this.$parent.PackageTypeList[i].deviceTypeCode ==
              this.form.packageCode
            ) {
              this.form.packageName = this.$parent.PackageTypeList[i].deviceType
            }
          }
          for (let j in this.$parent.deptOptions) {
            if (this.$parent.deptOptions[j].serialNo == this.form.deptCode) {
              this.form.deptName = this.$parent.deptOptions[j].deptName
            }
          }

          let form = {
            ...this.form,
            hospitalId: this.$global.hospital_id,
          }
          this.$apis.savePackage(form).then((res) => {
            if (res) {
              this.$message.success('成功')
            } else {
              this.$message({
                message: '操作失败',
                type: 'warning',
              })
            }
            this.dialogVisible = false
            this.$parent.onSearch()
          })
        }
      })
    },
    onSelectDept(v) {
      let obj = this.$parent.deptOptions.find((item) => {
        return (item.Value = v)
      })
      this.form.DEPT_NAME = obj && obj.Text
    },
  },
}
</script>