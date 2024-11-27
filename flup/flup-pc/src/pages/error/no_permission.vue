<template>
  <div class="error-page">
    <h1>无权访问</h1>
    <p>{{this.$route.query.message || '对不起，您没有权限查看该页面。'}}</p>
  </div>
</template>

<style lang="scss">
.error-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  h1 {
    margin-top: 200px;
  }
}
</style>