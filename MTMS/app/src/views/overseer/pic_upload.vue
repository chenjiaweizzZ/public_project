<template>
  <div class="pic-upload">
    <van-nav-bar :title="title" left-text left-arrow @click-left="back" />
    <div class="pic-num">
      <div class="pic-num-left">照片</div>
      <div class="pic-num-right">
        <span class="right-left">{{picList.length}}</span>
        <span class="right-right" :style="rtColor">/9</span>
      </div>
    </div>
    <div class="pics">
      <div class="pic" v-for="(item,index) in picList" :key="index" @click="viewPic(index)">
        <img class="photo" :src="fdfsurl + item" />
        <!-- <div>{{fdfsurl + item}}</div> -->
        <img class="del-icon" src="../../assets/images/pic-del.png" @click="del(index)" />
      </div>
      <!-- <div class="pic2" v-show="picList.length < 9" @click="uploadimg">
        <van-uploader :after-read="onRead" multiple :capture="camera" accept="image/*">
          <van-icon name="plus" />
        </van-uploader>
      </div>-->
      <div class="addPic" v-show="picList.length < 9" @click="uploadimg">
        <div class="addContent">
          <div class="iconBox">
            <van-icon name="plus" color="#7B96B1" size="25px" />
          </div>
        </div>
      </div>
    </div>
    <van-image-preview
      v-model="show"
      :images="picViewList"
      @change="onChange"
      :startPosition="index"
    >
      <template v-slot:index>第{{index+1}}张</template>
    </van-image-preview>
    <div class="btn-box">
      <van-col style="width:10px"></van-col>
      <van-button type="info" @click="picListConfirm">提交</van-button>
      <van-col style="width:10px"></van-col>
    </div>
  </div>
</template>

<script>
import { Col, NavBar, Uploader, Dialog, Button, Toast } from "vant";
import vueUploader from "@/components/vue-uploader";
import methods from "../../methods";
export default {
  name: "pic-upload",
  data() {
    return {
      fdfsurl: "http://192.168.3.191/",
      isdel: false,
      picList: [],
      picViewList: [],
      index: 0,
      title: "上传照片",
      show: false,
      isNewPic: false,
      androidAttrs: "",
      color: "color",
      color1: "#FF0000",
      isBegin: true
    };
  },
  created() {
    let self = this;
    // const model = navigator.userAgent;
    // self.androidAttrs =
    //   model.indexOf("Android") > -1 || model.indexOf("Linux") > -1;
    // :capture="androidAttrs ? 'camera' : null"
    // :capture="androidAttrs ? 'camera' : null"
    // self.getPicList();
    self.getPicByRoute();
  },
  computed: {
    rtColor() {
      let self = this;
      if (self.picList.length == 0) {
        return { color: "#999999" };
      } else if (self.picList.length > 0 && self.picList.length < 9) {
        return { color: "#333333" };
      } else if (self.picList.length == 9) {
        return { color: "#FF0000" };
      }
    }
  },
  methods: {
    ...methods,
    getPicByRoute() {
      let self = this;
      self.fdfsurl = JSON.parse(self.$route.query.dfsURL);
      // console.log(self.picList);
      // let arr = self.$route.query.files.replace('"([^"]*)"', "$1");
      if (self.$route.query.files) {
        self.picList = JSON.parse(self.$route.query.files);
      }
      console.log(self.fdfsurl)
      // console.log(self.picList);
    },
    back() {
      let self = this;
      if (self.isNewPic) {
        Dialog.confirm({
          message: "有未提交的照片，确定要退出吗?"
        })
          .then(() => {
            this.$router.push({
              name: "grade"
            });
          })
          .catch(() => {});
      } else {
        this.$router.push({
          name: "grade"
        });
      }
    },
    uploadimg() {
      let self = this;
      self.isBegin = false;
      let num = Number(9 - self.picList.length);
      this.invokeNative("TakeAndUploadPhoto", { count: num, currentImg: this.picList.length, imgMax: 9 }, this.geturl);
    },
    geturl(data) {
      let self = this;
      let me = JSON.parse(data);
      console.log('geturl', me);
      if (me.data instanceof Array) {
        me.data.forEach(i => {
          self.picList.push(i.uri);
        });
      } else {
        self.picList.push(me.data.uri);
      }
    },
    getPicList() {
      let self = this;
      let params = {
        command: "supervisor/getFiles",
        supervisorId: Number(self.$route.query.supervisorUserId)
      };
      self.post("/supervisor/getFiles", params).done(function(res) {
        console.log(res);
        // self.isNewPic = true;
        self.picList = res.result.files;
        self.fdfsurl = res.result.dfsURL;
        console.log(self.picList, self.fdfsurl);
      });
    },

    base64ToFile(base64, fileName) {
      console.log(base64);
      let arr = base64.split(","),
        type = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type });
    },

    onRead(file) {
      console.log(file);
      // alert(file);
      let self = this;
      console.log(file.length);
      if (file.length) {
        // Toast("111");
        // Toast(file);
        if (file.length + self.picList.length > 9) {
          let leftNumber = 9 - self.picList.length;
          Toast("上传失败,还可以上传" + leftNumber + "张");
        } else {
          file.forEach(i => {
            console.log(i);
            let picPost = self.base64ToFile(i.content, "filee");
            let formData = new FormData();
            formData.append("file", picPost);
            $.ajax({
              url: "http://192.168.3.191/file/upload",
              type: "post",
              data: formData,
              processData: false,
              contentType: false,
              success: function(res) {
                self.isNewPic = true;
                self.picList.push(res.data.uri);
              }
            });
          });
        }
      } else {
        // Toast("222");
        // Toast(file);
        let picPost = self.base64ToFile(file.content, "filee");
        let formData = new FormData();
        formData.append("file", picPost);
        $.ajax({
          url: "http://192.168.3.191/file/upload",
          type: "post",
          data: formData,
          processData: false,
          contentType: false,
          success: function(res) {
            self.isNewPic = true;
            self.picList.push(res.data.url);
          }
        });
      }
    },
    viewPic(index) {
      console.log(index);
      let self = this;
      self.index = index;
      if (self.isdel == true) {
        return;
      } else {
        self.picList.forEach(i => {
          self.picViewList.push(self.fdfsurl + i);
        });
        self.show = true;
      }
    },
    picListConfirm() {
      let self = this;
      Dialog.confirm({
        message: "确定要提交照片吗?"
      })
        .then(() => {
          let params = {
            command: "supervisor/uploadPhoto",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            supervisorUserId: self.$route.query.supervisorUserId,
            files: self.picList
          };
          console.log(params);
          self.post("/supervisor/uploadPhoto", params).done(function(res) {
            console.log(res);
            Toast("提交成功!");
            self.isNewPic = false;
            self.back();
          });
        })
        .catch(() => {});
    },
    del(index) {
      let self = this;
      // self.isBegin = false;
      self.isdel = true;
      self.picList.splice(index, 1);
      setTimeout(() => {
        self.isdel = false;
      }, 1000);
      // Dialog.confirm({
      //   message: "确定要删除该张照片吗?"
      // })
      //   .then(() => {
      //     console.log(index);
      //     self.isdel = false;
      //     self.picList.splice(index, 1);
      //   })
      //   .catch(() => {
      //     console.log("cancel");
      //     self.isdel = false;
      //   });
    },
    onChange(index) {
      console.log(index);
      let self = this;
      self.index = index;
    }
  }
};
</script>



<style lang="scss">
.pic-upload {
  height: 100%;
  background: #ffffff;
  .van-nav-bar {
    display: flex;
    align-items: center;
    .van-nav-bar__left {
      bottom: auto;
      .van-icon {
        color: #111111;
        font-size: 24px;
      }
    }
    .van-nav-bar__title {
      font-size: 18px;
      font-weight: 550;
    }

    .van-nav-bar__right {
      bottom: auto;
      .van-nav-bar__text {
        color: #111111;
        font-size: 18px;
      }
    }
  }
  .pic-num {
    height: 46px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0.2px;
    font-weight: 550;
    align-items: center;
    background: #ffffff;
    border-bottom: solid 0.5px #e2e2e2;
    .pic-num-left {
      margin-left: 10px;
    }
    .pic-num-right {
      margin-right: 10px;
      display: flex;
      .right-right {
        color: #999999;
      }
    }
  }
  .addPic {
    width: 33.3%;
    padding-bottom: 33.3%;
    height: 100%;
    position: relative;
    .addContent {
      padding: 4.5px;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: translate(-50%, -50%);
      .iconBox {
        background: #f8fbff;
        border: 0.8px solid rgba(204, 220, 237, 1);
        border-radius: 6px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .pics {
    margin-top: 7.5px;
    margin-left: 9.5px;
    margin-right: 9.5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .pic {
      width: 33.3%;
      padding-bottom: 33.3%;
      height: 100%;
      position: relative;
      .photo {
        padding: 4.5px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate(-50%, -50%);
        border-radius: 10px;
      }
      .del-icon {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 99;
        width: 18px;
        height: 18px;
      }
    }
    .pic2 {
      width: 31.3%;
      padding-bottom: 31.3%;
      height: 100%;
      position: relative;
      .van-uploader {
        // width: 33%;
        border-radius: 6px;
        background: #f8fbff;
        border: 0.8px solid rgba(204, 220, 237, 1);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        // padding-bottom: 30%;
        height: 100%;
        // position: relative;
        margin-left: 4px;
        margin-top: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate(-50%, -50%);
        i {
          font-size: 30px;
          padding: 4px;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translate(-50%, -50%);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .btn-box {
    .van-button {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      // margin: 0 5px;
      width: calc(100% - 10px);
      margin-left: 5px;
      .van-button__text {
        font-size: 17px;
        letter-spacing: 0.2px;
        text-align: center;
        font-weight: 400;
      }
    }
  }
  .van-button--info {
    background-color: #2685d2;
  }
}
</style>