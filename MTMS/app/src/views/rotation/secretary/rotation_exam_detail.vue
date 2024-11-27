<template>
  <div class="rotation_exam_detail">
    <div class="valuated-info">
      <div class="info-top">
        <span class="line-before"></span>
        <span class="info-name">学员:{{ info.name }}&nbsp;&nbsp;{{ info.code }}</span>
        <span class="turn-grade" v-if="info.turngradeTxt">{{ info.turngradeTxt }}</span>
      </div>
      <info class="info-bottom">
        <span>轮转科室:{{ info.deptName }}</span>
        <span style="width:20px"></span>
        <span>培训专业:{{ info.profIdTxt }}</span>
      </info>
    </div>
    <div class="exam-content" v-if="notFirst">
      <div class="exam-content-item" v-for="(item,index) in examList" :key="index">
        <div class="exam-content-title">要求{{ item.content }}</div>
        <div class="exam-content-reality">
          <span>
            实际:{{ rtReality(item.associatedBusiness,item.completeness
          ) }}
          </span>
          <!-- <span class="btnBox" v-if="item.associatedBusiness == 3 && JSON.parse(item.completeness).length"> -->
            <span class="btnBox" v-if="item.associatedBusiness == 3 && JSON.parse(item.completeness).length">
            <span class="viewTitle" @click="detailShow(item)">查看详情</span>
            <span class="arrow-right"></span>
          </span>
        </div>
        <div class="exam-content-choice">
          <van-radio-group v-model="item.auditRes" direction="horizontal" :disabled="true">
            <van-radio :name="1">是</van-radio>
            <span style="width:41px"></span>
            <van-radio :name="0">否</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="x-line"></div>
      <div class="exam-exam">
        <div class="eetop">整体审核意见</div>
        <div class="eemiddle">是否符合出科条件</div>
        <van-radio-group v-model="info.auditStatus" direction="horizontal" :disabled="true">
          <van-radio :name="1">是</van-radio>
          <span style="width:41px"></span>
          <van-radio :name="0">否</van-radio>
        </van-radio-group>
      </div>
      <div class="x-line"></div>
      <div class="exam-info">
        <div class="examer">审核人:{{ info.auditUser }}</div>
        <div class="exam-time">审核时间: {{ info.auditTime }}</div>
      </div>
    </div>
    <div v-else class="exam-nodata">
      <img src="../../../assets/images/no-grade.png" />
      <div class="nodataText">暂无审核记录</div>
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
      show: false,
      showList: [],
      info: {},
      examList: [],
      examResult: "",
      notFirst: true,
      tableData: []
    };
  },
  mounted() {
    this.getIsFirstExam();
  },
  methods: {
    ...methods,
    getDetailList() {
      let self = this;
      self
        .get(`/base/turnexamaudit/detail?id=${this.$route.query.id}`)
        .done(res => {
          if (res.resCode == 200) {
            self.info = res.model;
            self.examList = res.model.auditRes;
            res.model.auditRes.forEach((item) => {
            if (item.associatedBusiness == 3) {
              this.tableData = JSON.parse(item.completeness)
            }
          });
          }
        });
      // self
      //   .post(`/base/largeMedicalRecord/listByIds`,{
      //     ids: JSON.parse(this.$route.query.ids)
      //   })
      //   .done(res => {
      //     if (res.resCode == 200) {
      //       self.info = res.model;
      //       self.examList = res.model.auditRes;
      //     }
      //   });
    },
    getIsFirstExam() {
      let self = this;
      if (this.$route.query.id) {
        self.notFirst = true;
        this.getDetailList();
      } else {
        self.notFirst = false;
        self.info = {
          name: this.$route.query.name,
          username: this.$route.query.username,
          gradeTxt: this.$route.query.gradeTxt,
          deptName: this.$route.query.deptName,
          profIdTxt: this.$route.query.profIdTxt
        };
      }
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
      this.$router.push({
        name: "fdRotation_OutExamDetail",
        query: {
          id: self.info.latestTurnExamAuditId
        }
      });
    },
    detailShow(item) {
      let self = this;
      // self
      //   .post(
      //     "/base/largeMedicalRecord/list?turnPlanDetailId=" +
      //       this.$route.query.oriId
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
            res.model.forEach(i => {
              this.tableData.forEach(j => {
                if(i.id == j.id) {
                  i.auditStatus = j.auditStatus
                }
              })
            })
            self.showList = res.model;

          }
        });
      self.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.rotation_exam_detail {
  background-image: linear-gradient(90deg, #78c2f5 0%, #1052d5 100%);
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
  .valuated-info {
    background: #ffffff;
    margin: 14px 10px 10px;
    border-radius: 6px;
    padding: 16px 16px 12px 16px;
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
        font-weight: normal;
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
        min-width: 52px;
      }
    }
    .info-bottom {
      padding: 0px 16px 12px 0px;
      font-size: 13px;
      font-weight: normal;
      line-height: 22.5px;
      letter-spacing: 0.17px;
      color: #999999;
    }
  }
  .exam-content {
    background: #fff;
    border-radius: 6px;
    padding: 20px 12px 0px 12px;
    margin: 0px 10px 20px 10px;
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
      margin: 20px 0px;
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
    .exam-info {
      padding: 12px 0px 15px 0px;
      .examer {
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        color: #666666;
      }
      .exam-time {
        margin-top: 7px;
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        color: #666666;
      }
    }
  }
  .exam-nodata {
    position: fixed;
    top: 108px;
    left: 10px;
    bottom: 20px;
    right: 10px;
    background: #fff;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      margin-top: 100px;
      height: 138px;
      width: 280px;
    }
    .nodataText {
      font-size: 17px;
      color: #868e97;
    }
  }
  .outList {
    .outListItem {
      border-bottom: 1px dashed #E2E2E2;
    /* padding-right: 14px; */
      margin-left: 14px;
      margin-right: 14px;
    }
    .outListItemL {
      display: flex;
      justify-content: space-between;
      margin: 15px 20px 1px 20px;
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
          font-weight: normal;
          line-height: 24px;
          text-align: right;
          letter-spacing: 0.22px;
          color: #2685d2;
        }
        .itemFen {
          font-size: 14px;
          font-weight: normal;
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
      margin: 0px 20px 10px 20px;
    }
  }
}
</style>

<style lang="scss">
.rotation_exam_detail {
  .van-button {
    width: 100%;
    margin-left: 0px;
  }
  // .van-button--plain {
  //   background-color: #fff;
  // }
  .van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon {
    color: #fff;
    border-color: #1989fa;
    background-color: #2685d2;
  }
  .van-radio__label--disabled {
    color: #323233;
  }
  .van-radio__icon--disabled.van-radio__icon--checked .van-icon {
    color: #fff;
    border-color: #1989fa;
    background-color: #1989fa;
  }
}
</style>