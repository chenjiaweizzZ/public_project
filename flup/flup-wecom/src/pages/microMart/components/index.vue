<template>
  <div class="health-management-package">
    <div class="title">
      <p>健康管理套餐</p>
      <img src="@/assets/img/refresh.png" alt />
    </div>
    <div class="list">
      <div v-for="item in list" class="item" @click="addClick"></div>
      <!-- <div v-for="(item, index) in newArr" :key="index" class="list">
        <div v-for="(item, index1) in item" :key="index1" class="item"></div>
      </div> -->
    </div>
  </div>
  <div class="partner-package">
    <div class="title">
      <p>合作伙伴套餐</p>
      <img src="@/assets/img/refresh.png" alt />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const list = ref([
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
]);
const newArr = ref([]);
const len = Math.ceil(list.value.length / 2);
for (let i = 0; i < len; i++) {
  newArr.value.push(list.value.slice(i * 2, (i + 1) * 2));
}
const addClick = () => {
  router.push("/layout/microMart/detail");
};
</script>
<style lang="scss" scoped>
.health-management-package,
.partner-package {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 20px;
    }
    img {
      height: 20px;
      width: 20px;
    }
  }
  .list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 150px;
      height: 150px;
      background-color: pink;
    }
  }
}
</style>
