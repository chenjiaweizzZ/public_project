<script setup></script>
<script>
export default {
  name: "",
};
</script>
<template>
  <div class="error-page">
    <h2>无权访问</h2>
    <p>对不起,您没有权限查看该页面。</p>
  </div>
</template>
<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  h2 {
    margin-top: 200px;
  }
}
</style>
