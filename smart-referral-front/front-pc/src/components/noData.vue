<template>
  <div class="nodata">
    <img :src="nodata"/>
    暂无数据
  </div>
</template>
<script setup>
import nodata from "@/assets/image/nodata.png"
</script>
<style lang="scss" scoped>
.nodata {
  display: flex;
  flex-flow: column;
  align-items: center;
  img {
    width: 180px;
    height: 160px;
  }
}
</style>
