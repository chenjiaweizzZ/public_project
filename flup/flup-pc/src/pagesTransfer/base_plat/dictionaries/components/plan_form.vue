<template>
  <div>
    <el-form class="padding20X paddingX20 padding-bottom10" ref="form" :rules="rules" :model="form" label-width="90px" v-loading="loading">
      <el-form-item v-if="menuId===''" prop="parentt_id" label="上级">
        <el-input placeholder="请选择上级" v-model="fatherName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-else prop="parent_id" label="上级">
        <el-select placeholder="请选择上级" v-model="form.parent_id">
          <el-option v-for="item in parentList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="dict_name" label="名称">
        <el-input :disabled="serial_no?true:false" placeholder="请输入字典名称" v-model="form.dict_name" :maxlength="15" show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="dict_code" label="编号">
        <el-input :disabled="serial_no?true:false" placeholder="请输入字典编号" v-model="form.dict_code" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="dict_sort" label="排序">
        <el-input placeholder="请输入序号" v-model="form.dict_sort" type="Number"></el-input>
      </el-form-item>
      <el-form-item prop="enabled" label="选项">
        <el-checkbox true-label="1" false-label="0" v-model="form.enabled">启用</el-checkbox>
      </el-form-item>
      <el-form-item prop="description" label="备注">
        <el-input type="textarea" resize="none" placeholder="请输入备注" :autosize="{ minRows: 3 , maxRows:5}" v-model="form.description"></el-input>
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
      rules: {
        parent_id: [{ required: true, message: '请选择上级', trigger: 'blur' }],
        dict_name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dict_code: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
        dict_sort: [{ required: false, message: '请输入字典排序', trigger: 'blur' }],
        enabled: [{ required: false, messsage: '请选择是否有效', trigger: 'blur' }],
        description: [{ required: false, message: '请输入备注', trigger: 'blur' }],
      },
      form: {
        parent_id: this.fatherId,
        dict_name: '',
        dict_code: '',
        dict_sort: '',
        enabled: '1',
        description: '',
      },
    };
  },
  created() {
    if (this.menuId !== '') {
      this.loading = true;
      this.$apis.BaseDictGetItemTypesForTree({}).then((res) => {
        this.parentList = res;
        this.parentList.unshift({
          id: '0',
          text: '父节点',
        });
        this.form.parent_id = this.menuId;
        this.loading = false;
      });
    }
    if (this.serial_no) {
      this.loading = true;
      this.$apis
        .BaseDictGetDictBySerialNo({
          serial_No: this.serial_no,
        })
        .then((res) => {
          this.form.dict_code = res.dict_code;
          this.form.dict_name = res.dict_name;
          this.form.dict_sort = res.dict_sort;
          this.form.enabled = res.enabled;
          this.form.description = res.description;
          this.loading = false;
        });
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel');
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('onSubmit', this.form);
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
