<!--
 @description 刷新公共组件
 @author 刘晨明
 -->
<template>
  <div class="icon-refresh" @click="handleRefreshIconClick">
    <img
      src="../assets/img/refresh.png"
      alt
      :style="{ transform: `rotate(${360 * clickCount}deg)` }"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
let clickCount = ref(1);
const emit = defineEmits(["refresh"]);
const handleRefreshIconClick = () => {
  clickCount.value++;
  emit("refresh");
};
</script>

<style lang="scss" scoped>
.icon-refresh {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 20px;
  img {
    width: 20px;
    height: 20px;
    transition: 0.3s linear;
  }
}
</style>
