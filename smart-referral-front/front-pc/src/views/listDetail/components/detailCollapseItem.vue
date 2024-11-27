<template>
  <div class="detail-collapse-item">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="1" :disabled="disabled">
        <template #title>
          {{ title }}
          <span v-if="must" class="must">*</span>
          <div v-if="isShow" class="total">
            {{ `共${total}条` }}
          </div>
        </template>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import { ref } from "vue";
const activeNames = ref(["1"]);
defineProps({
  title: {
    type: String,
    default: "",
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  must: {
    type: Boolean,
    default: false
  }
});
</script>
<style lang="scss" scoped>
.detail-collapse-item {
  margin-bottom: 20px;
  .total {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    border-radius: 14px;
    background: #ffe7db;
    font-size: 14px;
    color: #ff7b35;
    padding: 5px 12px;
    margin-left: 20px;
  }
  .must {
    color: #f56c6c;
  }
  
}
</style>
<style lang="scss">
.detail-collapse-item {
  margin-bottom: 20px;
  .el-collapse-item__header {
    padding-left: 20px;
    color: #333333;
    font-weight: 800;
    font-size: 16px;
    border: 1px solid #e6e6e6;
  }

  .el-collapse-item__wrap {
    padding: 20px;
    border: 1px solid #e6e6e6 !important;
    .el-collapse-item__content {
      padding: 0 !important;
    }
  }

  .el-collapse-item.is-disabled .el-collapse-item__header {
    color: #333333;
  }
}
</style>
