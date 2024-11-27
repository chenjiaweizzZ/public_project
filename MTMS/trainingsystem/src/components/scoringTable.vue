<template>
  <div class="scoringTable selfComp">
    <div v-if="needHeader">
      <p class="templateName">{{detail.name}}</p>
      <p class="tips">{{detail.description}}</p>
      <p class="tips" v-if="isAnswer && !noScoreTips">评分：{{detail.score}}分</p>
    </div>
    <div class="box">
      <div class="typeBox" v-for="(item, index) in templateDetail" :key="index">
        <p class="typeName">{{item.category}}</p>
        <div class="questBox" v-for="(citem,cindex) in item.questionList" :key="cindex">
          <p>
            <span class="required" v-if="citem.required == 1">*</span>
            {{citem.content}}
          </p>
          <div class="innerBox" v-if="citem.type == 1">
            <el-radio-group :disabled="disabledVal" v-model="citem.answer[0]" @change="changeAnswer">
              <el-radio :label="val.id" v-for="(val,valindex) in citem.items" :key="valindex">{{val.content}}</el-radio>
            </el-radio-group>
          </div>
          <div class="innerBox" v-if="citem.type == 2">
            <el-checkbox-group v-model="citem.answer" @change="changeAnswer">
              <el-checkbox :label="val.id" v-for="(val,valindex) in citem.items" :key="valindex" :disabled="disabledVal">{{val.content}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="innerBox templateBox" v-if="citem.type == 5 && disabledVal">
            <div v-for="(val,valindex) in citem.items" :key="valindex" class="tags">
              <el-tag type="danger" v-if="val.selected">{{val.content}}</el-tag>
              <el-tag type="gray" v-else>{{val.content}}</el-tag>
            </div>
          </div>
          <div class="innerBox templateBox" v-if="citem.type == 5 && disabledVal == false">
            <div v-for="(val,valindex) in citem.items" :key="valindex" class="tags">
              <el-tag v-if="val.selected" @click="clickTags(index, cindex, valindex, false)">{{val.content}}</el-tag>
              <el-tag type="info" @click="clickTags(index, cindex, valindex, true)" v-else>{{val.content}}</el-tag>
            </div>
          </div>
          <div class="innerBox" v-if="citem.type == 3">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="citem.answerContent" :disabled="disabledVal"></el-input>
          </div>
          <div class="innerBox" v-if="citem.type == 4">
            <el-rate v-model="citem.answerStar" :disabled="disabledVal" @change="changeAnswer"></el-rate>
          </div>
          <div class="innerBox" v-if="citem.type == 6">
            <div class="flexBox">
              <span class="sliderMax">{{isAnswer ? citem.answerScore : citem.score}}</span>
              <el-slider v-model="citem.answerScore" :step="sliderStep" :disabled="disabledVal" :max="citem.score" @change="changeAnswer"></el-slider>
              <div class="sliderButton">
                <i class="el-icon-remove-outline"></i>
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </div>
            <p v-if="isAnswer && citem.reasonStatus == 1">{{citem.answerReasonComment}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { post, getCookie } from "../config/util";
  export default {
    props: {
      dataList: {
        type: Object,
        default: () => { return {} }
      },
      needHeader: {
        type: Boolean,
        default: false
      },
      isAnswer: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: ""
      },
      noScoreTips: {
        type: Boolean,
        default: false
      },
      disabledVal: {
        type: Boolean,
        default: true
      }

    },
    data() {
      return {
        sliderStep: 1,
        detail: {},
        templateDetail: {},
        types: 1
      };
    },
    watch: {
      dataList: function (newVal, oldVal) {
        this.forMatDetail(newVal);
      },
      id: function (newVal, oldVal) {
        if (this.isAnswer) {
          this.getAnswerDetail();
        } else {
          this.getDetail();
        }
      },
      disabledVal: function (newVal, oldVal) {
        if (this.isAnswer) {
          this.getAnswerDetail();
        } else {
          this.getDetail();
        }

      },
    },
    created() {
      if (this.id == "") {
        this.forMatDetail(this.dataList);
      } else {
        if (this.isAnswer) {
          this.getAnswerDetail();
        } else {
          this.getDetail();
        }
      }
    },
    methods: {
      changeAnswer() {
        this.$emit("updateAnswer", this.templateDetail)
      },
      clickTags(index, cindex, valindex, flag) {
        let temp = this.templateDetail[index].questionList
        let ctemp = temp[cindex].items
        let valtemp = ctemp[valindex]
        valtemp.selected = flag
        ctemp[valindex] = valtemp
        temp[cindex].items = ctemp
        // temp.splice(cindex, 1, temp[cindex])
        this.templateDetail[index].questionList = temp
        this.templateDetail.splice(index, 1, this.templateDetail[index])
        this.$emit("updateAnswer", this.templateDetail)
      },
      removeStep(index, cindex) {
        let temp = this.templateDetail[index]
        let ctemp = temp.questionList[cindex]
        ctemp.score = ctemp.score > 0 ? ctemp.score - 1 : 0
        temp.questionList.splice(cindex, 1, ctemp)
        this.templateDetail.splice(index, 1, temp)
      },
      addStep(index, cindex) {
        let temp = this.templateDetail[index]
        let ctemp = temp.questionList[cindex]
        ctemp.score = ctemp.score < 10 ? ctemp.score + 1 : ctemp.score
        temp.questionList.splice(cindex, 1, ctemp)
        this.templateDetail.splice(index, 1, temp)
      },
      forMatDetail(data) {
        data.questions.forEach(item => {
          item.questionList.forEach(citem => {
            citem.answer = [];
            citem.answerStar = this.isAnswer ? citem.answerStar : 5;
            citem.answerContent = this.isAnswer ? citem.answerContent : "";
            if (citem.type == 1 || citem.type == 2 || citem.type == 5) {
              citem.items.forEach((val, ind) => {
                if (this.isAnswer) {
                  if (val.selected) {
                    citem.answer.push(val.id);
                  }
                } else if (!this.disabledVal && citem.type == 5) {
                  val.selected = false
                }
              });
            }
            if (citem.type == 6) {
              if (!this.isAnswer) {
                citem.answerScore = 0
              }
            }
          });
        });
        this.templateDetail = data.questions;
        this.detail = data;
        this.changeAnswer()
      },
      getAnswerDetail() {
        if (this.id == null || this.id == "") {
          return false
        }
        post("/scoreSubmitRecord/detail", {
          command: "scoreSubmitRecord/detail",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          id: this.id
          // id: 43
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.forMatDetail(data);
            } else {
              this.$message({
                type: "warning",
                message: data.errdesc
              });
            }
          })
          .catch(error => { });
      },
      getDetail() {
        post("/scoreTemplate/detail", {
          command: "scoreTemplate/detail",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          id: this.id
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.forMatDetail(data);
            } else {
              this.$message({
                type: "warning",
                message: data.errdesc
              });
            }
          })
          .catch(error => { });
      }
    }
  };
</script>
<style>
  .scoringTable.selfComp .el-radio-group,
  .scoringTable.selfComp .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .scoringTable.selfComp .el-radio,
  .scoringTable.selfComp .el-checkbox {
    margin-left: 0px;
    margin-top: 8px;
  }

  .scoringTable.selfComp .el-slider {
    width: calc(100% - 350px);
  }

  .scoringTable.selfComp .el-slider__button {
    width: 16px !important;
  }
</style>
<style scoped>
  .sliderMax {
    margin-right: 20px;
  }

  .sliderButton {
    margin-left: 10px;
    font-size: 25px;
    color: #409eff;
  }

  .flexBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
  }

  .evaluteDetail {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .evaluteDetail span {
    display: inline-block;
    width: 33%;
    text-align: left;
    flex-shrink: 1;
  }

  .tips {
    font-size: 16px;
    font-weight: bold;
    color: #1f2d3d;
    margin-bottom: 10px;
  }

  .templateName {
    font-size: 18px;
    font-weight: bold;
    color: #1f2d3d;
    text-align: center;
    margin-bottom: 20px;
  }

  .required {
    color: red;
    margin-right: 14;
  }

  .scoringTable {
    padding: 15px 0;
  }

  .typeName {
    font-size: 16px;
    font-weight: bold;
    color: #111;
  }

  .questBox {
    padding: 10px 0;
  }

  .innerBox {
    padding: 10px 0;
  }

  .tags {
    margin-right: 6px;
  }

  .templateBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>