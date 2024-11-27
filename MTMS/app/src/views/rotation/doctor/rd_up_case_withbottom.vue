<template>
  <div class="rd-up-case">
    <van-nav-bar title="病历上传" left-arrow @click-left="back()" />
    <div class="score-row">得分 (平均分) : {{aveScore}}</div>
    <div v-if="caseList.length > 0">
      <div
        class="exist-content"
        v-for="(item,index) in caseList"
        :key="index"
        @click="caseDetail(item)"
      >
        <van-swipe-cell>
          <div class="rd-case">
            <div class="rd-case-left">
              <div class="rd-case-left-top">{{ item.name }}</div>
              <div class="rd-case-left-bottom">{{ item.updateTime }}</div>
            </div>
            <div class="rd-case-right" v-if="item.auditStatus">
              <div class="rd-case-right-top">
                <span class="rd-case-right-score">{{ item.score }}</span>
                <span class="rd-case-right-unit">分</span>
              </div>
              <div class="rd-case-right-bottom">
                <span></span>
              </div>
            </div>
            <div class="rd-case-right" v-else>
              <div class="rd-case-right-top">
                <span class="rd-case-right-wait">待评分</span>
              </div>
              <div class="rd-case-right-botom">
                <span></span>
              </div>
            </div>
          </div>
          <template #right v-if="!item.auditStatus">
            <van-button square type="danger" text="删除" @click="delCase(item)" />
          </template>
        </van-swipe-cell>
      </div>
      <div style="height: 76px"></div>
    </div>
    <div class="no-content" v-else>
      <img src="../../../assets/images/rd-no-content.png" alt />
    </div>
    <div class="btn-row" @click="addCase">
      <van-button type="info" size="large">添加病历</van-button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import cProgress from "@/components/progress";
import { Toast } from "vant";
export default {
  name: "rotation_doctor_exam",
  components: {
    cHeader,
    cProgress
  },
  data() {
    return {
      caseList: [],
      aveScore: 0
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  created() {
    this.getList();
    this.getAveScore();
  },
  mounted() {},
  methods: {
    ...methods,
    ...mapActions(["setTurninfo", "setTurnManual"]),
    addCase() {
      console.log(1234);
      let self = this;
      this.$router.push({
        name: "fdRotation_doctor_addedit_case",
        query: {
          id: self.$route.query.id,
          type: self.$route.query.type,
          deptid: self.$route.query.deptid,
          teachingid: self.$route.query.teachingid
        }
      });
    },
    getList() {
      let self = this;
      self
        .get(
          "/base/largeMedicalRecord/list?turnPlanDetailId=" +
            this.$route.query.id
        )
        .done(res => {
          if (res.resCode == 200) {
            self.caseList = res.model;
          }
        });
    },
    getAveScore() {
      let self = this;
      self
        .get(
          "/base/largeMedicalRecord/getAverageScore/" + this.$route.query.id
        )
        .done(res => {
          if (res.resCode == 200) {
            if (res.model) {
              self.aveScore = res.model;
            } else {
              self.aveScore = "暂无";
            }
          }
        });
    },
    delCase(item) {
      let self = this;
      console.log(item);
      self
        .post("/base/largeMedicalRecord/update", {
          id: item.id,
          deleteFlag: 1
        })
        .done(res => {
          if (res.resCode == 200) {
            Toast("删除成功");
            self.getList();
          }
        });
    },
    caseDetail(item) {
      console.log(item);
      let self = this;
      if (item.auditStatus) {
        this.$router.push({
          name: "fdRotation_doctor_case_notitle",
          query: {
            id: self.$route.query.id,
            type: self.$route.query.type,
            deptid: self.$route.query.deptid,
            teachingid: self.$route.query.teachingid,
            caseId: item.id
          }
        });
      } else {
        this.$router.push({
          name: "fdRotation_doctor_addedit_case",
          query: {
            id: self.$route.query.id,
            type: self.$route.query.type,
            deptid: self.$route.query.deptid,
            teachingid: self.$route.query.teachingid,
            caseId: item.id
          }
        });
      }
    },
    back() {
      let self = this;
      this.$router.push({
        name: "fdRotation_doctor_exam",
        query: {
          id: self.$route.query.id,
          type: self.$route.query.type,
          deptid: self.$route.query.deptid,
          teachingid: self.$route.query.teachingid
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.rd-up-case {
  background: #F6F6F6;
  height: calc(100ch + 20px);
  .score-row {
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    letter-spacing: 0.19px;
    background: #ffffff;
    height: 44px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-top: 46px;
    color: #666666;
  }
  .btn-row {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 20px;
    background: #ffffff;
  }
  .no-content {
    height: calc(100vh - 90px);
    // padding-top: calc(30ch);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 120px;
  }
  .rd-case {
    min-height: 81px;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    margin: 12px 12px 0px 12px;
    border-radius: 6px;
    .rd-case-left {
      display: flex;
      flex-direction: column;
      flex: 7;
      margin: 16px 0px 0px 14px;
      .rd-case-left-top {
        font-size: 16px;
        font-weight: bold;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
      }
      .rd-case-left-bottom {
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0.15px;
        color: #999999;
        margin-top: 10px;
      }
    }
    .rd-case-right {
      flex: 2;
      display: flex;
      flex-direction: column;
      margin-top: 16px;
      align-items: center;
      .rd-case-right-score {
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        text-align: right;
        letter-spacing: 0.22px;
        color: #2685d2;
      }
      .rd-case-right-unit {
        font-size: 14px;
        font-weight: bold;
        line-height: 17px;
        text-align: right;
        letter-spacing: 1.12px;
        color: #2685d2;
      }
      .rd-case-right-wait {
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        text-align: right;
        letter-spacing: 0.25px;
        color: #999999;
      }
      .rd-case-right-bottom {
        height: 1px;
        background: #2685d2;
        width: 47px;
        margin-top: 3px;
      }
    }
  }
}
</style>

<style lang="scss">
.btn-row {
  .van-button {
    font-weight: bold;
  }

}
.rd-up-case {
  .van-swipe-cell__right {
    .van-button {
      height: 100% !important;
    }
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