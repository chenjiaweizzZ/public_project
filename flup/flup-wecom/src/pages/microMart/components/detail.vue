<template>
  <div class="package-detail">
    <div class="title">
      <img @click="addClick" src="@/assets/img/refresh.png" alt />
      <p>幽门螺杆菌C14吹气</p>
    </div>
    <el-form>
      <el-form-item label="就诊医院">
        <p>浙大二院</p>
      </el-form-item>
      <el-form-item label="就诊地点">
        <p>文一西路988号</p>
      </el-form-item>
      <el-form-item label="适用人群">
        <p>全年龄段</p>
      </el-form-item>
      <el-form-item label="适用性别">
        <p>男女通用</p>
      </el-form-item>
      <el-form-item label="有效期">
        <p>2024-12-31</p>
      </el-form-item>
      <el-form-item label="说明">
        <p>自备水一瓶，需要服药后检测</p>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input autosize v-model="textarea" type="textarea" />
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="sending">发送至患者</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const textarea = ref(
  "幽门螺杆菌感染是胃癌的发病高危因素之一，所以一旦感染幽门螺杆菌，要正规治疗，彻底清除体内幽门螺杆菌。但并不是所有幽门螺杆菌感染患者，都要得癌症。就像吸烟、酗酒增加患病风险一样。所以幽门螺杆菌感染者也不要过分担忧。幽门螺杆菌感染，传染途径：粪-口；口-口。注意饮食卫生，定期消毒餐具及更换牙刷。停药4周后复查幽门螺杆菌。"
);
const addClick = () => {
  router.back();
};
const sending = () => {};
</script>
<style lang="scss" scoped>
.package-detail {
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      cursor: pointer;
      height: 20px;
      width: 20px;
    }
    p {
      margin-left: 20px;
      font-size: 20px;
      font-weight: 700;
    }
  }
  .footer {
    position: fixed;
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: right;
    background-color: #ccc;
    bottom: 0;
    left: 0;
  }
}
</style>
