<template>
  <div class="pic-upload">
    <van-nav-bar :title="title" left-text left-arrow @click-left="back" />
    <!-- <div class="pic-num">
      <div class="pic-num-left">照片</div>
      <div class="pic-num-right">{{picList.length}}/9</div>
    </div>-->
    <div class="pics" v-if="picList.length > 0">
      <div class="pic" v-for="(item,index) in picList" :key="index" @click="viewPic(index)">
        <img class="photo" :src="fdfsurl + item" />
        <!-- <img class="del-icon" src="../../assets/images/pic-del.png" @click="del(index)" /> -->
      </div>
      <!-- <div class="pic2">
        <van-uploader :after-read="onRead" multiple>
          <van-icon name="plus" />
        </van-uploader>
      </div>-->
    </div>
    <div v-else class="nodata">
      <img src="../../assets/images/noddata.png" />
      <div class="nodataText">暂无照片</div>
    </div>
    <van-image-preview
      v-model="show"
      :images="picViewList"
      @change="onChange"
      :startPosition="index"
    >
      <template v-slot:index>第{{index+1}}张</template>
    </van-image-preview>
    <!-- <van-button plain type="info">提交</van-button> -->
  </div>
</template>

<script>
import $ from "jquery";
import methods from "../../methods";
import { NavBar, Uploader, Dialog, Button } from "vant";
import vueUploader from "@/components/vue-uploader";
export default {
  name: "pic-view",
  data() {
    return {
      fdfsurl: "http://192.168.3.191/",
      isdel: false,
      picList: [],
      picViewList: [],
      index: 0,
      title: "查看照片",
      show: false
    };
  },
  created() {
    let self = this;
    self.getPicList();
  },
  methods: {
    ...methods,
    back() {
      this.$router.push({
        name: "couple_back"
      });
    },
    getPicList() {
      let self = this;
      let params = {
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        command: "supervisor/getFiles",
        supervisorId: Number(self.$route.query.supervisorId)
      };
      self.post("/supervisor/getFiles", params).done(function(res) {
        self.picList = res.result.files;
        self.fdfsurl = res.result.dfsURL;
      });
    },
    // base64toFile(dataurl, filename = "file") {
    //   console.log(dataurl);
    //   let arr = dataurl.split(",");
    //   let mime = arr[0].match(/:(.*?);/)[1];
    //   let suffix = mime.split("/")[1];
    //   let bstr = atob(arr[1]);
    //   let n = bstr.length;
    //   let u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   let file = new File([u8arr], `${filename}.${suffix}`, {
    //     type: mime
    //   });
    //   return file;
    // },
    base64ToFile(base64, fileName) {
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
      let self = this;
      let picPost = self.base64ToFile(file.content, "filee");
      let formData = new FormData();
      formData.append("file", picPost);
      console.log(picPost);
      $.ajax({
        url: "/file/upload",
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
          console.log(res.data.url);
        }
      });
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
      self.show = true;
    },
    del(index) {
      let self = this;
      self.isdel = true;
      Dialog.confirm({
        message: "确定要删除该张照片吗?"
      })
        .then(() => {
          console.log(index);
          self.isdel = false;
        })
        .catch(() => {
          console.log("cancel");
          self.isdel = false;
        });
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
  .nodata {
    background: #ffffff;
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      height: 138px;
      width: 280px;
    }
    .nodataText {
      font-size: 17px;
      color: #868e97;
    }
  }
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
    .pic-num-left {
      margin-left: 10px;
    }
    .pic-num-right {
      margin-right: 10px;
    }
  }
  .pics {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .pic {
      width: 33.3%;
      padding-bottom: 33.3%;
      height: 100%;
      position: relative;
      .photo {
        padding: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate(-50%, -50%);
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
  // .van-button {
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   margin: 0px 5px;
  // }
}
</style>