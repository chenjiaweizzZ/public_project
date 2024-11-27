<template>
  <!-- 解决element-plus显示中文问题 -->
  <el-config-provider :locale="zhCn">
    <Suspense>
      <router-view />
    </Suspense>
  </el-config-provider>
</template>
<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style lang="scss" scoped></style>
