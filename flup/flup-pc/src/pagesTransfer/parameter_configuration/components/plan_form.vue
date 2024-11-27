<template>
  <div>
    <el-form
      class="padding20X paddingX20 padding-bottom10"
      ref="form"
      :model="form"
      label-width="110px"
      v-loading="loading"
    >
      <el-form-item prop="parameterTypeName" label="名称">
        <el-input placeholder="请输入名称" v-model="form.parameterTypeName"></el-input>
      </el-form-item>
      <el-form-item prop="parameterTypeCode" label="编码">
        <el-input placeholder="请输入" v-model="form.parameterTypeCode"></el-input>
      </el-form-item>
      <el-form-item prop="enabled" label="选项">
        <el-checkbox true-label="1" false-label="0" v-model="form.enabled">启用</el-checkbox>
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
  props: [
    'description',
    'parameterTypeCode',
    'serialNo',
    'parameterTypeName',
    'enabled'
  ],
  data() {
    return {
      loading: false,
      parentList: [],
      form: {
        parameterTypeName: null,
        parameterTypeCode: null,
        enabled: '1',
        description: '',
        serialNo: null
      }
    }
  },
  created() {
    if (this.serialNo) {
      this.form.parameterTypeName = this.parameterTypeName
      this.form.parameterTypeCode = this.parameterTypeCode
      this.form.description = this.description
      this.form.serialNo = this.serialNo
      this.form.enabled = this.enabled
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('onSubmit', this.form)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
