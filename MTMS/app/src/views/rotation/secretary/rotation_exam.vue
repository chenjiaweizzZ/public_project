<template>
  <div class="rotation_exam">
    <div class="valuated-info">
      <div class="info-top">
        <span class="line-before"></span>
        <span class="info-name">学员:{{ info.name }}&nbsp;&nbsp;{{ info.username }}</span>
        <span class="turn-grade" v-if="info.gradeTxt">{{ info.gradeTxt }}</span>
      </div>
      <info class="info-bottom">
        <span>轮转科室:{{ info.deptName }}</span>
        <span style="width:20px"></span>
        <span>培训专业:{{ info.profIdTxt }}</span>
      </info>
    </div>
    <div class="exam-content">
      <div class="exam-content-item" v-for="(item,index) in examList" :key="index">
        <div class="exam-content-title">要求：{{ item.content }}</div>
        <div class="exam-content-reality">
          <span>
            实际:{{ rtReality(item.associatedBusiness,item.completeness
            ) }}
          </span>
          <span class="btnBox" v-if="item.associatedBusiness == 3 && JSON.parse(item.completeness).length">
            <span class="viewTitle" @click="detailShow(item)">查看详情</span>
            <span class="arrow-right"></span>
          </span>
        </div>
        <div class="exam-content-choice">
          <van-radio-group v-model="item.auditRes" direction="horizontal">
            <van-radio :name="1">是</van-radio>
            <span style="width:41px"></span>
            <van-radio :name="0">否</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="exam-exam">
        <div class="eetop">整体审核意见</div>
        <div class="eemiddle">是否符合出科条件</div>
        <van-radio-group v-model="examResult" direction="horizontal">
          <van-radio :name="1">是</van-radio>
          <span style="width:41px"></span>
          <van-radio :name="0">否</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="btn-row">
      <div class="xx-line"></div>
      <div class="btn-rowa">
        <span class="btnLeft">
        <van-button type="default" @click="viewExamBefore()">审核记录</van-button>
      </span>
      <span class="btnMiddle"></span>
      <span class="btnRight">
        <van-button type="info" @click="submit()" :disabled="rtSubmit()">提交</van-button>
      </span>
      </div>
    </div>
    <van-dialog v-model="show" title="详情" confirmButtonColor="#2685D2">
      <div class="outList">
        <div class="outListItem" v-for="(item,index) in showList" :key="index">
          <div class="outListItemL">
            <span class="outListItemLeft">{{ item.name }}</span>
          <span class="outListItemRight" v-if="item.auditStatus">
            <span class="itemScore">{{ item.score }}</span>
            <span class="itemFen">分</span>
          </span>
          <span class="outListItemRightD" v-else>
            待评分
          </span>
          </div>
          <div class="outListItemAu" v-if="item.auditStatus">审核人:{{ item.auditorName }}</div>
          <div class="x-line"></div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Toast } from "vant";
import $ from "jquery";
import methods from "../../../methods";
export default {
  name: "rotation_exam",
  data() {
    return {
      info: {},
      examList: [],
      examResult: "",
      show: false,
      showList: [
      ]
    };
  },
  mounted() {
    this.getExamList();
  },
  methods: {
    ...methods,
    getExamList() {
      let self = this;
      self
        .post(
          `/base/turnexamaudititem/getStdTurnExamAuditItem?turnPlanDetailId=${Number(
            this.$route.query.id
          )}`
        )
        .done(res => {
          if (res.resCode == 200) {
            self.info = res.model;
            self.examList = res.model.turnExamAuditItemVoList.map(i => {
              return {
                content: i.content,
                associatedBusiness: i.associatedBusiness,
                completeness: i.completeness,
                auditRes: ""
              };
            });
          }
        });
    },
    rtReality(associatedBusiness, completeness) {
      if (associatedBusiness == 1) {
        // return "考勤签到率" + completeness;
        return "";
      } else if (associatedBusiness == 2) {
        // return "教学活动签到率" + completeness;
        return "";
      } else if (associatedBusiness == 3) {
        return "已提交" + JSON.parse(completeness).length + "份";
      } else {
        return "";
      }
      return associatedBusiness + completeness;
    },
    submit() {
      let self = this;
      let params = {
        turnPlanDetailId: this.$route.query.id,
        auditRes: self.examList,
        auditStatus: self.examResult,
        auditUserId: $.cookie("uid")
      };
      self.post(`/base/turnexamaudit/add`, params).done(res => {
        if (res.resCode == 200) {
          Toast("提交成功");
          this.$router.push({
            name: "fdRotation_secretary"
          });
        } else {
          Toast("提交失败");
        }
      });
    },
    rtSubmit() {
      let self = this;
      let rtSubmit = false;
      self.examList.forEach(i => {
        if (i.auditRes === "") {
          rtSubmit = true;
        }
      });
      if (self.examResult === "") {
        rtSubmit = true;
      }
      return rtSubmit;
    },
    viewExamBefore() {
      let self = this;
      let item;
      self.info.turnExamAuditItemVoList.forEach(i => {
        if(i.associatedBusiness == 3) {
          item = i
        }
      })
      console.log("item",item)
      if (self.info.latestTurnExamAuditId) {
        this.$router.push({
          name: "fdRotation_OutExamDetail",
          query: {
            id: self.info.latestTurnExamAuditId,
            oriId: self.$route.query.id,
            ids: item.completeness
          }
        });
      } else {
        this.$router.push({
          name: "fdRotation_OutExamDetail",
          query: {
            id: "",
            name: self.info.name,
            code: self.info.username,
            turngradeTxt: self.info.gradeTxt,
            deptName: self.info.deptName,
            profIdTxt: self.info.profIdTxt
          }
        });
      }
    },
    detailShow(item) {
      let self = this;
      // self
      //   .post(
      //     "/base/largeMedicalRecord/list?turnPlanDetailId=" +
      //       this.$route.query.id,
      //   )
      //   .done(res => {
      //     if (res.resCode == 200) {
      //       self.showList = res.model;
      //     }
      //   });
      self
        .post(
          "/base/largeMedicalRecord/listByIds",
          { 
            ids: JSON.parse(item.completeness).map(i => i.id)
           }
        )
        .done(res => {
          if (res.resCode == 200) {
            self.showList = res.model;
          }
        });
      self.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.rotation_exam {
  background-image: linear-gradient(90deg, #78c2f5 0%, #1052d5 100%);
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .xx-line {
      height: 1px;
      background: rgba(255, 255, 255, 0.01);
      box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    }
  .valuated-info {
    background: #ffffff;
    margin: 14px 10px 10px;
    border-radius: 6px;
    padding: 16px 16px 12px 16px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    .info-top {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .line-before {
        background: #2f7dcd;
        width: 3px;
        height: 16px;
        margin-right: 8px;
      }
      .info-name {
        font-size: 17px;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: 0.2px;
        color: #111111;
        margin-right: 5px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .turn-grade {
        color: #2f7dcd;
        font-size: 12px;
        border: 0.7px solid #2f7dcd;
        border-radius: 6px;
        line-height: 16px;
        padding: 0px 5px;
        min-width: 55px;
      }
    }
    .info-bottom {
      white-space: nowrap;
      padding: 0px 16px 12px 0px;
      font-size: 13px;
      font-weight: normal;
      line-height: 22.5px;
      letter-spacing: 0.17px;
      color: #999999;
    }
  }
  .exam-content {
    position: fixed;
    top: 108px;
    left: 0;
    bottom: 62px;
    right: 0;
    background: #fff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 20px 12px;
    overflow: scroll;
    .exam-content-item {
      margin-bottom: 20px;
      .exam-content-title {
        font-size: 16px;
        font-weight: normal;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #333333;
        word-wrap: break-word;
        word-break: break-all;
      }
      .exam-content-reality {
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0.15px;
        color: #2685d2;
        margin: 7px 0px 15px 0px;
        display: flex;
        justify-content: space-between;
        .btnBox {
          opacity: 0.8;
          border: 1px solid rgba(123, 149, 177, 1);
          height: 18px;
          width: 78px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          .viewTitle {
            line-height: 18px;
            font-size: 12px;
            color: #7b95b1;
            font-weight: 400;
          }
          .arrow-right {
            height: 20px;
            width: 10px;
            display: inline-block;
            position: relative;
          }
          .arrow-right::after {
            content: "";
            height: 7px;
            width: 7px;
            top: 6px;
            border-width: 1px 1px 0 0;
            border-color: #7b95b1;
            border-style: solid;
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: absolute;
          }
        }
      }
      .exam-content-choice {
      }
    }
    .x-line {
      height: 1px;
      background: rgba(255, 255, 255, 0.01);
      box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    }
    .exam-exam {
      margin-top: 20px;
      .eetop {
        font-size: 17px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: 0.21px;
        color: #333333;
      }
      .eemiddle {
        font-size: 16px;
        font-weight: normal;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #333333;
        margin: 22px 0px 15px 0px;
      }
    }
  }
  .btn-row {
    height: 62px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    // padding: 8px 14px 8px 10px;

    // border-top: 1px solid #e2e2e2;
    .btn-rowa {
      // margin-top: 8px;
      display: flex;
      align-items: center;
      margin: 8px 10px 0px 10px;
      .btnLeft {
      flex: 8;
    }
    .btnMiddle {
      flex: 1;
    }
    .btnRight {
      flex: 16;
    }
    }
  }
  .outList {
    .x-line {
      margin-top: 20px;
      height: 1px;
      background: rgba(255, 255, 255, 0.01);
      box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    }
    .outListItem {
      // border-bottom: 0.06em solid #E2E2E2;
    /* padding-right: 14px; */
      margin-left: 14px;
      margin-right: 14px;
      // padding-bottom: 19px;
    }
    .outListItemL {
      display: flex;
      justify-content: space-between;
      margin: 15px 10px 0px 10px;
      .outListItemLeft {
        font-size: 16px;
        font-weight: normal;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
      }
      .outListItemRight {
        min-width: 45px;
        .itemScore {
          font-size: 20px;
          font-weight: 700;
          line-height: 24px;
          text-align: right;
          letter-spacing: 0.22px;
          color: #2685d2;
        }
        .itemFen {
          font-size: 14px;
          font-weight: 700;
          line-height: 17px;
          text-align: right;
          letter-spacing: 1.12px;
          color: #2685d2;
        }
      }
      .outListItemRightD {
        min-width: 45px;
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        text-align: right;
        letter-spacing: 0.25px;
        color: #999999;
      }
    }
    .outListItemAu {
      font-size: 10px;
      margin: 0px 10px 0px 10px;
    }
  }
}
</style>

<style lang="scss">
.rotation_exam {
  .van-button {
    width: 100%;
    margin-left: 0px;
    border-radius: 4px;
    font-size: 17px;
    font-weight: 400 !important;
  }
  .van-dialog__header {
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.2px;
    padding-bottom: 10px;
    color: #111111;
  }
  .van-dialog__content {
    min-height: 172px;
  }
}
</style>