<template>
  <div>
    <el-form
      class="padding20X paddingX20 padding-bottom10"
      ref="form"
      :model="form"
      label-width="110px"
      v-loading="loading"
    >
      <el-form-item v-if="menuId===''" prop="parentt_id" label="上级">
        <el-input placeholder="请选择上级" v-model="fatherName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-else prop="parent_id" label="上级">
        <el-select placeholder="请选择上级" v-model="form.parent_id">
          <el-option v-for="item in parentList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="interface_name" label="名称">
        <el-input placeholder="请输入名称" v-model="form.interface_name"></el-input>
      </el-form-item>
      <el-form-item prop="input_parameters" label="入参">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 , maxRows:5}"
          v-model="form.input_parameters"
        ></el-input>
      </el-form-item>
      <el-form-item prop="output_parameters" label="出参">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 , maxRows:5}"
          v-model="form.output_parameters"
        ></el-input>
      </el-form-item>
      <el-form-item label="api平台" prop="api_plat">
        <el-select v-model="form.api_plat" placeholder="请选择">
          <el-option label="家庭好医" value="201709191126040206fa"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="api_name" label="api_name">
        <el-input placeholder="请输入api_name" v-model="form.api_name"></el-input>
      </el-form-item>
      <el-form-item prop="api_name_mapping" label="api_mapping">
        <el-input placeholder="请输入api_name_mapping" v-model="form.api_name_mapping"></el-input>
      </el-form-item>
      <el-form-item prop="enabled" label="选项">
        <el-checkbox true-label="1" false-label="0" v-model="form.enabled">有效</el-checkbox>
      </el-form-item>
      <el-form-item prop="description" label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3 , maxRows:5}" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <el-row class="dialog-footer" type="flex" justify="end">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'plan_form',
  props: ['fatherId', 'fatherName', 'serial_no', 'menuId'],
  data() {
    return {
      loading: false,
      parentList: [],
      form: {
        parent_id: this.fatherId,
        interface_name: '',
        input_parameters: '',
        output_parameters: '',
        api_plat: '',
        api_name: '',
        api_name_mapping: '',
        enabled: '1',
        description: '',
      },
    }
  },
  created() {
    if (this.menuId !== '') {
      this.loading = true
      this.$apis.InterfaceGetInterfacesForSelect({}).then((res) => {
        this.parentList = res
        this.parentList.unshift({
          id: '0',
          text: '父节点',
        })
        this.form.parent_id = this.menuId
        this.loading = false
      })
    }
    if (this.serial_no) {
      this.loading = true
      this.$apis
        .InterfaceGetInterfaceBySerialNo({
          serial_No: this.serial_no,
        })
        .then((res) => {
          this.form.interface_name = res.interface_name
          this.form.input_parameters = res.input_parameters
          this.form.output_parameters = res.output_parameters
          this.form.api_plat = res.api_plat
          this.form.api_name = res.api_name
          this.form.api_name_mapping = res.api_name_mapping
          this.form.enabled = res.enabled
          this.form.description = res.description
          this.loading = false
        })
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('onSubmit', this.form)
        }
      })
    },
  },
}
</script>

<style scoped>
</style>
