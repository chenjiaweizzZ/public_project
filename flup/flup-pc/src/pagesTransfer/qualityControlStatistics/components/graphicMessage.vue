<template>
  <div class="custom-imageText">
    <div class="custom-imageText-form">
      <div class="custom-imageText-form-title">
        <span class="title-left">健康档案</span>
        <span class="title-right">
          <img src="../../../assets/images/chat/imageText-log.png">
          <!-- <van-icon name="arrow" color="#7B95B1" /> -->
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
      <div class="custom-imageText-form-desc">
        <div class="desc-title">
          <img src="../../../assets/images/chat/imageText-desc.png" alt="">
          <span>病情描述</span>
        </div>
        <div class="desc-content">{{ message.content.data.text.diseaseDescription }}</div>
      </div>
      <div class="custom-imageText-form-desc">
        <div class="desc-title">
          <img src="../../../assets/images/chat/imageText-purpose.png" alt="">
          <span>咨询目的</span>
        </div>
        <div class="desc-content">{{ message.content.data.text.consultPurpose | purposeTranslate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      value: "",
    },
  },
  filters: {
    purposeTranslate(consultPurpose) {
      let arr = consultPurpose.split(",");
      let text = "";
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == 1) {
          text = "病情咨询 " + text;
        } else if (arr[i] == 2) {
          text = "报告解读 " + text;
        } else if (arr[i] == 3) {
          text = "用药咨询 " + text;
        } else {
          text = text + " 其它";
        }
      }
      return text;
    },
  },
};
</script>

<style scoped lang="scss">
.custom-imageText {
  display: flex;
  margin-left: 10px;
  &-form {
    background: #fff;
    width: 15vw;
    border: 0px solid #979797;
    border-radius: 20px;
    &-title {
      height: 40px;
      background: linear-gradient(174deg, #dcf0e1 15%, #ffffff 65%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      .title-left {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.2px;
        color: #00982d;
      }
      .title-right {
        display: flex;
        align-items: center;
        img {
          height: 24px;
          margin-right: 14px;
        }
      }
    }
    &-desc {
      padding: 2px 12px 5px;
      .desc-title {
        margin-bottom: 2px;
        img {
          height: 10px;
        }
        span {
          font-size: 14px;
          font-weight: normal;
          letter-spacing: 0.2px;
          color: #637669;
        }
      }
      .desc-content {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.2px;
        color: #111111;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>