<template>
  <div class="rd-case-detail">
    <van-nav-bar
      title="病历详情"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="score-row">{{ evaInfo.name }}</div>

    <div class="pics">
      <div class="pic" v-for="(item,index) in picList" :key="index" @click="viewPic(index)">
        <img class="photo" :src="item" />
      </div>
    </div>
    
    <div class="case-result">
      <div class="result-score">
        <div class="line"></div>
        <div class="result-title">
          <span class="result-title-left">
            <img class="titleImg" src="../../../assets/images/100.png" />
            <span class="result-bl">审核评分结果</span>
          </span>
          <span class="result-title-right">
            <span class="result-title-right-score">{{ evaInfo.score }}</span>
            <span class="result-title-right-unit">分</span>
          </span>
        </div>
        <div class="check-person">
          <span style="width: 80px;display:flex;justify-content: space-around;">
            <span>审</span>
            <span>核</span>
            <span>人：</span>
            </span>
          {{ evaInfo.auditorName }}</div>
        <div class="check-time">
          <span style="width: 80px;display:flex;justify-content: space-around;">审核时间：</span>
          {{ evaInfo.auditTime}}</div>
          <van-button type="info" plain size="large" @click="evaDetail">评分详情</van-button>
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
      show: false,
      picList: [],
      picViewList: [],
      index: 0,
      evaInfo: {}
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  created() {
    this.getEvaDetail() 
  },
  mounted() {},
  methods: {
    ...methods,
    ...mapActions(["setTurninfo", "setTurnManual"]),
    onClickLeft() {
      this.$router.push({
            name: "fdRotation_doctor_up_case_withbottom",
            query: {
              id: this.$route.query.id,
              type: this.$route.query.type,
              deptid: this.$route.query.deptid,
              teachingid: this.$route.query.teachingid
            }
          });
    },
    getEvaDetail() {
      let self = this;
      self
          .get(
            "/base/largeMedicalRecord/detail/" + this.$route.query.caseId
          )
          .done(res => {
            console.log(res)
            if (res.resCode == 200) {
              self.picList = res.model.fileList
              self.evaInfo = res.model
            }
          });
    },
    delCase() {
      Dialog.confirm({
        title: "",
        message: "确认删除病历吗？"
      })
        .then(() => {
          console.log("confirm");
        })
        .catch(() => {
          console.log("cancel");
        });
    },
    addCase() {
      let self = this;
      this.$router.push({
        name: "fdRotation_doctor_addedit_case"
        // query: {
        //   businessid: self.$route.query.id
        // }
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
    evaDetail() {
    let self = this;
      this.$router.push({
          name: "fdRotation_medical_eva_detail",
          query: {
            id: this.$route.query.caseId,
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
.rd-case-detail {
  .result-bl {
    font-size: 16px;
    font-weight: bold;
  }
  .line {
    // width: 100%;
    height: 1px;
    opacity: 1;
    background: rgba(255, 255, 255, 0.01);
    box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    margin: 0px -20px;
  }
  .score-row {
    // height: 45px;
    font-size: 16px;
    font-weight: bold;
    line-height: 19px;
    letter-spacing: 0.2px;
    color: #333333;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin: 16px 0px 7px 2px;
  }
  .caseContent {
    height: calc(100% - 128px);
    background: #FFF;
  }
  .pics {
    background: #fff;
    padding-top: 0px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .pic {
      width: 33.3%;
      padding-bottom: 33.3%;
      height: 100%;
      position: relative;
      .photo {
        padding: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate(-50%, -50%);
        // border-radius: 10px;
        border-radius: 16px
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
  .case-result {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px 20px;
      background: #ffffff;
      .result-score {
        .result-title {
          display: flex;
          justify-content: space-between;
          height: 55px;
          align-items: center;
          .result-title-left {
            .titleImg {
            height: 20px;
            width: 20px;
          }
          }
          .result-title-right {
              .result-title-right-score {
                  font-size: 20px;
                    font-weight: bold;
                    line-height: 24px;
                    text-align: right;
                    letter-spacing: 0.22px;
                    color: #2685D2;
                    
              }
              .result-title-right-unit {
                  font-size: 14px;
                    font-weight: bold;
                    line-height: 17px;
                    text-align: right;
                    letter-spacing: 1.12px;
                    color: #2685D2;
                
              }
          }
        }
        .check-person {
           height: 25px;
          font-size: 14px;
          font-weight: normal;
          line-height: 17px;
          letter-spacing: 0.2px;
          color: #666666;
          display: flex;
          align-items: center;
        }
        .check-time {
            height: 25px;
          font-size: 14px;
          font-weight: normal;
          line-height: 17px;
          letter-spacing: 0.2px;
          color: #666666;
          display: flex;
          align-items: center;
          margin-bottom: 23px;
        }
      }
    }
}
</style>

<style lang="scss">
.rd-case-detail {
  .case-result {
    .van-button {
      font-weight: bold;
    }
  }
  .van-button {
    color: #2F7DCD;
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
}

</style>