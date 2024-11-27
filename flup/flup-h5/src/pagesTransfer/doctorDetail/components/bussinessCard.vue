<template>
  <div class="bussinessCard" id="myDiv" ref="myDiv">
    <img :src="closeBtn" class="bussinessCard-close" @click="close">
    <div class="bussinessCard-logo">
      <img :src="cardLogo">
      <van-button @click="downloadCard()">预览并长按保存</van-button>
    </div>
    <div class="bussinessCard-info">
      <div class="bussinessCard-info-name">
        {{ doctorInfo.doctorName }}
        <img :src="yline" class="bussinessCard-info-name-line">
      </div>
      <div class="bussinessCard-info-intro">
        <img :src="doctorInfo.url ? doctorInfo.url : defaultAvator" class="avator">
        <div class="job">{{ doctorInfo.title }} | {{ doctorInfo.deptName }}</div>
        <div class="intr0">
          <img :src="goodatLogo">
          <span class="intr0-text">擅长</span>
        </div>
        <div class="desc">
          {{ doctorInfo.excel }}
        </div>
        <div class="intr0">
          <img :src="introduceLogo">
          <span class="intr0-text">简介</span>
        </div>
        <div class="desc">
          {{ doctorInfo.introduction }}
        </div>
      </div>
    </div>
    <div class="bussinessCard-qrcode">
      <div class="bussinessCard-qrcode-left">
        <img :src="quotation">
        <div class="bussinessCard-qrcode-left-hello">您好，我是医生{{ doctorInfo.doctorName }}</div>
        <div class="bussinessCard-qrcode-left-text">微信长按或扫描二维码</div>
        <div class="bussinessCard-qrcode-left-text">查看我的更多信息<van-icon name="arrow" /></div>
      </div>
      <div class="bussinessCard-qrcode-right">
        <div class="qrcode" ref="qrCodeUrl"></div>
        <!-- <img :src="defaultAvator" @click="viewQrcode"> -->
      </div>
    </div>
  </div>
</template>

<script>
import health from "@/assets/images/home/introduce.png";
import close from "@/assets/images/Doctor/close.png";
import logo from "@/assets/images/Doctor/card-logo.png";
import goodatL0go from "@/assets/images/Doctor/goodat-logo.png";
import introduceL0go from "@/assets/images/Doctor/introduce-logo.png";
import yl1ne from "@/assets/images/Doctor/docY-line.png";
import quotat1on from "@/assets/images/Doctor/quotation.png";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import { ImagePreview } from "vant";
export default {
  props: {
    doctorInfo: {
      type: Object,
    },
  },
  data() {
    return {
      qrcode: null,
      link: "",
    };
  },
  computed: {
    defaultAvator() {
      return health;
    },
    closeBtn() {
      return close;
    },
    cardLogo() {
      return logo;
    },
    goodatLogo() {
      return goodatL0go;
    },
    introduceLogo() {
      return introduceL0go;
    },
    yline() {
      return yl1ne;
    },
    quotation() {
      return quotat1on;
    },
  },
  mounted() {
    this.creatQrCode();
    this.init();
  },
  methods: {
    close() {
      this.$emit("closeOverlay");
    },
    async init() {
      let res = await this.$apis.getWxConfigParam({
        url: window.location.href.split("#")[0],
      });
      let info = res.retData;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: info.appId, // 必填，公众号的唯一标识
        timestamp: info.timestamp, // 必填，生成签名的时间戳
        nonceStr: info.nonceStr, // 必填，生成签名的随机串
        signature: info.signature, // 必填，签名
        jsApiList: ["previewImage"], // 必填，需要使用的JS接口列表
      });
    },
    viewQrcode() {
      ImagePreview({
        images: [this.defaultAvator],
        startPosition: 0,
      });
    },
    captureElement() {
      let _this = this;
      setTimeout(() => {
        html2canvas(document.getElementById("myDiv"), {
          allowTaint: true,
          useCORS: true,
        }).then((canvas) => {
          _this.link = document.createElement("a");
          _this.link.href = canvas.toDataURL("image/png");
          _this.link.download = this.doctorInfo.doctorName + "医生.png";
        });
      }, 1000);
    },
    downloadCard() {
      // ImagePreview({
      //   images: [this.link.href],
      //   startPosition: 0,
      // });
      if (this.link.href) {
        wx.previewImage({
          current: this.link.href, // 当前显示图片的http链接
          urls: [this.link.href], // 需要预览的图片http链接列表
        });
      }
    },
    creatQrCode() {
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: window.location.href, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.bussinessCard {
  position: fixed;
  top: 5vh;
  left: 15px;
  right: 15px;
  // bottom: 173px;
  background: linear-gradient(0deg, #c3ffe1 64%, #d1f4e4 100%);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 20px 18px;
  &-close {
    position: absolute;
    bottom: -7vh;
    left: 50%;
    transform: translate(-50%, 0);
    height: 30px;
  }
  &-logo {
    img {
      height: 30px;
    }
  }
  &-info {
    &-name {
      font-size: 30px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: #111111;
      margin: 27px 0 12px;
      &-line {
        height: 10px;
      }
    }
    &-intro {
      position: relative;
      background: #fff;
      padding: 14px 12px;
      border-radius: 8px;
      .job {
        font-weight: 400;
        font-size: 14px;
        font-weight: 400;
        font-size: 14px;
        margin-bottom: 24px;
      }
      .avator {
        height: 110px;
        width: 110px;
        border-radius: 50%;
        position: absolute;
        right: 0px;
        top: -55px;
      }
      .intr0 {
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
        }
      }
      .desc {
        margin-bottom: 20px;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0px;
        color: #333333;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  &-qrcode {
    margin-top: 18px;
    background: #89ebb9;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    border-radius: 8px;
    padding: 8px 11px;
    display: flex;
    justify-content: space-around;
    &-left {
      img {
        width: 18px;
      }
      &-hello {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.17px;
        color: #037c27;
      }
      &-text {
        font-size: 14px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: 0.17px;
        color: #253d30;
      }
    }
    &-right {
      img {
        width: 90px;
        height: 90px;
      }
    }
  }
}
</style>