<template>
  <el-dialog
    title="拒绝理由"
    :visible.sync="isrefuse"
    width="348px"
    :close-on-press-esc="false"
    class="refuse"
    :before-close="handleCloseRefuse"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label-width="0"
        prop="name"
        :rules="[
          {
            required: true,
            message: '请输入拒绝理由',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          class="input"
          v-if="isrefuse"
          type="textarea"
          :rows="2"
          v-model.trim="ruleForm.name"
          placeholder="请输入拒绝理由"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleCloseRefuse">取 消</el-button>
      <el-button type="primary" @click="subRefuse" style="min-width: 60px"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    serialNo: {
      type: String,
      default: "",
    },
    type:{
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      isrefuse: false,
      ruleForm: {
        name: "",
      },
    };
  },
  methods: {
    handleCloseRefuse() {
      this.ruleForm.name = "";
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate();
        this.isrefuse = false;
      }, 50);
    },
    subRefuse() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          await this.$apis.authApply({
            authState: 2,
            remark: this.ruleForm.name,
            serialNo: this.serialNo,
            type: this.type,
          });
          this.handleCloseRefuse();
          this.$emit("submit");
        }
      });
    },
  },
};
</script>