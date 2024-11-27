<template>
  <div>
    <el-form
      class="padding20X paddingX20 padding-bottom10"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="管理中心" prop="module_id">
        <el-select class="width100" v-model="form.module_id">
          <el-option
            v-for="item in moduleList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="role_name" label="角色名称">
        <el-input class="width100" placeholder="请输入角色名称" v-model="form.role_name"></el-input>
      </el-form-item>

      <el-form-item prop="enabled" label="选项">
        <el-switch v-model="form.enabled" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item prop="description" label="描述">
        <el-input
          class="width100"
          type="textarea"
          :rows="5"
          placeholder="请输入描述"
          :maxlength="50"
          v-model="form.description"
          clearable
        ></el-input>
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
  props: ['serial_no', 'moduleList'],
  computed: {
    isEdit() {
      return !!this.serial_no
    }
  },
  data() {
    return {
      loading: true,
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      form: {
        module_id: '',
        role_name: '',
        enabled: '',
        description: '',
      }
    };
  },
  created() {
    if (this.isEdit) {
      this.$apis
        .getBaseRoleDetail({
          serial_No: this.serial_no,
          _: +new Date()
        })
        .then(res => {
          if (res) {
            let resItem = res
            for (let key in this.form) {
              if (key in resItem) {
                this.form[key] = resItem[key];
              }
            }
          } else {
            this.$message({
              message: '获取角色信息失败',
              type: 'error'
            });
          }
        })
    }
  },
  methods: {

    onCancel() {
      this.$emit("onCancel");
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let module_name = ''
          this.moduleList.forEach(item => {
            if (this.form.module_id === item.serial_no) {
              module_name = item.module_name;
            }
          });
          this.$apis
            .saveBaseRole({
              serial_no: this.serial_no,
              module_name,
              ...this.form
            })
            .then(res => {
              if (res.state === 'success') {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$emit("onSubmit");
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

