<template>
  <div class="docIntroduce">
    <img :src="closeBtn" class="docIntroduce-close" @click="close">
    <div class="docIntroduce-title">{{ doctorInfo.doctorName }}医生简介</div>
    <div class="docIntroduce-container">
      <div class="docIntroduce-title2">
        <img :src="defaultGoodat">
        <span class="docIntroduce-title2-text">擅长</span>
      </div>
      <div class="docIntroduce-desc">
        {{ doctorInfo.excel }}
      </div>
      <div class="docIntroduce-title2">
        <img :src="defaultIntroduce">
        <span class="docIntroduce-title2-text">简介</span>
      </div>
      <div class="docIntroduce-desc">
        {{ doctorInfo.introduction }}
      </div>
    </div>

  </div>
</template>
  
  <script>
import close from "@/assets/images/Doctor/close.png";
import goodatL0go from "@/assets/images/Doctor/goodat-logo.png";
import introduceL0go from "@/assets/images/Doctor/introduce-logo.png";
export default {
  props: {
    doctorInfo: {
      type: Object,
    }
  },
  data() {
    return {};
  },
  computed: {
    closeBtn() {
      return close;
    },
    defaultGoodat() {
      return goodatL0go;
    },
    defaultIntroduce() {
      return introduceL0go;
    },
  },
  created() {},
  methods: {
    close() {
      this.$emit("closeOverlay");
    },
  },
};
</script>
  
  <style scoped lang="scss">
.docIntroduce {
  position: fixed;
  top: 119px;
  left: 15px;
  right: 15px;
  bottom: 173px;
  background: linear-gradient(0deg, #ffffff 64%, #e7ffee 100%);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 15px 12px;
  display: flex;
  flex-direction: column;
  &-container {
    width: calc(100%);
    height: calc(100%);
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    flex: 1;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  &-container:-webkit-scrollbar {
    display: none;
  }
  &-close {
    position: absolute;
    bottom: -80px;
    left: 50%;
    transform: translate(-50%, 0);
    height: 30px;
  }
  &-title {
    text-align: center;
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #111111;
    margin-bottom: 17px;
    height: 30px;
  }
  &-title2 {
    display: flex;
    align-items: center;
    margin-bottom: 9px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    &-text {
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.19px;
      color: #111111;
      word-break: break-all;
    }
  }
  &-desc {
    font-size: 15px;
    font-weight: normal;
    letter-spacing: 0.17px;
    color: #111111;
    margin-bottom: 20px;
    word-break: break-all;
  }
}
</style>