<template>
  <div class="case-review-detail">
    <van-nav-bar title="病历审核详情" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
    <div style="height:46px"></div>
    <van-tabs v-model="active">
      <van-tab title="病历详情">
        <div class="caseDetail">
          <div style="height:44px"></div>
          <div class="case-detail-title">
            <div class="case-detail-title-top">{{ info.stuName }} - {{ info.stuCode }}</div>
            <div class="case-detail-title-bottom">{{ info.turnDeptName }} | {{ info.createTime }}</div>
          </div>
          <div class="caseContent">
            <div class="score-row">{{ info.name }}</div>
            <div class="pics">
              <div class="pic" v-for="(item,index) in picList" :key="index" @click="viewPic(index)">
                <img class="photo" :src="item" />
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="病历评分">
        <div class="eva-main">
          <div style="min-height: 80px">
            <p class="hosName">{{ tempDetail.title}}</p>
            <div class="tipps" v-if="tempDetail.description">
              <span v-if="tempDetail.description">*</span>
              {{tempDetail.description}}
            </div>
            <img src="../../assets/images/grade-pic.png" class="grade-pic" />
          </div>
          <div class="ggrade" v-if="isDetail">
            <div class="ggg">
              <div class="ggg-before"></div>
              <div class="ggg-last">审核评分结果：{{ tempDetail.score }}</div>
            </div>
            <div
              class="ttt"
            >审核人：{{tempDetail.evaluator}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价时间：{{ tempDetail.submitTime }}</div>
          </div>
          <div
            class="evaluateDetail"
            :class="{ evaDetail : isDetail }"
            v-if="tempDetail.evaList.length > 0"
          >
            <div v-for="(item,index) in tempDetail.evaList" class="grade-box" :key="index">
              <div class="grade-title">{{item.category}}</div>
              <div v-for="(iten,indey) in item.questionList" class="content-box" :key="indey">
                <span class="grade-content">{{iten.content}}</span>
                <span
                  v-if="iten.type == 1"
                  style="font-size: 16px;
                  color: #999999;
                  letter-spacing: 0.2px;
                  font-weight: 400;"
                >(单选题)</span>
                <span
                  v-if="iten.type == 2"
                  style="font-size: 16px;
                  color: #999999;
                  letter-spacing: 0.2px;
                  font-weight: 400;"
                >(多选题)</span>
                <span
                  v-if="iten.type == 4"
                  style="font-size: 16px;
                  color: #999999;
                  letter-spacing: 0.2px;
                  font-weight: 400;"
                >(星星等级)</span>
                <span
                  v-if="iten.type == 5"
                  style="font-size: 16px;
                  color: #999999;
                  letter-spacing: 0.2px;
                  font-weight: 400;"
                >(常用标签)</span>
                <span
                  v-if="iten.required== 1"
                  style="font-size: 16px;
                  color: #FF5500;
                  font-weight: 500;"
                >*</span>
                <!-- 单选框 -->
                <div v-if="iten.type == 1">
                  <van-radio-group v-model="iten.save" :disabled="isDetail">
                    <div v-for="(iteb,indez) in iten.items" class="dx" :key="indez">
                      <van-radio :name="iteb.id">{{iteb.content}}</van-radio>
                      <van-field
                        v-show="iteb.id == iten.save && iteb.reasonStatus == 1"
                        v-model="iteb.reasonComment"
                        placeholder="请输入原因"
                        rows="1"
                        autosize
                        :maxlength="50"
                        type="textarea"
                        :readonly="isDetail"
                      />
                    </div>
                  </van-radio-group>
                </div>
                <!-- 多选框 -->
                <div v-if="iten.type == 2" class="dx">
                  <van-checkbox-group
                    v-model="iten.save"
                    v-for="(iteb, indez) in iten.items"
                    :disabled="isDetail"
                    :key="indez"
                  >
                    <van-checkbox :key="iteb.id" :name="iteb.id">{{ iteb.content }}</van-checkbox>
                    <van-field
                      v-show="iten.save.indexOf(iteb.id) != -1 && iteb.reasonStatus == 1"
                      v-model="iteb.reasonComment"
                      placeholder="请输入原因"
                      rows="1"
                      autosize
                      :maxlength="50"
                      type="textarea"
                      :readonly="isDetail"
                    />
                  </van-checkbox-group>
                </div>
                <!-- 输入框 -->
                <div v-if="iten.type == 3">
                  <van-cell-group>
                    <van-field
                      v-model="iten.answerContent"
                      type="textarea"
                      placeholder="200字以内"
                      size="large"
                      rows="1"
                      autosize
                      :maxlength="200"
                      show-word-limit
                      :readonly="isDetail"
                    />
                  </van-cell-group>
                </div>
                <!-- 小星星 -->
                <div v-if="iten.type == 4">
                  <van-rate
                    :readonly="isDetail"
                    v-model="iten.answerStar"
                    :size="30"
                    color="#FCB62D"
                    void-color="#D6D6D6"
                  />
                </div>
                <div v-if="iten.type == 5" style="margin-top: 10px">
                  <div v-if="isDetail">
                    <span
                      v-for="(iteb,indez) in iten.items"
                      class="selBox"
                      :class="{ active: iteb.id == iten.save }"
                      :key="indez"
                    >{{ iteb.content }}</span>
                  </div>
                  <div v-else>
                    <span
                      v-for="(iteb,indez) in iten.items"
                      @click="select(iten,iteb)"
                      class="selBox"
                      :class="{ active: iteb.id == iten.save }"
                      :key="indez"
                    >{{ iteb.content }}</span>
                  </div>
                </div>
                <div v-if="iten.type == 6" class="dx">
                  <div class="scorll-item">
                    <van-slider
                      v-model="iten.answerScore"
                      :step="0.5"
                      min="0"
                      :max="iten.score"
                      :disabled="isDetail"
                    />
                    <span style="width: 20px"></span>
                    <van-stepper
                      v-model="iten.answerScore"
                      min="0"
                      :max="iten.score"
                      step="0.5"
                      disable-input
                      :disabled="isDetail"
                    />
                  </div>
                  <van-field
                  v-show="!!iten.reasonStatus"
                  v-model="iten.answerReasonComment"
                  placeholder="请输入描述"
                  rows="1"
                  autosize
                  :maxlength="50"
                  type="textarea"
                  :readonly="isDetail"
                />
                </div>
              </div>
            </div>
            <div style="height: 44px"></div>
          </div>
          <div class="nodata" v-else>
            <img src="../../assets/images/no-grade.png" />
            <div class="nodataText">该科室暂无评分表</div>
          </div>
          <div style="height: 44px"></div>
        </div>

        <div class="btnGroup" v-if="tempDetail.evaList.length > 0 && !isDetail">
          <van-button type="info" @click="submit">提交</van-button>
        </div>
      </van-tab>
    </van-tabs>

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
import cHeader from "../header";
import methods from "../../methods";
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
      info: {},
      picList: [],
      picViewList: [],
      index: 0,
      businessId: "",
      turnPlanDetailId: "",
      tempDetail: {
        id: "",
        title: "",
        description: "",
        score: "",
        submitTime: "",
        evaluator: "",
        evaList: []
      },
      targetId: "",
      isDetail: false
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    ...methods,
    ...mapActions(["setTurninfo", "setTurnManual"]),
    getDetail() {
      let self = this;
      self
        .get("/base/largeMedicalRecord/detail/" + this.$route.query.id)
        .done(res => {
          if (res.resCode == 200) {
            self.info = res.model;
            self.picList = res.model.fileList;
            self.getEvaDetail(res.model.id, res.model.turnDeptId);
            self.businessId = res.model.id;
            self.targetId = res.model.stuId;
            self.turnPlanDetailId = res.model.turnPlanDetailId;
          }
        });
    },
    getCurrentTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hour = ("0" + date.getHours()).slice(-2);
      const minute = ("0" + date.getMinutes()).slice(-2);
      const second = ("0" + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    getEvaDetail(businessId, deptId, turn_plan_detail_id) {
      let self = this;
      let params = {
        command: "scoreSubmitRecord/detail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        businessId: businessId,
        category: 4,
        type: 1
      };
      self.post("/scoreSubmitRecord/detail", params).done(res => {
        if (res.errcode == "0") {
          self.tempDetail.id = res.id;
          self.tempDetail.title = res.name;
          self.tempDetail.description = res.description;
          res.questions.forEach(i => {
            i.questionList.forEach(j => {
              if (j.type == 2) {
                j.save = [];
                j.items.forEach(k => {
                  if (k.selected == true) {
                    j.save.push(k.id);
                  }
                });
              } else if (j.type == 1 || j.type == 5) {
                j.save = [];
                j.items.forEach(k => {
                  if (k.selected == true) {
                    j.save = k.id;
                  }
                });
              } else {
                j.save = "";
              }
            });
          });
          self.tempDetail.score = Number(res.score);
          self.tempDetail.submitTime = res.submitTime;
          self.tempDetail.evaluator = res.evaluator;
          self.tempDetail.evaList = res.questions;
          self.isDetail = true;
        } else {
          self.getEvaTemp(deptId);
        }
      });
    },
    getEvaTemp(deptId) {
      let self = this;
      let params = {
        command: "scoreTemplate/getAvailableTemplateDetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        category: 4,
        type: 1,
        deptId: deptId
      };
      self
        .post("/scoreTemplate/getAvailableTemplateDetail", params)
        .done(res => {
          self.tempDetail.id = res.id;
          self.tempDetail.title = res.name;
          self.tempDetail.description = res.description;
          res.questions.forEach(i => {
            i.questionList.forEach(j => {
              if (j.type == 2) {
                j.save = [];
                j.items.forEach(k => {
                  if (k.selected == true) {
                    j.save.push(k.id);
                  }
                });
              } else if (j.type == 1 || j.type == 5) {
                j.save = [];
                j.items.forEach(k => {
                  if (k.selected == true) {
                    j.save = k.id;
                  }
                });
              } else if (j.type == 6) {
                j.answerScore  = j.score
                    j.answerReasonComment = ""
              } else {
                j.save = "";
              }
            });
          });
          self.tempDetail.evaList = res.questions;
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
        name: "fdRotation_doctor_case_eva"
        // query: {
        //   businessid: self.$route.query.id
        // }
      });
    },
    onClickLeft() {
      let self = this;
      this.$router.push({
        name: "caseReviewHome"
      });
    },
    select(item, iten) {
      let self = this;
      self.tempDetail.evaList.forEach(i => {
        i.questionList.forEach(j => {
          if (j.id == item.id) {
            j.save = iten.id;
          }
        });
      });
    },
    submit() {
      let self = this;
      Dialog.confirm({
        message: "提交后不可修改，确定要提交吗?",
        color: "#1989fa"
      })
        .then(() => {
          // let canSubmit = true;
          let n = 0;
          self.tempDetail.evaList.forEach(i => {
            i.questionList.forEach(j => {
              if (
                j.required == 1 &&
                (j.type == 1 || j.type == 2 || j.type == 5) &&
                (j.save == "" || j.save == [])
              ) {
                console.log("error");
                n += 1;
              } else if (j.required == 1 && j.type == 3) {
                if (!j.answerContent) {
                  n += 1;
                }
              } else if (j.required == 1 && j.type == 4 && j.answerStar == "") {
                n += 1;
              }
            });
          });
          if (n == 0) {
            self.formSubmit();
          } else {
            Toast("您还有" + n + "道题没填");
          }
        })
        .catch(() => {});
    },
    formSubmit() {
      let self = this;
      let answers = [];
      console.log(self.gradeList);
      self.tempDetail.evaList.forEach(i => {
        i.questionList.forEach(j => {
          if (j.type == 2) {
            j.items.forEach(k => {
              if (j.save.indexOf(k.id) != -1) {
                let obj = {
                  scoringQuestionId: k.scoringQuestionId,
                  scoringOptionId: k.id,
                  content: "",
                  star: "",
                  reasonComment: k.reasonComment ? k.reasonComment : ""
                };
                answers.push(obj);
              }
            });
          } else if (j.type == 1 || j.type == 5) {
            j.items.forEach(k => {
              if (j.save == k.id) {
                let obj = {
                  scoringQuestionId: k.scoringQuestionId,
                  scoringOptionId: k.id,
                  content: "",
                  star: "",
                  reasonComment: k.reasonComment ? k.reasonComment : ""
                };
                answers.push(obj);
              }
            });
          } else if (j.type == 3) {
            if (j.answerContent) {
              let obj = {
                scoringQuestionId: j.id,
                scoringOptionId: "",
                content: j.answerContent ? j.answerContent : "",
                star: "",
                reasonComment: ""
              };
              answers.push(obj);
            }
          } else if (j.type == 4) {
            let obj = {
              scoringQuestionId: j.id,
              scoringOptionId: "",
              content: "",
              star: j.answerStar ? j.answerStar : 0,
              reasonComment: ""
            };
            answers.push(obj);
          } else if (j.type == 6) {
            let obj = {
              scoringQuestionType: 6,
              scoringQuestionId: j.id,
              scoringOptionId: "",
              content: "",
              star: "",
              reasonComment: "",
              score: j.answerScore,
              reasonComment: j.answerReasonComment
            };
            answers.push(obj);
          }
        });
      });
      console.log(answers);
      let params = {
        command: "scoreSubmitRecord/submit",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        scoringTemplateId: self.tempDetail.id,
        businessId: self.businessId,
        // id: self.businessId,
        targetId: self.targetId,
        submitType: 1,
        answers
      };
      console.log(params);
      self.post("/scoreSubmitRecord/submit", params).done(res => {
        if (res.errcode == "0") {
          Toast("保存成功");
          self
            .post("/base/largeMedicalRecord/update", {
              id: self.businessId,
              scoringSubmitRecordId: res.id,
              auditStatus: 1,
              auditor: $.cookie("uid"),
              auditTime: self.getCurrentTime(),
              turnPlanDetailId: self.turnPlanDetailId
            })
            .done(res => {
              console.log(res);
              this.getDetail();
            });
        } else {
          Toast("保存失败");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.eva-main {
  padding-top: 46px;
  font-size: 0.24rem;
  color: rgb(100, 100, 100);
  background-image: linear-gradient(90deg, #78c2f5 0%, #1052d5 100%) !important;
}
.scorll-item {
  display: flex;
  align-items: center;
  margin: 0px 20px;
}
.case-review-detail {
  position: fixed;
      right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: scroll;
  /* height: calc(100ch - 90px); */
  .score-row {
    font-size: 17px;
    font-weight: bold;
    line-height: 19px;
    letter-spacing: 0.2px;
    color: #333333;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 10px;
    padding: 20px 20px 4px 20px;
  }
  .caseDetail {
    background: linear-gradient(148deg, #628bb6 3%, #a2bcd8 83%);
    padding: 0px 10px 20px 10px;
    height: 100%;
    .caseContent {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      height: calc(100% - 128px);
      background: #fff;
    }
    .case-detail-title {
      height: 87px;
      display: flex;
      flex-direction: column;
      .case-detail-title-top {
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        letter-spacing: 0.24px;
        color: #ffffff;
        margin: 16px 0px 8px 0px;
      }
      .case-detail-title-bottom {
        font-size: 13px;
        font-weight: normal;
        line-height: 22.5px;
        letter-spacing: 0.17px;
        opacity: 0.7;
        color: #ffffff;
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
        border-radius: 15px;
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
        border-radius: 6px;
        background: #f8fbff;
        border: 0.8px solid rgba(204, 220, 237, 1);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
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
            font-weight: normal;
            line-height: 24px;
            text-align: right;
            letter-spacing: 0.22px;
            color: #2685d2;
          }
          .result-title-right-unit {
            font-size: 14px;
            font-weight: normal;
            line-height: 17px;
            text-align: right;
            letter-spacing: 1.12px;
            color: #2685d2;
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
.title {
  color: black;
  text-align: center;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;
  font-size: 0.26rem;
  p {
    padding: 0.2rem 0;
  }
}

.explain {
  height: auto;
  padding: 0.1rem;
  font-size: 0.24rem;
  background: rgb(244, 226, 198);
}

.explain span {
  color: red;
}

.evaluateDetail {
  margin: 0 0px 0px 0px;
  background: white;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
  &.evaDetail {
    margin: 0 10px 10px 10px;
    background: white;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
}

.nodata {
  background: #ffffff;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 132px;
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

.evaluateDetail ul li {
  border-bottom: solid 0.01rem rgb(240, 240, 240);
  padding: 0.1rem 0;
  font-size: 0.22rem;
}
.evaluateDetail ul li:nth-last-of-type(1) {
  border: none;
}
.evaluateDetail ul li p:nth-last-of-type(1) input {
  position: relative;
  top: 0.06rem;
}
.header {
  min-height: 85px;
  padding: 0.2rem;
  color: #ffffff;
  font-size: 0.26rem;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.hosName {
  word-wrap: break-word;
  word-break: break-all;
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0.24px;
  font-weight: 500;
  z-index: 3 !important;
  padding-top: 6px;
  max-width: 218px;
  margin: 10px 0px 10px 20px;
}
.hosTitle {
  opacity: 0.7;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
  z-index: 3 !important;
}
.tipps {
  word-wrap: break-word;
  word-break: break-all;
  opacity: 0.7;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
  z-index: 3 !important;
  margin: 0px 0px 10px 20px;
  padding-bottom: 10px;
}
.grade-pic {
  height: 99px;
  width: 172px;
  position: absolute !important;
  right: 0px;
  top: 46px;
  z-index: 0 !important;
}
.radio {
  width: 0.25rem;
  height: 0.25rem;
  position: relative;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  border-top-left-radius: 0.15rem;
  border-top-right-radius: 0.15rem;
  border-bottom-left-radius: 0.15rem;
  border-bottom-right-radius: 0.15rem;
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;

  background-image: url("../../assets/images/gouxuan.png");
  background-size: cover;
  margin-right: 0.05rem;
}

.radio:checked {
  background-image: url("../../assets/images/gouxuan_on.png");
  background-size: cover;
}
.teacher {
  margin: 0.1rem 0;
  padding: 0.1rem;
  background: white;
}
.teacher label {
  position: relative;
  top: -0.08rem;
  margin-top: 0.1rem;
  margin-left: 0.2rem;
}
.teacher label:nth-last-of-type(1) {
  margin-left: 1.2rem;
}
.teacher label input {
  position: relative;
  top: 0.08rem;
}
.advise {
  margin: 0 10px 10px 10px;
  padding: 0.1rem;
  background: white;
  border-bottom-left-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
}
.advise textarea {
  width: 100%;
  height: 2rem;
  border: solid 0.01rem #c3c3c3;
  padding: 0.1rem;
}
.remark {
  padding: 0.1rem;
  font-size: 0.2rem;
}
.remark div {
  padding-left: 0.5rem;
  display: flow-root;
}
.remark div p {
  width: 50%;
  float: left;
}
.noclick {
  pointer-events: none;
}
.pack {
  width: 100%;
  padding: 0.1rem;
  border: 0.01rem solid #c3c3c3;
}
.evaluationList li p {
  font-size: 15px;
  color: #333333;
  letter-spacing: 0.2px;
  font-weight: 400;
}
.small li div {
  display: flex;
  span {
    width: 0;
    flex: 1;
  }
}
.grade-box {
  padding: 20px 0 0 0px;
  border-bottom: 1px solid #e2e2e2;
  margin: 0px 16px;
  .grade-title {
    margin-bottom: 20px;
    font-size: 17px;
    color: #333333;
    letter-spacing: 0.21px;
    font-weight: 600;
  }
  .content-box {
    margin-bottom: 20px;
    .grade-content {
      word-wrap: break-word;
      word-break: break-all;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0.2px;
      font-weight: 400;
    }
  }
}
.selBox {
  display: inline-block;
  width: auto;
  height: auto;
  padding: 5px;
  margin: 2px;
  background: #f1f3f7;
  border-radius: 6px;
  &.active {
    background: #2685d2;
    color: #ffffff;
  }
}
.btnGroup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #ffffff;
  padding: 7px 20px;
  border-top: 1px solid #e2e2e2;
}

.ggrade {
  background: #ffffff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  margin: 0 10px 14px 10px;
  padding: 0px 16px;
  .ggg {
    font-size: 17px;
    color: #111111;
    letter-spacing: 0.2px;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-top: 4px;
    .ggg-before {
      width: 3px;
      height: 16px;
      background: #2f7dcd;
      margin-right: 8px;
    }
    .ggg-last {
      margin: 14px 0px 14px 0px;
    }
  }
  .ttt {
    font-size: 13px;
    color: #999999;
    letter-spacing: 0.17px;
    line-height: 22.5px;
    font-weight: 400;
    margin-bottom: 14px;
  }
}
</style>

<style lang="scss">
.btnGroup {
  .van-button {
    font-weight: bold;
  }
}
.van-radio__label {
  font-size: 16px;
  word-wrap: break-word;
  word-break: break-all;
}
.case-review-detail {
  .van-checkbox__icon {
    font-size: 22px;
  }
  .van-button--info {
    background-color: #2685d2;
    border-radius: 4px;
  }
  .van-radio__icon {
    font-size: 22px;
  }
  .van-tabs__line {
    background: #2f7dcd;
  }
  .van-tab--active {
    color: #2f7dcd;
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
  .van-tabs__wrap {
    position: fixed;
    z-index: 1;
    width: 100%
  }
  .van-tabs {
    height: 100%;
    .van-tabs__content {
      height: 100%;
      .van-tab__pane {
        height: 100%;
      }
    }
  }
  .select-menu {
    .select-item {
      .se-text {
        &.active {
          color: #2f7dcd;
        }
      }
      .van-icon {
        transform: rotate(90deg);
        &.active {
          color: #2f7dcd;
          transform: rotate(-90deg);
        }
      }
    }
  }
  .van-picker {
    .van-picker__cancel {
      line-height: 44px;
    }
    .van-picker__title {
      line-height: 44px;
    }
    .van-picker__confirm {
      line-height: 44px;
    }
  }
  .van-search {
    padding-top: 0px;
    margin-bottom: 12px;
    .van-field__left-icon {
      display: flex;
      align-items: center;
      .van-icon {
        margin-top: 4px;
      }
    }
  }
  .grade-content {
    .btn-group {
      .van-button {
        height: 28px;
        line-height: 28px;
        margin-right: 8px;
      }
    }
  }
  .van-radio {
    margin-top: 10px;
  }
  .van-cell-group {
    margin-top: 10px;
    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 4px;
  }
  .dx {
    .van-cell {
      padding-left: 0px;
      padding-right: 0px;
      .van-cell__value {
        display: flex;
        align-items: center;
        border: 1px solid #e2e2e2;
        border-radius: 3px;
        min-height: 28px;
        .van-field__body {
          width: 100%;
          margin-left: 20px;
        }
      }
    }
  }
  .van-rate {
    margin-top: 10px;
  }
  .van-checkbox-group {
    .van-checkbox {
      margin-top: 10px;
    }
  }
  .van-button {
    width: 100%;
  }
  .van-checkbox__label--disabled {
    color: #323233;
  }
  .van-button--plain {
    background-color: #fff;
  }
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