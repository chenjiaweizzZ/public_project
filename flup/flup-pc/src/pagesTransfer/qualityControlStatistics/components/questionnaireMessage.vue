<template>
  <div class="questionnaire-message" @click="seeDetail">
    <div class="header">
      <div class="title">问卷</div>
      <img style="width: 16px;height: 16px;" src="../../../assets/images/right-gray.png" alt="">
    </div>
    <div class="plan-message">
      <div class="title">为了更好的为您服务，请填写问卷相关内容</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      value: {}
    }
  },
  methods:{
    seeDetail(){
      console.log(`${this.message.content.data.url}&isHideSubmit=true`)
      this.$emit("seeDetail",{
        url: `${this.message.content.data.url}&isHideSubmit=true`
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.questionnaire-message {
  width: 234px;
  background: linear-gradient(0deg, #ffffff 35%, #e6ffea 100%);
  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 12px;
  }

  .header::after {
    position: absolute;
    content: "";
    height: 1px;
    bottom: 0;
    left: 12px;
    right: 12px;
    background: #d9e8dd;
  }

  .header .title {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.2px;
    word-break: break-all;
    color: #00982d;
  }

  .header image {
    width: 12px;
    height: 12px;
  }

  .plan-message {
    padding: 12px;
  }
}
</style>
