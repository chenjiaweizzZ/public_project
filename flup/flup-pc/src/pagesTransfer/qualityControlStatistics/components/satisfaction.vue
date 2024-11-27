<template>
  <div class="satisfaction">
    <div class="title" v-if="message.content.data.type == 11">
      {{ attentionText }}
    </div>
    <div class="content">
      <div class="border">
        <img v-if="message.content.data.type == 11" src="../../../assets/images/satisfaction.png" alt="" />
        <img v-else src="../../../assets/images/file.png" alt="" />
        <div v-if="message.content.data.type == 11" class="satisfactions">
          满意度调查
        </div>
        <div v-else class="satisfactions" wx:else>
          {{ message.content.data.name }}
        </div>
        <div
          class="see"
          @click="goDetail"
          v-if="message.content.data.type == 11"
        >
          点击查看
          <div style="position: relative;width: 11px;margin-left: 5px;">
            <img src="../../../assets/images/see.png" alt="">
            <img style="left: 0px;" src="../../../assets/images/see.png" alt="">
          </div>
        </div>
        <div class="see" @click="Download" v-else>点击下载</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "satisfactionMessage",
  props: {
    message: {
      type: Object,
      value: {}
    }
  },
  computed:{
    attentionText(){
      return JSON.parse(this.message.content.ext).attentionText
    }
  },
  methods: {
    goDetail() {
      let recordId = JSON.parse(this.message.content.ext).recordId;
      this.$emit("seeSatisfactionDetail", recordId);
    },
    Download() {
      let url = this.message.content.data.url;
      if (!url) return;
      let link = document.createElement("a");
      link.href = url;
      link.download = this.message.content.data.name;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>
<style lang="scss" scoped>
.satisfaction {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  .title {
    color: #999999;
    font-size: 14px;
  }

  .content {
    width: 370px;
    height: 50px;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.2);
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .border {
    margin: 3px;
    height: 44px;
    box-sizing: border-box;
    border: 1px solid #a7d8b5;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0 14px 0 4px;
  }

  .border img {
    width: 42px;
    height: 30px;
    margin-right: 15px;
  }

  .border .satisfactions {
    flex: 1;
    color: #111111;
    font-size: 16px;
    font-weight: 700;
    margin-right: 37px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .border .see {
    flex-shrink: 0;
    font-size: 12px;
    color: #017925;
    cursor: pointer;
    display: flex;
    img {
      width: 5px;
      height: 9px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
