<template>
  <section class="operation-header">
    <el-row type="flex" align="middle">
      <slot></slot>
    </el-row>
    <el-row type="flex" align="middle">
      <slot name="right"></slot>
    </el-row>
  </section>
</template>

<style lang="scss">
.operation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  padding: 16px 20px;
  .label {
    color: #333;
  }
  .label + .value {
    margin-left: 14px;
  }
  .value + .label {
    margin-left: 30px;
  }
}
</style>
