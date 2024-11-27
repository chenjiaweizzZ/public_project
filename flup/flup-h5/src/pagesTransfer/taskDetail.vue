<template>
  <section ref="section" class="taskDetail">
    <div class="taskTop">
      <p>{{ title }}</p>
      <span>{{ flupStartTime }}</span>
    </div>
    <div class="taskContent">
      <div class="taskTitle">
        <p>内容</p>
      </div>
      <div class="taskInfo">
        <iframe
          style="height: calc(100vh - 200px)"
          :src="flupAddress"
          width="100%"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      flupStartTime: "",
      flupAddress: ""
    };
  },
  async created() {
    this.title = this.$route.query.title;
    this.flupStartTime = this.$route.query.flupStartTime;
    this.flupAddress = this.$route.query.flupAddress;
  },
  methods: {
    onConfirm() {
      this.showPicker = false;
      this.fieldValue = selectedOptions[0].text;
    }
  }
};
</script>
<style lang="scss" scoped>
.taskDetail {
  position: relative;
  .taskTop {
    padding: 0 20px;
    padding-bottom: 80px;
    background: url("../assets/images/taskTopBg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    p {
      margin: 24px 0 12px;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.25px;
      color: #ffffff;
    }
    span {
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.17px;
      color: #ffffff;
    }
  }
  .taskContent {
    margin-top: -43px;
    padding-top: 23px;
    border-radius: 24px 24px 0px 0px;
    background: #ffffff;
    .taskTitle {
      padding-bottom: 10px;
      border-bottom: 1px solid #c6c9ce;
      p {
        position: relative;
        padding: 0 28px;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.2px;
        color: #333333;
        &::before {
          content: "";
          display: block;
          width: 3px;
          height: 16px;
          border-radius: 1.5px;
          background: #32ae57;
          position: absolute;
          top: 1px;
          left: 14px;
        }
      }
    }
    .taskInfo {
      margin-bottom: 8px;
      padding: 17px 3.75%;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.2px;
      color: #111111;
    }
  }
}
</style>
