<template>
  <div class="supervise-grade">
    <van-nav-bar title="评分" left-arrow @click-left="back">
    </van-nav-bar>
    <div class="g-main">
      <div class="header">
        <div>
          <p class="hosName" v-if="gradeList.length > 0">{{title}}</p>
        </div>
        <div class="tipps" v-if="gradeList.length > 0">
          <span>*</span>
          {{description}}
        </div>
        <img src="../../../assets/images/grade-pic.png" class="grade-pic" />
      </div>
      <div class="ggrade" v-if="type == 1">
        <div class="ggg">
          <div class="ggg-before"></div>
          <div class="ggg-last">评分：{{ score }}</div>
        </div>
        <div class="ttt">评价时间：{{ submitTime }}</div>
      </div>
      <div class="evaluateDetail" :class="{ evaDetail : type == 1 }" v-if="gradeList.length > 0">
        <div v-for="(item,index) in gradeList" class="grade-box" :key="index">
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
              <van-radio-group v-model="iten.save" :disabled="type == 1">
                <div v-for="(iteb,indez) in iten.items" class="dx" :key="indez">
                  <van-radio :name="iteb.id" @click="radioClick(iteb)">{{iteb.content}}</van-radio>
                  <van-field
                    v-show="iteb.id == iten.save && iteb.reasonStatus == 1"
                    v-model="iteb.reasonComment"
                    placeholder="请输入原因"
                    rows="1"
                    autosize
                    :maxlength="50"
                    type="textarea"
                    :readonly="type == 1"
                  />
                </div>
              </van-radio-group>
            </div>
            <!-- 多选框 -->
            <div v-if="iten.type == 2" class="dx">
              <van-checkbox-group
                v-model="iten.save"
                v-for="(iteb, indez) in iten.items"
                :disabled="type == 1"
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
                  :readonly="type == 1"
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
                  :readonly="type == 1"
                />
              </van-cell-group>
            </div>
            <!-- 小星星 -->
            <div v-if="iten.type == 4">
              <van-rate
                :readonly="type == 1"
                v-model="iten.answerStar"
                :size="30"
                color="#FCB62D"
                void-color="#D6D6D6"
              />
            </div>
            <div v-if="iten.type == 5" style="margin-top: 10px">
              <div v-if="type == 1">
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
            <div v-if="iten.type == 6">
              <div class="scorll-item">
                <van-slider v-model="iten.answerScore" :step="0.5" min="0" :max="iten.score"  :disabled="type == 1"/>
                <span style="width: 20px"></span>
                <van-stepper v-model="iten.answerScore" min="0" :max="iten.score" step="0.5" disable-input  :disabled="type == 1"/>
              </div>
              <van-field
                  v-show="!!iten.reasonStatus"
                  v-model="iten.answerReasonComment"
                  placeholder="请输入描述2"
                  rows="1"
                  autosize
                  :maxlength="50"
                  type="textarea"
                  :readonly="type == 1"
                />
            </div>
          </div>
        </div>
      </div>
      <div class="nodata" v-else>
        <img v-if="description" src="../../../assets/images/no-grade.png" />
        <img v-if="!description" src="../../../assets/images/noddata.png" />
        <div v-if="description" class="nodataText">该专家还未评分</div>
        <div v-if="!description" class="nodataText">没有数据，请联系管理员</div>
      </div>
      <div style="height:100px;background: #fff;"></div>
    </div>
    <div class="btnGroup" v-if="gradeList.length > 0 && type == 0">
      <van-button plain type="info" @click="save">保存</van-button>
      <van-col style="width: 20px"></van-col>
      <van-button type="info" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "../../../methods";
import cHeader from "@/views/header";
import { mapState, mapActions } from "vuex";
import {
  NavBar,
  Popup,
  Picker,
  col,
  Search,
  Button,
  Dialog,
  Toast
} from "vant";
export default {
  name: "overseer-grade",
  data() {
    return {
      title: "护培生师规范化培训评价表",
      description: "",
      gradeList: [],
      saveId: "",
      submitType: 0,
      recordId: "",
      gradeTitleShow: false,
      type: 0,
      score: 0,
      submitTime: "",
      evaluator: ""
    };
  },
  created() {
    let self = this;
    self.getEvaList();
  },
  computed:{
            ...mapState([
                'turninfo',
            ]),
        },
  methods: {
    ...methods,
    getEvaList() {
      let self = this;
      let t = "";
      if (self.$route.query.param == 1) {
        t = 1;
      } else {
        t = 2;
      }
      if (self.$route.query.booking == 0) {
        let params = {
          command: "scoreSubmitRecord/detail",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          id: self.$route.query.id,
          category: 1,
          type: t
        };
        self.post("/scoreSubmitRecord/detail", params).done(function(res) {
          if (res.errcode == "0") {
            self.saveId = res.id;
            self.title = res.name;
            self.description = res.description;
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
            self.score = Number(res.score);
            self.submitTime = res.submitTime;
            self.evaluator = res.evaluator;
            self.gradeList = res.questions;
            self.saveId = res.id;
            if (res.recordId) {
              self.recordId = res.recordId;
            }
            self.type = Number(res.submitType);
          }
        });
      } else {
        let params = {
          command: "scoreSubmitRecord/detail",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          businessId: self.$route.query.id,
          category: 1,
          type: t
        };
        self.post("/scoreSubmitRecord/detail", params).done(function(res) {
          if (res.errcode == "0") {
            self.saveId = res.id;
            self.title = res.name;
            self.description = res.description;
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
            self.score = Number(res.score);
            self.submitTime = res.submitTime;
            self.evaluator = res.evaluator;
            self.gradeList = res.questions;
            self.saveId = res.id;
            if (res.recordId) {
              self.recordId = res.recordId;
            }
            self.type = Number(res.submitType);
          } else if (res.errcode == "1") {
            let params = {
              command: "scoreTemplate/getAvailableTemplateDetail",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              category: 1,
              type: t
            };
            self
              .post("/scoreTemplate/getAvailableTemplateDetail", params)
              .done(res => {
                self.saveId = res.id;
                self.title = res.name;
                self.description = res.description;
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
                    }else if(j.type == 6) {
                    j.answerScore  = j.score
                    j.answerReasonComment = ""
                    } else {
                      j.save = "";
                    }
                  });
                });
                self.type = 0;
                self.gradeList = res.questions;
                self.saveId = res.id;
                if (res.recordId) {
                  self.recordId = res.recordId;
                }
              });
          } else {
          }
        });
      }
    },
    back() {
        window.history.go(-1);
    },
    submit() {
      let self = this;
      self.submitType = 1;
      Dialog.confirm({
        message: "提交后不可修改，确定要提交吗?"
      })
        .then(() => {
          let n = 0;
          self.gradeList.forEach(i => {
            i.questionList.forEach(j => {
              if (
                j.required == 1 &&
                (j.type == 1 || j.type == 2 || j.type == 5) &&
                (j.save == "" || j.save == [])
              ) {
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
    save() {
      let self = this;
      self.submitType = 0;
      let canSubmit = true;
      if (canSubmit) {
        self.formSubmit();
      } else {
        Toast("保存失败");
      }
    },
    formSubmit() {
      let self = this;
      let answers = [];
      self.gradeList.forEach(i => {
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
      let k = "";
      if (self.$route.query.param == 1) {
        if(self.$route.query.teachingid) {
          k = self.$route.query.teachingid;
        }else {
          k = this.turninfo.teachingid;
        }
        
      } else {
        if(self.$route.query.deptid) {
          k = self.$route.query.deptid;
        }else {
          k = this.turninfo.deptid;
        }
        
      }
      let params = {
        command: "scoreSubmitRecord/submit",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        scoringTemplateId: self.saveId,
        // businessId: this.$route.query.businessId,
        id: self.recordId,
        businessId: self.$route.query.id,
        targetId: k,
        submitType: self.submitType,
        answers
      };
      self.post("/scoreSubmitRecord/submit", params).done(res => {
        if (self.submitType == 0) {
          Toast("保存成功");
          self.recordId = res.id;
        } else {
          Toast("提交成功");
          window.history.go(-1);
        }
      });
    },
    select(item, iten) {
      let self = this;
      self.gradeList.forEach(i => {
        i.questionList.forEach(j => {
          if (j.id == item.id) {
            j.save = iten.id;
          }
        });
      });
    },
    radioClick(iteb) {
    }
  }
};
</script>


<style lang="scss" scoped>
.g-main {
  margin-top: 46px;
  margin-bottom: -46px;
  font-size: 0.24rem;
  color: rgb(100, 100, 100);
  background-image: linear-gradient(90deg, #78c2f5 0%, #1052d5 100%) !important;
  position: fixed;
      right: 0;
    left: 0;
}
.scorll-item {
  display: flex;
  align-items: center;
  margin: 0px 20px;
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
  padding: 0 0.2rem;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
  &.evaDetail {
    margin: 0 10px 10px 10px;
    background: white;
    padding: 0 0.2rem;
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
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0.24px;
  font-weight: 500;
  z-index: 3 !important;
  padding-top: 6px;
  max-width: 218px;
}
.hosTitle {
  opacity: 0.7;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
  z-index: 3 !important;
}
.tipps {
  opacity: 0.7;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
  z-index: 3 !important;
  max-width: 218px;
}
.grade-pic {
  height: 99px;
  width: 172px;
  position: absolute !important;
  right: 0px;
  top: 0px;
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

  background-image: url("../../../assets/images/gouxuan.png");
  background-size: cover;
  margin-right: 0.05rem;
}

.radio:checked {
  background-image: url("../../../assets/images/gouxuan_on.png");
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
  padding: 20px 0px 0px 0px;
  border-bottom: 1px solid #e2e2e2;
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
      word-break: break-all;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0.2px;
      font-weight: 500;
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
  padding: 5px 5px;
}

.ggrade {
  height: 85px;
  background: #ffffff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 10px 14px 10px;
  padding: 0px 10px;
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
      margin-top: 1px;
    }
  }
  .ttt {
    font-size: 13px;
    color: #999999;
    letter-spacing: 0.17px;
    line-height: 22.5px;
    font-weight: 400;
    margin-bottom: 4px;
  }
}
</style>

<style lang="scss">
.supervise-grade {
  .van-nav-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 5 !important;
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
    word-break: break-all;
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