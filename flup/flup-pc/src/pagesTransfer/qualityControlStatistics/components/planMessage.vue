<template>
  <div class="plan-message" @click="seeDetail">
    <div class="text-message my-text">
      <div class="header">
        <div class="title">{{ message.content.data.taskType }}</div>
        <img style="width: 16px;height: 16px;" v-if="message.content.data.taskType == '健康宣教' || message.content.data.taskType == '调查问卷'" src="../../../assets/images/right-gray.png" alt="">
      </div>
      <div class="plan-message">
        <div style="word-break: break-all;">
          {{ message.content.data.planContent }}
        </div>
      </div>
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
      if(this.message.content.data.taskType == '消息提醒') return
      this.$emit("seeDetail",{
        url: `${this.message.content.data.url}&isHideSubmit=true`
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.plan-message {
  .text-message {
    width: 234px;
    background: linear-gradient(0deg, #ffffff 35%, #e6ffea 100%);
  }

  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    align-items: center;
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
    color: #00982d;
  }

  .header image {
    width: 12px;
    height: 12px;
  }

  .plan-message {
    padding: 12px;
  }

  .plan-message .title {
    cursor: pointer;
    font-size: 14px;
    letter-spacing: 0.2px;
    color: #333333;
  }
}
</style>
