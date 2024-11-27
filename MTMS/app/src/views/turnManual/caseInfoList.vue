<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      {{title}}
      <div slot="headerRight" v-if="isInter == 0">
        <button style="font-size:0.3rem" @click="addCase">添加</button>
      </div>
    </c-header>
    <div class="g-main">
      <div class="case-content-box">
        <div
          class="case-box"
          v-for="(item, index) in caseList"
          :key="item.baseId"
          @click="goDetailList(item)"
        >
          <div class="case-name">{{item.content}}</div>
          <div class="case-detail">
            <div class="case-item">
              <img src="../../assets/images/all-check.png" />
              <span>要求例数</span>
              <span>{{item.count}}</span>
            </div>
            <div class="case-item">
              <img src="../../assets/images/no-check.png" />
              <span>已审核例数</span>
              <span>{{item.alreadyCheck}}</span>
            </div>
            <div class="case-item">
              <img src="../../assets/images/no-check.png" />
              <span>待审核例数</span>
              <span>{{item.waiteCheck}}</span>
            </div>
          </div>
          <div class="progress-box">
            <div class="progress-title">
              完成率
              <span>{{item.finishRate}}%</span>
            </div>
            <cProgress :percentage="item.finishRate" :strokeWidth="progeressWidth"></cProgress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
import cHeader from "@/views/header";
import cProgress from "@/components/progress";
export default {
  data() {
    return {
      title: "",
      caseList: [],
      // 进度条属性
      progeressWidth: 18,
      isInter: this.$route.query.user
    };
  },
  components: {
    cHeader,
    cProgress
  },
  computed: {
    ...mapState(["turninfo", "turnManual"])
  },
  methods: {
    ...methods,
    ...mapActions(["setTurnManual"]),
    // 查询所有病种完成情况信息
    queryAllCase() {
      this.post("/turnManual/queryTurnManualDiseaseStdDetail", {
        command: "turnManual/queryTurnManualDiseaseStdDetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        turnTrainId: this.turnManual.turnTrainId,
        turnId: this.turnManual.turnId,
        deptId: this.turnManual.deptId,
        stdId: this.turnManual.stdId,
        stage: this.turnManual.stage,
        type: this.$route.query.type,
        turnManualId: this.$route.query.id
      })
        .done(data => {
          if (data && data.errcode == 0) {
            this.isLoading = false;
            data.list.map(
              item => (item.finishRate = parseInt(item.finishRate))
            );
            this.caseList = data.list;
          }
        })
        .fail(error => {});
    },

    // 个病种详情
    goDetailList(item) {
      let self = this;
      this.setTurnManual({ k: "caseDetailName", v: item.content });
      // 存储到localStorage中
      localStorage.setItem("caseDetail", JSON.stringify(item));
      // 学生或者非学生
      if (this.$route.query.isStu == 1) {
        this.$router.push({
          // path: "/turnManual/checklist",
          name: 'checkTeaList',
          query: {
            id: item.turnManualId,
            type: item.type,
            isStu: this.isStu,
            baseId: item.baseId,
            businessid: self.$route.query.businessid,
            user: self.$route.query.user
          }
        });
      } else {
        this.$router.push({
          // path: "/turnManual/detailList",
          name: 'caseDetailList',
          query: {
            id: self.$route.query.id,
            type: self.$route.query.type,
            validate: self.$route.query.validate,
            caseId: item.baseId, // 病种的ID
            businessid: self.$route.query.businessid,
            user: self.$route.query.user
          }
        });
      }
    },

    // 添加病种信息
    addCase() {
      let self = this;
      if (self.$route.query.validate == 1) {
        self.$router.push({
          // path: "/turnManual/create",
          name: 'createCaseInfo',
          query: {
            id: self.$route.query.id,
            type: self.$route.query.type,
            name: self.title,
            businessid: self.$route.query.businessid
          }
        });
      } else {
        this.$toast("您已不在当前科室轮转");
      }
    },
    back() {
      let self = this;
      if (self.$route.query.user == 2) {
        this.$router.push({
          name: "fdRotation_doctor_exam_director",
          query: {
            booking: 0,
            id: self.$route.query.businessid,
            type: self.$route.query.type,
            where: self.$route.query.where,
            case: 2
          }
        });
      } else {
        self.$router.push({
          name: "fdRotation_doctor_exam",
          query: {
            type: self.turninfo.type,
            id: self.turninfo.plandetailid,
            case: 2
          }
        });
      }
    }
    // checkIsInter() {
    //   let self = this;
    //   console.log(self.$router.query.user);
    //   if (self.$router.query.user) {
    //     if (self.$router.query.user == 0) {
    //       self.isInter = true;
    //     } else {
    //       self.isInter = false;
    //     }
    //   } else {
    //     self.isInter = false;
    //   }
    //   console.log(self.isInter);
    // }
  },
  mounted() {
    // 标题
    let self = this;
    self.title = this.turnManual.caseName;
    self.queryAllCase();
    self.registerToNative("goBack", function(data) {
      self.back();
    });
    // self.checkIsInter();
    // console.log(self.$route.query.type);
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/mixin.scss";

.case-content-box {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  color: rgb(114, 112, 112);
  margin-top: 0.1rem;
}

.case-box {
  background: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  height: torem(120px);
  margin-bottom: torem(6px);
}

.case-name {
  font-size: torem(16px);
  margin: torem(6px) 0 torem(6px) torem(10px);
}

.case-detail {
  display: flex;
  align-content: center;
  justify-content: space-around;
}

.case-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  font-size: torem(14px);
  padding: torem(4px);
}

.case-item img {
  width: torem(30px);
  height: torem(30px);
}

.progress-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: torem(10px);
  padding: 0 torem(10px);
}

.progress-title span {
  color: #349adc;
  margin-left: torem(2px);
}

.progress {
  width: 70% !important;
  background: #fff !important;
  border: 1px solid rgb(204, 200, 200);
  box-sizing: content-box;
}
</style>