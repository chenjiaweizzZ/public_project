<!--
 @description 用户信息公共组件
 @author 刘晨明
 -->
<template>
  <div class="userInfo">
    <div class="user-profile">
      <img src="../assets/img/u85.png" alt="" />
    </div>
    <div class="user-detail">
      <div class="detail1">
        <span>流氓爱读书</span>
        <img
          v-if="props.isDetail"
          src="../assets/img/refresh.png"
          @click="seeDetail"
        />
      </div>
      <div><span>男</span><span>30岁</span></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  // 用户详情
  userInfo: {
    type: Object,
    default: {},
  },
  isLabel: {
    type: Boolean,
    default: true,
  },
  isDetail: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["seeDetail"]);
const seeDetail = () => {
  emit("seeDetail");
};
</script>
<style lang="scss" scoped>
.userInfo {
  display: flex;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  .user-profile {
    width: 56px;
    height: 56px;
    margin-right: 20px;
  }
  .user-detail {
    flex: 1;
    .detail1 {
      display: flex;
      justify-content: space-between;
      img {
        height: 20px;
        width: 20px;
      }
    }
  }
}
</style>
