<template>
  <div class="detail-item">
    <div class="item-header">{{ title }}</div>
    <div class="item-main">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.detail-item {
  margin-bottom: 20px;
  .item-header {
    height: 44px;
    line-height: 44px;
    background: #fbfbfb;
    padding-left: 20px;
    color: #333333;
    font-weight: 800;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
  }
  .item-main {
    padding: 20px;
    border: 1px solid #e6e6e6;
  }
}
</style>
