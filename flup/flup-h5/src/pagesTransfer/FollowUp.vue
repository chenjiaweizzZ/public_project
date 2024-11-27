<template>
  <section ref="section" class="FollowUp">
    <div class="patientChoose">
      <span>就诊人</span>
      <span class="patientId" @click="choosePatient()">{{ patient.text }}</span>
    </div>
    <div class="taskList" v-show="patientList.length">
      <div class="taskOne" v-for="(item, index) in flupPlanList" :key="index">
        <p
          class="taskTitle"
          :class="{ taskTitleFinish: item.planFinishStatus == '已完成' }"
        >
          <span class="taskName">{{ item.planName }}</span>
          <span class="ttTag">{{ item.planFinishStatus }}</span>
        </p>
        <div class="tlStatus">
          <div
            class="tlsOne"
            v-for="(jitem, jindex) in item.vpatientTask4CList"
            :key="jindex"
            @click="goToUrl(jitem)"
            :class="{
              todoTask:
                new Date(jitem.flupStartTime.slice(0, 10)).getTime() <
                new Date().getTime()
            }"
          >
            <u></u>
            <div class="tlsContent">
              <div
                class="tlsIcon"
                v-show="
                  jitem.flupType != '调查问卷' && jitem.readStatus == '未读'
                "
              ></div>
              <div
                class="tlsIcon tlsiA"
                v-show="
                  jitem.flupType != '调查问卷' && jitem.readStatus == '已读'
                "
              ></div>
              <div
                class="tlsIcon tlsiB"
                v-show="
                  jitem.flupType == '调查问卷' &&
                    jitem.writeStatus == '待用户填写'
                "
              ></div>
              <div
                class="tlsIcon tlsiC"
                v-show="
                  jitem.flupType == '调查问卷' && jitem.writeStatus == '已填写'
                "
              ></div>
              <p>{{ jitem.taskContent }}</p>
              <span>{{ jitem.flupStartTime.slice(0, 10) }}</span>
              <div
                class="tlsBtn"
                v-if="jitem.finish"
                @click.stop="goToEvaluationResults(jitem)"
              >
                评测结果
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noData" v-if="!flupPlanList.length && patientList.length"></div>
    <div class="noPatient" v-show="!patientList.length">
      <div class="npContent">
        <img src="@/assets/images/noPatient.png" alt />
        <div class="noDataText">暂无就诊人</div>
        <div class="npBtn" @click="addPatient()">去新增</div>
      </div>
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        title="切换就诊人"
        :columns="patientList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        show-toolbar
        :default-index="pickerBindIndex"
      />
    </van-popup>
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      patient: {},
      showPicker: false,
      patientList: [],
      flupPlanList: [],
      pickerBindIndex: 0
    };
  },
  async created() {
    !JSON.parse(sessionStorage.getItem("defaultClientNew")) &&
      sessionStorage.getItem("defaultClient") &&
      (this.patient = JSON.parse(sessionStorage.getItem("defaultClient")));
    this.getPatientList();
  },
  methods: {
    getPatientList() {
      this.$apis.getPatientList().then(res => {
        if (res.retData.list.length) {
          this.patientList = res.retData.list.map(item => {
            return {
              text:
                item.patientName +
                "   " +
                item.idNo.substring(0, 4) +
                "***********" +
                item.idNo.substring(item.idNo.length - 4),
              value: item.userId
            };
          });
          if (JSON.stringify(this.patient) == "{}") {
            let index = res.retData.list.findIndex(i => {
              return i.isDefault == 1;
            });
            if (index != -1) {
              this.patient = this.patientList[index];
            } else {
              this.patient = this.patientList[0];
            }
            sessionStorage.setItem(
              "defaultClient",
              JSON.stringify(this.patient)
            );
            this.pickerBindIndex = index == -1 ? 0 : index;
          } else {
            let index = this.patientList.findIndex(i => {
              return i.value == this.patient.value;
            });
            this.pickerBindIndex = index == -1 ? 0 : index;
          }
          this.getFlupPlanListByCurrent();
        } else {
          sessionStorage.setItem("defaultClient", "");
        }
      });
    },
    getFlupPlanListByCurrent() {
      this.$apis
        .getFlupPlanListByCurrent({
          patientId: this.patient.value,
          hospitalId: this.$route.query.hospitalId
        })
        .then(res => {
          this.flupPlanList = res.retData;
        });
    },
    onConfirm(selectedValues, index) {
      this.patient = selectedValues;
      sessionStorage.setItem("defaultClient", JSON.stringify(this.patient));
      this.pickerBindIndex = index;
      this.getFlupPlanListByCurrent();
      this.showPicker = false;
    },
    choosePatient() {
      if (this.patient.value) {
        this.showPicker = true;
      } else {
        this.$router.push({
          path: " "
        });
      }
    },
    addPatient() {
      this.$router.push({
        path: "userManagement"
      });
    },
    goToDetail() {
      this.$router.push({
        path: "taskDetail"
      });
    },
    goToUrl(item) {
      sessionStorage.setItem("defaultClientNew", false);
      if (item.flupType == "专科随访") {
        this.$router.push({
          path: "/taskDetail",
          query: {
            title: item.flupContent,
            flupStartTime: item.flupStartTime.slice(0, 10),
            flupAddress: item.flupAddress
          }
        });
        return;
      }
      window.open(item.flupAddress, "_self");
    },
    goToEvaluationResults(item) {
      this.$router.push({
        path: "/evaluationResults",
        query: {
          title: item.flupContent,
          patientName: item.patientName,
          showModule: item.medicalSide,
          questionnaireScoringList: JSON.stringify(
            item.questionnaireScoringList
          ),
          questionnaireResultList: JSON.stringify(item.questionnaireResultList)
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.FollowUp {
  height: 100%;
  overflow: auto;
  .patientChoose {
    padding: 0 14px 0 24px;
    height: 44px;
    background: linear-gradient(277deg, #32ae57 1%, #46cd6e 96%);
    font-size: 16px;
    line-height: 46px;
    color: #ffffff;
    .patientId {
      padding-right: 18px;
      float: right;
      font-size: 15px;
      background: url("../assets/images/right-arrow-icon.png") no-repeat right;
    }
  }
  .taskList {
    .taskOne {
      margin-bottom: 13px;
      padding: 0 3.75%;
      .taskTitle {
        margin-bottom: 3px;
        font-size: 16px;
        line-height: 46px;
        letter-spacing: 0.2px;
        color: #111111;
        white-space: nowrap;
        .taskName {
          display: inline-block;
          max-width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        .ttTag {
          padding: 0 4px;
          display: inline-block;
          margin-left: 4px;
          font-size: 12px;
          font-weight: normal;
          line-height: 16px;
          letter-spacing: 0.21px;
          color: #00a21e;
          background: #eaffea;
          border-radius: 2px;
        }
      }
      .taskTitleFinish {
        color: #999999;
        .ttTag {
          color: #999999;
          background: #e8e8e8;
        }
      }
      .tlStatus {
        .tlsOne {
          position: relative;
          padding-bottom: 14px;
          overflow: hidden;
          &::before {
            content: "";
            display: block;
            width: 1px;
            height: 1000px;
            position: absolute;
            top: 0;
            left: 11px;
            background: #c6c9ce;
          }
          u {
            display: block;
            width: 9px;
            height: 9px;
            border-radius: 9px;
            background: #c6c9ce;
            position: absolute;
            left: 7px;
            top: 50%;
            transform: translate(0, -11.5px);
          }
          .tlsContent {
            position: relative;
            padding: 11px 14px 8px;
            margin-left: 36px;
            border-radius: 8px;
            background: #ffffff;
            .tlsIcon {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 24px;
              height: 24px;
              background: url("../assets/images/eye-open-icon.png") no-repeat
                right bottom;
            }
            .tlsiA {
              background: url("../assets/images/eye-close-icon.png") no-repeat
                right bottom;
            }
            .tlsiB {
              background: url("../assets/images/pen-open-icon.png") no-repeat
                right bottom;
            }
            .tlsiC {
              background: url("../assets/images/pen-close-icon.png") no-repeat
                right bottom;
            }
            p {
              margin-bottom: 9px;
              font-size: 16px;
              font-weight: 500;
              line-height: 19px;
              letter-spacing: 0.2px;
              color: #111111;
            }
            span {
              font-size: 14px;
              line-height: 17px;
              letter-spacing: 0.2px;
              color: #a0a5ad;
            }
            .tlsBtn {
              display: inline-block;
              margin-left: 9px;
              padding: 0 3px;
              line-height: 18px;
              border-radius: 2px;
              border: 1px solid #32ae57;
              font-size: 12px;
              letter-spacing: 0.2px;
              color: #00982d;
            }
          }
          &:first-child {
            &::before {
              top: 50%;
              transform: translate(0, -7px);
            }
          }
          &:last-child {
            &::before {
              top: inherit;
              bottom: 50%;
              transform: translate(0, -7px);
            }
          }
        }
        .todoTask {
          u {
            width: 21px;
            height: 21px;
            border-radius: 0;
            background: url("../assets/images/u-bg.png") no-repeat;
            left: 1px;
            top: 50%;
            transform: translate(0, -18.5px);
          }
        }
      }
    }
  }
  .noData {
    height: 60%;
    background: url("../assets/images/noData.png") no-repeat center 40%;
    background-size: 42%;
  }
  .noPatient {
    .npContent {
      width: 74%;
      margin-left: 13%;
      margin-top: 40%;
      text-align: center;
      img {
        display: block;
        width: 100%;
      }
      .noDataText {
        font-family: 苹方-简;
        font-size: 17px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0px;
        color: #6b8c75;
      }
      .npBtn {
        display: inline-block;
        margin: 20px;
        padding: 0 23px;
        line-height: 26px;
        border-radius: 18px;
        border: 1px solid #32ae57;
        font-size: 15px;
        letter-spacing: 0.2px;
        color: #00982d;
      }
    }
  }
}
</style>
