<template>
  <div class="add-edit-case">
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
    <div class="case-title">文件名称</div>
    <div class="line"></div>
    <div class="case-input">
      <van-field
        v-model="caseTitle"
        label
        placeholder="请输入文件名称"
        rows="2"
        type="textarea"
        maxlength="20"
      />
      <div class="caseTitlet">
        <span class="ctprr">/20</span>
        <span class="ctprl"  :style="rtColor2">{{caseTitle.length}}</span>
        </div>
    </div>
    <div class="case-title-photo">
      <span class="case-title-photo-left">照片</span>
      <span class="case-title-photo-right">
        <span class="ctprl" :style="rtColor">{{picList.length}}</span>
        <span class="ctprr">/9</span>
      </span>
    </div>
    <div class="line2"></div>
    <div class="pics">
      <div class="pic" v-for="(item,index) in picList" :key="index" @click="viewPic(index)">
        <!-- <img class="photo" :src="fdfsurl + item" /> -->
        <img class="photo" :src="item" />
        <img class="del-icon" src="../../../assets/images/pic-del.png" @click="del(index)" />
      </div>
      <div class="addPic" v-show="picList.length < 9" @click="uploadimg">
        <div class="addContent">
          <div class="iconBox">
            <van-icon name="plus" color="#7B96B1" size="25px" />
          </div>
        </div>
      </div>
    </div>
    <div class="picTips">支持jpeg、png格式</div>
    <div style="height: 66px"></div>
    <van-image-preview
      v-model="show"
      :images="picViewList"
      @change="onChange"
      :startPosition="index"
    >
      <template v-slot:index>第{{index+1}}张</template>
    </van-image-preview>
    <div class="btn-row">
      <van-button type="info" size="large" @click="submit" :disabled="caseTitle == '' || picList.length == 0">提交</van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import cProgress from "@/components/progress";
export default {
  name: "rotation_doctor_exam",
  components: {
    cHeader,
    cProgress
  },
  data() {
    return {
      title: "",
      caseTitle: "",
      picList: [
        
      ],
      show: false,
      picViewList: [],
      index: "",
      isdel: false
    };
  },
  computed: {
    ...mapState(["turninfo"]),
    rtColor() {
      let self = this;
      if (self.picList.length == 0) {
        return { color: "#999999" };
      } else if (self.picList.length > 0 && self.picList.length < 9) {
        return { color: "#333333" };
      } else if (self.picList.length == 9) {
        return { color: "#FF0000" };
      }
    },
    rtColor2() {
      let self = this;
      if (self.caseTitle.length == 0) {
        return { color: "#999999" };
      } else if (self.caseTitle.length > 0 && self.caseTitle.length < 20) {
        return { color: "#333333" };
      } else if (self.caseTitle.length == 20) {
        return { color: "#FF0000" };
      }
    }
  },
  created() {
    this.judgeAddEdit();
  },
  mounted() {},
  methods: {
    ...methods,
    ...mapActions(["setTurninfo", "setTurnManual"]),
    uploadimg() {
      let self = this;
      let num = Number(9 - self.picList.length);
      this.invokeNative(
        "TakeAndUploadPhoto",
        { count: num, currentImg: this.picList.length, imgMax: 9 },
        this.geturl
      );
    },
    geturl(data) {
      let self = this;
      let me = JSON.parse(data);
      console.log("geturl", me);
      if (me.data instanceof Array) {
        me.data.forEach(i => {
          self.picList.push(i.url);
        });
      } else {
        self.picList.push(me.data.url);
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
          self.picViewList.push(i);
        });
        self.show = true;
      }
    },
    onChange(index) {
      console.log(index);
      let self = this;
      self.index = index;
    },
    del(index) {
      let self = this;
      self.isdel = true;
      self.picList.splice(index, 1);
      setTimeout(() => {
        self.isdel = false;
      }, 1000);
    },
    submit() {
      let self = this;
      Dialog.confirm({
        title: "",
        message: "确认提交病历吗？",
        confirmButtonColor: "#1989fa"
      })
        .then(() => {
          if (this.$route.query.caseId) {
            self
              .post("/base/largeMedicalRecord/update", {
                id: this.$route.query.caseId,
                name: self.caseTitle,
                fileList: self.picList,
                turnPlanDetailId: this.$route.query.id
              })
              .done(res => {
                console.log(res);
                this.$router.push({
        name: "fdRotation_doctor_up_case_withbottom",
        query: {
          id: self.$route.query.id,
          type: self.$route.query.type,
          deptid: self.$route.query.deptid,
          teachingid: self.$route.query.teachingid
        }
      });
              });
          } else {
            self
              .post("/base/largeMedicalRecord/add", {
                name: self.caseTitle,
                fileList: self.picList,
                turnPlanDetailId: this.$route.query.id
              })
              .done(res => {
                console.log(res);
                this.$router.push({
        name: "fdRotation_doctor_up_case_withbottom",
        query: {
          id: self.$route.query.id,
          type: self.$route.query.type,
          deptid: self.$route.query.deptid,
          teachingid: self.$route.query.teachingid
        }
      });
              });
          }
          
        })
        .catch(() => {
          console.log("cancel");
        });
    },
    onClickLeft() {
      let self = this;
      this.$router.push({
        name: "fdRotation_doctor_up_case_withbottom",
        query: {
          id: self.$route.query.id,
          type: self.$route.query.type,
          deptid: self.$route.query.deptid,
          teachingid: self.$route.query.teachingid
        }
      });
    },
    judgeAddEdit() {
      let self = this;
      if (this.$route.query.caseId) {
        self.title = "病历详情";
        self
          .get(
            "/base/largeMedicalRecord/detail/" + this.$route.query.caseId
          )
          .done(res => {
            console.log(res)
            if (res.resCode == 200) {
              self.caseTitle = res.model.name;
              self.picList = res.model.fileList;
            }
          });
      } else {
        self.title = "添加病历";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.add-edit-case {
  .caseTitlet {
    background: #fff;
    display: flex;
    flex-direction: row-reverse;
    font-size: 12px;
    padding-bottom: 14px;
    padding-right: 14px;
    .ctprr {
      color: #999999;
    }
  }
  height: 100%;
  background: #F6F6F6;;
  .case-title {
    height: 46px;
    background: #ffffff;
    font-size: 16px;
    font-weight: bold;
    line-height: 19px;
    letter-spacing: 0.2px;
    color: #333333;
    display: flex;
    align-items: center;
    padding-left: 14px;
    margin-top: 46px;

  }
  .line {
    // width: 100%;
    height: 1px;
    opacity: 1;
    background: rgba(255, 255, 255, 0.01);
    box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    // margin: 0px 12px;
  }
  .line2 {
    width: 100%;
    height: 1px;
    opacity: 1;
    background: rgba(255, 255, 255, 0.01);
    box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    // margin: 6px 0px 0px 12px;
  }
  .case-input {
    margin-bottom: 8px;
  }
  .case-title-photo {
    display: flex;
    justify-content: space-between;
    height: 46px;
    background: #ffffff;
    padding: 0px 12px;
    align-items: center;
    // margin-bottom: -10px;
    .case-title-photo-left {
      font-size: 16px;
      font-weight: bold;
      line-height: 19px;
      letter-spacing: 0.2px;
      color: #333333;
    }
    .case-title-photo-right {
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      text-align: right;
      letter-spacing: 0.2px;
      color: #999999;
      display: flex;
      padding-right: 5px;
    }
  }
  .picTips {
    font-size: 13px;
    font-weight: normal;
    line-height: 16px;
    text-align: justify; /* 浏览器可能不支持 */
    letter-spacing: 0.28px;
    color: #b2b2b2;
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: #fff;
    // padding-bottom: 66px;
    padding-top: 4px;
    padding-bottom: 12px;
  }
  .addPic {
    width: 25%;
    padding-bottom: 25%;
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
    background: #fff;
    padding-top: 7.5px;
    padding-left: 9.5px;
    padding-right: 9.5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .pic {
      width: 25%;
      padding-bottom: 25%;
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
  .btn-row {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 20px;
    background: #ffffff;
    z-index: 99
  }
}
</style>

<style lang="scss">
.van-overlay {
  background: rgba(0, 0, 0, 0.5) !important;
}
.van-dialog {
      border-radius: 8px !important;
    }
    .van-dialog__message {
      font-size: 16px !important;
      color: #111111;
      font-weight: bold;
    }
    .van-dialog__cancel {
      color: #666666 !important;
    }
    .van-dialog__confirm {
      color: #2F7DCD;
    }
.add-edit-case {
  .van-cell {
    &:after {
      display: none;
    }
  }
  .van-field__word-num {
    color: #333333;
  }
  textarea::-webkit-input-placeholder {
          /* WebKit browsers */
          /* placeholder颜色  */
          color: #B2B2B2;
          /* placeholder字号  */
          font-size: 16px;
        }
        textarea:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #B2B2B2;
          font-size: 16px;
        }
        textarea::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #B2B2B2;
          font-size: 16px;
        }
        textarea::-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #B2B2B2;
          font-size: 16px;
        }
        .van-field__control {
          font-size: 16px;
        }
        .van-field__word-limit {
          color: #B2B2B2;
        }
  .van-nav-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
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
  .van-button--info {
    background-color: #2685D2;
    border-radius: 4px;
  }
}
</style>