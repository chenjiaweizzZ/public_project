<template>
  <div>
    <p>健康管理</p>
    <!-- <van-button type="primary" @click="addClick">弹窗</van-button>
    <van-dialog v-model:show="show1" title="增加健管计划"> </van-dialog>
    <van-dialog v-model:show="show2" title="健管计划查看">
      <div style="display: flex; padding: 0 10px">
        <div><span>计划类型</span><span>健康宣教</span></div>
        <div><span>计划发送时间</span><span>2023-06-01 09:12:21</span></div>
      </div>
      <div style="padding: 0 10px">
        <span>计划发送人</span><span>刘三七</span>
      </div>
      <div style="padding: 0 10px">
        <span>内容</span>

      </div>
    </van-dialog> -->
  </div>
</template>
<script setup>
import { ref } from "vue";
const show1 = ref(false);
const show2 = ref(true);
const addClick = () => {};
</script>
<style lang="scss" scoped></style>
