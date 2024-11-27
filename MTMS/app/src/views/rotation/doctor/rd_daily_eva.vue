<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>日常评价
    </c-header>
    <div class="g-main">
      <div class="rd-daily-title">日常评价</div>
      <div class="rd-daily-list" v-for="(item,index) in evaList" :key="index">
        <div class="eva-date">{{ item.evaluateDate }}</div>
        <div class="eva-item">
          <div class="eva-obj">护培生评价带教</div>
          <div class="eva-result-true" v-if="item.evaluate1 == true">已评</div>
          <div class="eva-result-false" v-else>未评</div>
        </div>
        <div class="eva-item">
          <div class="eva-obj">护培生评价科室</div>
          <div class="eva-result-true" v-if="item.evaluate2 == true">已评</div>
          <div class="eva-result-false" v-else>未评</div>
        </div>
        <div class="eva-item">
          <div class="eva-obj">带教评价护培生</div>
          <div class="eva-result-true" v-if="item.evaluate3 == true">已评</div>
          <div class="eva-result-false" v-else>未评</div>
        </div>
        <div class="eva-item eva-item-buttom">
          <div class="eva-obj">护士长评价护培生</div>
          <div class="eva-result-true" v-if="item.evaluate4 == true">已评</div>
          <div class="eva-result-false" v-else>未评</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
export default {
  name: "rotation_doctor_turn_manual",
  components: {
    cHeader
  },
  data() {
    return {
      detailinfo: "",
      evaList: []
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  mounted() {
    let self = this;
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    this.getEvaList();
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),
    back() {
      let self = this;
      this.$router.push({
        name: "fdRotation_doctor_exam",
        query: {
          type: self.$route.query.type,
          id: self.$route.query.id
        }
      });
    },
    getEvaList() {
      let self = this;
      self.data = {
        command: "turn/queryDailyEvaluates",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        businessid: this.$route.query.id
      };
      self
        .post("/turn/queryDailyEvaluates", self.data)
        .done(function(data) {
          // console.log(data.turnDailyEvaluates);
          self.evaList = data.turnDailyEvaluates;
        })
        .fail(function(error) {
          // console.log("fail!!!");
          return;
        });
    }
  }
};
</script>
<style scoped lang="scss">
.g-main {
  font-size: 0.24rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
  .rd-daily-title {
    height: 53px;
    line-height: 53px;
    background-color: #ffffff;
    padding-left: 14px;
    color: #111111;
    font-size: 18px;
    font-weight: 500;
    display: flex;
  }
  .rd-daily-list {
    .eva-date {
      display: flex;
      // line-height: 2;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.16px;
      font-weight: 400;
      background-color: linear-gradient(270deg, #ffffff 0%, #fafafa 76%);
      padding-left: 14px;
      // padding: 8px 0px 8px 14px;
    }
    .eva-item {
      height: 53px;
      line-height: 53px;
      display: flex;
      background-color: #ffffff;
      // line-height: 3;
      font-size: 15px;
      color: #111111;
      letter-spacing: 0;
      font-weight: 500;
      border-bottom: 0.5px solid #e2e2e2;
      // padding: 16px 0px 16px 14px;
      .eva-obj {
        line-height: 53px;
        flex: 6;
        border-right: 0.5px solid #e2e2e2;
        padding-left: 14px;
      }
      .eva-result-true {
        line-height: 53px;
        flex: 4;
        font-size: 15px;
        color: #111111;
        letter-spacing: 0;
        font-weight: 400;
        padding-left: 14px;
      }
      .eva-result-false {
        line-height: 53px;
        flex: 4;
        font-size: 15px;
        color: #ec5926;
        letter-spacing: 0;
        font-weight: 500;
        padding-left: 14px;
      }
    }
    .eva-item-buttom {
      border-bottom: none;
    }
  }
}
.g-main div {
  width: 100%;
  // background: white;
  /*height: 1rem;*/
  /*line-height: 1rem;*/
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  // padding: 0.1rem 0.3rem;
  // margin-top: 0.1rem;
}

.left {
  margin: 0;
  /*color: #333333;*/
  /*font-size: .3rem;*/
  display: flex;
  align-items: center;
}

.left img {
  width: 0.66rem;
  height: 0.66rem;
  margin-right: 0.2rem;
}

.right {
  width: 0.2rem;
  height: 0.2rem;
}
</style>