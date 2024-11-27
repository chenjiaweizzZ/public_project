<template>
  <div class="custom">
    <div class="custom-WJDC" v-if="restInfo(content).type == 3" @click="jump(info.url)">
      <div class="title">
        <img class="title-image" src="@/assets/images/wjdc.png" alt="">
        <span class="title-text">问卷调查</span>
        <img class="title-icon" src="@/assets/images/jr2.png" alt="">
      </div>
      <div class="info">
        <div class="info-text">{{ info.packageName }}</div>
      </div>
    </div>
    <div class="custom-WJDC" v-else-if="restInfo(content).type == 2" @click="jump(info.url)">
      <div class="title">
        <img class="title-image" v-if="restInfo(content).taskType == '调查问卷'" src="@/assets/images/wjdc.png" alt="">
        <img class="title-image" v-else-if="restInfo(content).taskType == '健康宣教'" src="@/assets/images/jkxj.png" alt="">
        <img class="title-image" v-else src="@/assets/images/xxtx.png" alt="">
        <span class="title-text">{{ restInfo(content).taskType }}</span>
        <img class="title-icon" src="@/assets/images/jr2.png" alt="">
      </div>
      <div class="info">
        <div class="info-text">{{ info.planContent }}</div>
      </div>
    </div>
    <div v-else-if="restInfo(content).type == 5" @click="toggleShow(restInfo(content))">
      <img :src="restInfo(content).imageUrl" :class="['messageImage', 'messageImage-h5']" @load="onImageLoaded">
    </div>
    <div v-else-if="restInfo(content).type == 6">
      <div class="order" @click="openLink(restInfo(content))">
        <img :src="restInfo(content).previewUrl" alt="" />
        <main>
          <div class="order-title">{{ restInfo(content).packageName }}</div>
          <div class="order-desc">{{ restInfo(content).packageDiscription }}</div>
          <div class="order-price">
            <span class="sign">¥</span>
            <span class="pr1ce">{{ restInfo(content).floorPrice }}</span>
            <span class="text">起</span>
          </div>
        </main>
      </div>
    </div>
    <div v-else-if="restInfo(content).type == 7">
      <span class="text-box text-out" style="vertical-align: middle;">{{ info.text }}</span>
    </div>
    <div v-else-if="restInfo(content).type == 9" @click="videoShow(poster)">
      <video :src="restInfo(content).videoUrl" controls preload="metadata" class="v1deo" autoplay muted playsinline v-show="false">
      </video>
      <div v-if="poster" class="poster">
        <img :src="poster" :class="['messageImage', 'messageImage-h5']">
        <img src="@/assets/images/chat/play.png" alt="" class="poster-play">
      </div>
      <div v-else>
        <van-loading />
      </div>
    </div>
    <div v-else-if="restInfo(content).type == 12">
      <div class="f1le" @click="viewFile(restInfo(content))">
        <img src="../../assets/icon/docx.png" alt="" v-if="restInfo(content).name.includes('docx') || restInfo(content).name.includes('doc')">
        <img src="../../assets/icon/PDF.png" alt="" v-else-if="restInfo(content).name.includes('pdf')">
        <img src="../../assets/icon/excel.png" alt="" v-else-if="restInfo(content).name.includes('xls') || restInfo(content).name.includes('xlsx')">
        <img src="../../assets/icon/file-uni.png" alt="" v-else>
        <span>{{restInfo(content).name}}</span>
      </div>
    </div>
    <div v-else-if="restInfo(content).type == 13" :class="{ 'custom-trtc' : messageItem.flow == 'out' }">{{ trtcMessage() }}&nbsp;<van-icon name="phone-o" /></div>
    <div v-else-if="restInfo(content).type == 4 && messageItem.payload.description == '健康档案'" class="custom-imageText">
      <div class="custom-imageText-form" @click="imageTextFormDetail(JSON.parse(restInfo(content).text).orderSerialNo)">
        <div class="custom-imageText-form-title">
          <span class="title-left">健康档案</span>
          <span class="title-right">
            <img src="../../assets/icon/imageText-log.png">
            <van-icon name="arrow" color="#7B95B1" />
          </span>
        </div>
        <div class="custom-imageText-form-desc">
          <div class="desc-title">
            <img src="../../assets/icon/imageText-desc.png" alt="">
            <span>病情描述</span>
          </div>
          <div class="desc-content">{{ JSON.parse(restInfo(content).text).diseaseDescription }}</div>
        </div>
        <div class="custom-imageText-form-desc">
          <div class="desc-title">
            <img src="../../assets/icon/imageText-purpose.png" alt="">
            <span>咨询目的</span>
          </div>
          <div class="desc-content">{{ JSON.parse(restInfo(content).text).consultPurpose | purposeTranslate }}</div>
        </div>
      </div>
    </div>
    <div v-else class="custom-text">{{ info.text }}</div>
  </div>
</template>
<script>
import mixin from "../../mixin";
import { Base64 } from "js-base64";
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
    messageItem: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [mixin],
  data() {
    return {
      info: {},
      poster: "",
      system: 1,
    };
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
  watch: {
    content: {
      handler(newValue) {
        this.info = JSON.parse(newValue.data);
        if (this.info.type == 9) {
          let userAgent = navigator.userAgent;
          if (userAgent.match("Android")) {
            this.system = 1;
          } else {
            this.system = 0;
          }
          console.log("userAgent:", newValue);
          this.geThumbnail(this.info.videoUrl);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState("chat", ["picList"]),
  },
  mounted() {
    console.log("data", this.restInfo(this.content));
  },
  methods: {
    ...mapMutations("chat", ["updatePicList"]),
    imageTextFormDetail(orderSerialNo) {
      if (orderSerialNo) {
        this.$router.push({
          path: "imageTextForm",
          query: {
            orderSerialNo,
          },
        });
      }
    },
    trtcMessage() {
      let { data } = this.content;
      let message = JSON.parse(data);
      if (this.messageItem.flow == "out") {
        return message.from;
      } else {
        return message.to;
      }
    },
    jump(url) {
      if (!url) {
        return false;
      }
      let newUrl = url.split("#")[1];
      sessionStorage.setItem(
        "scrollTop",
        document.getElementById("messageScrollList").scrollTop
      );
      this.$router.push({
        path: `${newUrl}&roomId=${this.$route.query.roomId}&isBack=${true}`,
        query: {
          roomId: this.$route.query.roomId,
        },
      });
    },
    async geThumbnail(url) {
      let that = this;
      this.$nextTick(() => {
        let pic = this.picList.filter((i) => i.href == url);
        console.log(pic);
        if (pic && !pic.poster) {
          // this.findVideoCover(url)
          //   .then((res) => {
          //     this.updatePicList({
          //       poster: res,
          //       href: url,
          //     });
          //     this.poster = res;
          //     this.$emit("scroll");
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
          // let video = document.querySelector(".v1deo");
          // video.crossOrigin = 'anonymous';
          // this.getVideoCover(video,function(coverImage) {
          //   //     this.updatePicList({
          // //       poster: res,
          // //       href: url,
          // //     });
          //   that.poster = coverImage;
          //   that.$emit("scroll");
          // })
          // let video = document.createElement("video"); // 创建视频元素
          if (this.system) {
            let video = document.createElement("video");
            video.setAttribute("crossOrigin", "anonymous");
            video.setAttribute("src", url);
            video.currentTime = 0.1; // 获取0.1s处的画面
            video.muted = true;
            // video.play().then(() => {
            //   video.pause()
            // })
            video.addEventListener("loadeddata", function () {
              let canvas = document.createElement("canvas"); // 创建画布
              let width = video.videoWidth; // canvas的尺寸和视频尺寸一样
              let height = video.videoHeight;
              canvas.width = width;
              canvas.height = height;
              canvas.getContext("2d").drawImage(video, 0, 0, width, height); // 绘制canvas
              let dataURL = canvas.toDataURL("image/jpeg"); // 转换为base64
              // console.log(url,dataURL)
              that.updatePicList({
                poster: dataURL,
                href: url,
              });
              console.log(url);
              that.poster = dataURL;
              that.$emit("scroll");
            });
          } else {
            let dataURL = require("@/assets/images/chat/video.png");
            that.updatePicList({
              poster: dataURL,
              href: url,
            });
            that.poster = dataURL;
            that.$emit("scroll");
          }
        }
      });
    },
    // getVideoCover(videoElement, callback) {
    //   let that = this
    //   // 确保视频已经加载元数据（比如尺寸）
    //   if (!videoElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
    //     setTimeout(function () {
    //       that.getVideoCover(videoElement, callback); // 尝试再次获取，直到元数据加载完成
    //     }, 1000);
    //     return;
    //   }
    //   // 创建一个canvas元素
    //   var canvas = document.createElement("canvas");
    //   canvas.width = videoElement.videoWidth;
    //   canvas.height = videoElement.videoHeight;
    //   // 绘制视频的当前帧到canvas上
    //   var context = canvas.getContext("2d");
    //   context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    //   // 将canvas转换为Base64 URL
    //   var dataURL = canvas.toDataURL("image/png"); // 或者 'image/jpeg'
    //   // 调用回调函数并传递封面图片的Base64 URL
    //   callback(dataURL);
    // },
    findVideoCover(url) {
      return new Promise((resolve, reject) => {
        try {
          let video = document.createElement("video2"); // 创建视频元素
          video.setAttribute("crossOrigin", "anonymous");
          video.setAttribute("src", url);
          video.currentTime = 0.1; // 获取0.1s处的画面
          video.addEventListener("loadeddata", function () {
            let canvas = document.createElement("canvas"); // 创建画布
            let width = video.videoWidth; // canvas的尺寸和视频尺寸一样
            let height = video.videoHeight;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(this, 0, 0, width, height); // 绘制canvas
            const dataURL = canvas.toDataURL("image/jpeg"); // 转换为base64
            resolve(dataURL);
          });
        } catch (error) {
          reject("1321141");
        }
      });
    },
    onImageLoaded() {
      this.$emit("uploading");
    },
    toggleShow(item) {
      console.log(item)
      this.$emit("previewImage", item.imageUrl);
    },
    videoShow(poster) {
      console.log(this.info.videoUrl);
      this.$emit("previewVideo", this.info.videoUrl);
    },
    openLink(payload) {
      // this.$router.push({
      //   path:'/healthControl',
      //     query:{
      //       packageId: "PI20231213161014048da1",
      //       packageName: "测试01"
      //   }
      // })
      window.location.href = payload.url;
    },
    viewFile(file) {
      // console.log(this.$baseURL.onlineViewUrl)
      let encodedUrl = encodeURIComponent(
        Base64.encode(`${file.url}?fullfilename=${file.name}`)
      );
      let previewUrl = `${this.$baseURL.onlineViewUrl}?url=${encodedUrl}`;
      console.log(previewUrl);
      window.location.href = previewUrl;
    },
  },
};
</script>
<style lang="scss" scoped>
.custom {
  &-text {
    display: flex;
    align-items: center;
  }
  &-trtc {
    display: flex;
    align-items: center;
    color: #fff;
  }
  // .text-img {
  //   width: 20px;
  //   height: 20px;
  // }

  // .text-box {
  //   white-space: pre-wrap;
  //   font-size: inherit;
  //   word-break: break-word;
  //   font-size: 14px;
  //   text-size-adjust: none;

  // }

  // .text-out {
  //   color: #fff;
  // }
  .message-video-box {
    // display: inline-block;
    // width: 100vw;
    // font-size: 0;
    video {
      height: 100%;
      width: 100%;
    }
  }
  &-text {
    width: 100%;
    display: flex;
    justify-content: center;
    color: #333;
  }

  &-WJDC {
    width: 165px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
    padding: 11px 6px 15px;

    .title {
      display: flex;
      align-items: center;
      padding-right: 10px;

      &-image {
        width: 18px;
        height: 18px;
        margin-right: 7px;
      }

      &-text {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        line-height: 15px;
        letter-spacing: 0.2px;
        color: #00982d;
        margin-bottom: 2px;
        margin-block: 2px;
      }

      &-icon {
        width: 5.25px;
        height: 9.75px;
      }
    }

    .info {
      width: 100%;
      height: 50px;
      background: #ecfcf3;
      border-radius: 4px;
      margin-top: 10px;
      padding: 0 12px;
      display: flex;
      align-items: center;

      &-text {
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        max-height: 34px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 14px;
        font-weight: 600;
        line-height: 17px;
        letter-spacing: 0.2px;
        color: #111111;
      }
    }
  }

  .messageImage {
    max-width: calc(100vw - 180px);
    // max-height: calc(100vw - 180px);
    // width: 100%;
    // height: 100%;

    &-h5 {
      max-width: calc(100vw - 180px);
    }
  }

  .poster {
    position: relative;
    &-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 50px;
      width: 50px;
    }
  }

  .order {
    display: flex;
    background-color: #fff;
    align-items: center;
    background: linear-gradient(0deg, #ffffff 35%, #e6ffea 100%);
    padding: 2px;
    main {
      padding-left: 5px;

      .order-title {
        font-size: 15px;
        font-weight: 550;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
        margin-bottom: 6px;
        padding-top: 3px;
        padding-right: 15px;
      }

      .order-desc {
        width: 145px;
        line-height: 22px;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0.2px;
        margin-bottom: 6px;
        word-break: break-word;
        font-weight: normal;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        // word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
        margin-bottom: 6px;
        padding-top: 3px;
        padding-right: 15px;
      }

      .order-price {
        font-weight: 600;
        line-height: 22px;
        font-size: 0;
        color: #ff5500;
        .sign {
          font-size: 14px;
          margin-right: 2px;
        }
        .pr1ce {
          font-size: 18px;
        }
        .text {
          font-size: 12px;
          color: #666666;
          margin-left: 4px;
        }
      }
    }

    img {
      width: 72px;
      height: 72px;
      padding-left: 5px;
    }
  }

  .f1le {
    display: flex;
    background: #fff;
    padding: 10px;
    font-size: 17px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.2px;
    color: #111111;
    img {
      width: 40px;
      height: 40px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  &-imageText {
    display: flex;
    flex-direction: row-reverse;
    &-form {
      background: #fff;
      width: 60vw;
      border: 0px solid #979797;
      border-radius: 8px;
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
}
</style>
