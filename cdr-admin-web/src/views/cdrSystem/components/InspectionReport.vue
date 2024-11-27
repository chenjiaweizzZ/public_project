<!--入院记录-->
<template>
  <div class="case-history-hcj jcbg-container">
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">检查所见</div>
          <div class="value">{{formData.jcsj}}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">检查结论</div>
          <div class="value">{{formData.jcjl}}</div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style scoped lang="scss">
.jcbg-container {
  border: 1px solid #D7DAE0;
  padding: 24px 36px;
  margin-bottom: 200px;
}
</style>
