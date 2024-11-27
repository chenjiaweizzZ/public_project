<template>
  <div class="monthTestCom">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="infoBox">
        <p class="labelItem">
          <span class="label required">轮转科室：</span>
          <span class="valueInfo">{{currentDetail.turnDeptName}}</span>
        </p>
        <p class="labelItem">
          <span class="label required">考核学员：</span>
          <span class="valueInfo">{{currentDetail.name}}</span>
        </p>
        <p class="labelItem">
          <span class="label required">考勤情况：</span>
          <span class="valueInfo">{{currentDetail.workAttendance}}</span>
        </p>
        <p class="labelItem">
          <span class="label required">考核月份：</span>
          <span class="valueInfo">{{currentDetail.evaluateMonth}}</span>
        </p>
        <p :class="{'centerAlign': isEdit, 'labelItem': true}">
          <span class="label required">第一责任人：</span>
          <span class="valueInfo" v-if="!isEdit">{{testInfo.firstName}}</span>
          <el-select v-model="testInfo.firstName" placeholder="第一责任人" v-else>
            <el-option :label="item.label" :value="item.id" v-for="(item, index) in teacherList" :key="index"></el-option>
          </el-select>
        </p>
        <p :class="{'centerAlign': isEdit, 'labelItem': true}">
          <span class="label required">第二责任人：</span>
          <span class="valueInfo" v-if="!isEdit">{{testInfo.secondName}}</span>
          <el-input v-model="testInfo.secondName" placeholder="第二责任人" v-else disabled></el-input>
        </p>
      </div>
      <scoring-table :id="previewId" :key="keyValue" :isAnswer="isAnswer" :needHeader="needHeader" :disabledVal="disabledVal" @updateAnswer="updateAnswer"></scoring-table>
      <div class="bottom" v-if="disabledVal">
        <p class="labelItem">
          <span class="label required">护士长：</span>
          <span class="valueInfo">{{currentDetail.evaluateAuditUname}}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!disabledVal || title == '审核'">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm" v-if="title != '审核'">提 交</el-button>
        <el-button type="primary" @click="processItem" v-else>审 核</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { post, getCookie, getStorage, get } from '../config/util.js';

  import scoringTable from "./scoringTable.vue"
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      disabledVal: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ""
      },
      previewId: {
        type: String,
        default: ""
      },
      currentDetail: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
        keyValue: 0,
        templateAnswer: [],
        teacherList: [],
        testInfo: {
          firstName: "",
          secondName: ""
        },
        needHeader: true,
        isAnswer: false,
        dialogVisible: false
      }
    },
    watch: {
      isShow(newVal, oldVal) {
        this.dialogVisible = newVal
      },
      isEdit(newVal, oldVal) {
        this.isEdit = newVal
        if (this.isEdit) {
          this.getTeachSelect()
        }
      },
      currentDetail: {
        handler(newVal, oldVal) {
          this.currentDetail = newVal
          this.keyValue = this.keyValue + 1
          if (this.isEdit) {
            this.testInfo.firstName = newVal.firstResponsibleUid
          } else {
            this.testInfo.firstName = newVal.firstResponsibleUname
          }

          if (this.currentDetail.evaluateStatus == 1) {
            this.isAnswer = true
          } else {
            this.isAnswer = false
          }
          // this.init()
        },
        deep: true
      },
      disabledVal(newVal, oldVal) {
        this.disabledVal = newVal
      }
    },
    components: { scoringTable },
    mounted() {
      this.testInfo.secondName = getCookie("name") || getCookie("gy_un")
    },
    methods: {
      processItem() {
        this.$confirm('提交后不可再次编辑，确认提交吗？', '提交确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.testConfirm()

        }).catch((err) => {
          console.log(err)
          this.$message({
            type: 'info',
            message: '取消审核'
          });
        });

      },
      updateAnswer(data) {
        this.templateAnswer = data
      },
      getTeachSelect() {
        post('/base/users/getFirstResponsible',
          {
            deptId: this.currentDetail.turnDeptId
          }
        ).then(res => {
          if (res && res.resCode == 200) {
            res.model.forEach(item => {
              item.label = item.name + "-" + item.username
            })
            this.teacherList = res.model
          }

        })
      },
      checkAnswer() {
        let flag = 0
        this.templateAnswer.forEach(item => {
          item.questionList.forEach(citem => {
            if (citem.required == 1) {
              if ((citem.type == 1 || citem.type == 2 || citem.type == 5) && citem.answer.length == 0) {
                flag = flag + 1
              } else if (citem.type == 3 && citem.answerContent == "") {
                flag = flag + 1
              }
            }
          })
        })
        return flag
      },
      testConfirm() {
        let answers = [];
        this.templateAnswer.forEach(item => {
          item.questionList.forEach(citem => {
            let obj = {
              scoringQuestionType: citem.type,
              scoringQuestionId: citem.id,
              scoringOptionId: citem.answer[0]
            }
            answers.push(obj)
          })

        });
        let params = {
          command: "scoreSubmitRecord/submit",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          scoringTemplateId: this.currentDetail.pubScoringTemplateId,
          businessId: this.currentDetail.pubEvaluationMonthId,
          targetId: this.currentDetail.uid,
          submitType: 1,
          answers
        };
        post("/scoreSubmitRecord/submit", params).then(res => {
          if (res && res.errcode == 0) {
            if (this.title == '审核') {
              post(`/pub/pubevaluationmonth/auditEvaluate`, {
                id: this.currentDetail.pubEvaluationMonthId,
                pubScoringTemplateId: this.currentDetail.pubScoringTemplateId,
                pubScoringSubmitRecordId: res.id,
              }).then(res => {
                if (res && res.resCode == 200) {
                  this.$message({
                    type: "success",
                    message: "审核成功！"
                  })
                  this.dialogVisible = false
                  this.$emit("updateDialog", true)
                } else {
                  this.$message({
                    type: "warning",
                    message: "审核失败！"
                  })
                }
              })
            } else {
              post("/pub/pubevaluationmonth/commitEvaluate", {
                id: this.currentDetail.pubEvaluationMonthId,
                firstResponsibleUid: this.testInfo.firstName,
                pubScoringTemplateId: this.previewId,
                pubScoringSubmitRecordId: res.id,
                workAttendance: this.currentDetail.workAttendance || "124"
              }).then(res => {
                if (res && res.resCode == 200) {
                  this.$message({
                    type: 'success',
                    message: '提交考核成功！'
                  });
                  this.dialogVisible = false
                  this.$emit("updateDialog", true)
                } else {
                  this.$message({
                    type: 'error',
                    message: '提交考核失败！'
                  });
                }
              })
            }
          } else {
            this.$message({
              type: "error",
              message: "提交评分表失败！"
            })
          }
        })

      },
      confirm() {
        // 编辑
        if (this.testInfo.firstName == "" || this.testInfo.firstName == null || this.testInfo.firstName == undefined) {
          this.$message({
            type: "warning",
            message: `请选择第一负责人！`
          })
          return false
        }
        let flag = this.checkAnswer()
        if (flag == 0) {
          this.$confirm('提交后不可再次编辑，确认提交吗？', '提交确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            console.log('0000')
            this.testConfirm()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消审核'
            });
          });
        } else {
          this.$message({
            type: "warning",
            message: `当前评分表还有${flag}项必填题目未填写，请填写完整！`
          })
        }
      },
      handleClose() {
        this.dialogVisible = false
        this.$emit("updateDialog", false)
      }
    }
  }
</script>
<style scoped>
  .infoBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px 10px 15px;
    border-bottom: 1px solid #ebebeb;
  }

  .labelItem {
    width: 47%;
    font-size: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .labelItem span {
    flex-shrink: 1;
  }

  .valueInfo {
    width: calc(100% - 90px);
  }

  .labelItem .label {
    width: 90px;
  }

  .labelItem .label.required {
    position: relative;
  }

  .labelItem .label.required::before {
    position: absolute;
    left: -8px;
    top: 0;
    content: "*";
    display: block;
    color: red;

  }

  .centerAlign {
    align-items: center;
  }

  .bottom {
    border-top: 1px solid #ebebeb;
    padding: 0 15px;
    padding-top: 10px;
  }

  .scoringTable.selfComp {
    padding: 0 15px;
  }
</style>
<style>
  .monthTestCom .labelItem .el-input {
    width: 150px;

  }

  .monthTestCom .el-dialog__footer {
    text-align: center;
  }
</style>