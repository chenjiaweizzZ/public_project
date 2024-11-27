<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>出科小结
    </c-header>
    <div class="g-main">
      <div class="out-department-results">
        <div class="result-box">
          <div class="title-row"></div>
          <div class="result-title">出科小结</div>
          <div class="out-department-result">
            <div class="result-row"></div>
            <div class="result-content">{{resultInfo.stdAppraise}}</div>
            <div class="result-time">{{resultInfo.stdname}} {{resultInfo.stdDate}}</div>
          </div>
        </div>
      </div>
      <div class="out-department-results">
        <div class="result-box">
          <div class="title-row"></div>
          <div class="result-title">带教评语</div>
          <div class="out-department-result">
            <div class="result-row"></div>
            <div class="result-content">{{resultInfo.tecAppraise}}</div>
            <div class="result-time">{{resultInfo.tecname}} {{resultInfo.tecDate}}</div>
          </div>
        </div>
      </div>
      <div class="out-department-results">
        <div class="result-box">
          <div class="title-row">
            <div class="disagree" v-if="resultInfo.status == 0">
              <div class="result-tip-fail">
                <van-icon name="fail" color="white" size="5px" />
              </div>
              <div class="fail-content">不同意出科</div>
            </div>
            <div class="agree" v-if="resultInfo.status == 1">
              <div class="result-tip-sucess">
                <van-icon name="success" color="white" size="5px" />
              </div>
              <div class="success-content">同意出科</div>
            </div>
          </div>
          <div class="result-title result-title2">科主任鉴定</div>
          <div class="out-department-result">
            <div class="result-row"></div>
            <div class="result-content">{{resultInfo.directorAppraise}}</div>
            <div class="result-time">{{resultInfo.directorname}} {{resultInfo.directorDate}}</div>
          </div>
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
      resultInfo: ""
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
    console.log(1111);
    self.getResultList();
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
    getResultList() {
      console.log("start");
      let self = this;
      self.data = {
        command: "turnAppraise/queryTurnAppraise",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        detailId: this.$route.query.id,
        roleId: 0
      };
      self
        .post("/turnAppraise/queryTurnAppraise", self.data)
        .done(function(data) {
          // console.log(data);
          self.resultInfo = data.result;
          console.log(self.resultInfo);
        })
        .fail(function(error) {
          console.log("fail!!!");

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
  .out-department-results {
    background: #ffffff;
    .result-box {
      background: #ffffff;
      border-bottom: 1px dashed #e2e2e2;
      margin: 0px 20px;
      position: relative;
      .title-row {
        height: 20px;
        background: #ffffff;
        .disagree {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .result-tip-fail {
            line-height: 20px;
            background: #fa6114;
            height: 14px;
            width: 14px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .fail-content {
            font-size: 13px;
            color: #ec5926;
            letter-spacing: 0.2px;
            text-align: right;
            font-weight: 400;
            padding-left: 4px;
            padding-top: 2px;
          }
        }
        .agree {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .result-tip-sucess {
            line-height: 20px;
            background: #32ae57;
            height: 14px;
            width: 14px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .success-content {
            font-size: 13px;
            color: #00982d;
            letter-spacing: 0.2px;
            text-align: right;
            font-weight: 400;
            padding-left: 4px;
            padding-top: 2px;
          }
        }
      }
      .result-title {
        height: 20px;
        width: 57px;
        border-radius: 4px;
        background: #3d5166;
        z-index: 1;
        font-size: 11px;
        color: #ffffff;
        letter-spacing: 0.18px;
        text-align: center;
        line-height: 20px;
        font-weight: 400;
        position: relative;
        margin-left: 14px;
      }
      .result-title2 {
        height: 20px;
        width: 68px;
        border-radius: 4px;
        background: #3d5166;
        z-index: 1;
        font-size: 11px;
        color: #ffffff;
        letter-spacing: 0.18px;
        text-align: center;
        line-height: 20px;
        font-weight: 400;
        position: relative;
        margin-left: 14px;
      }
      .out-department-result {
        width: 100%;
        background: #f9f9f9;
        // position: absolute;
        // top: 32px;
        .result-row {
          height: 20px;
          margin: -10px 0px 0px 0px;
          position: relative;
          z-index: -1;
        }
        .result-content {
          font-size: 16px;
          color: #333333;
          letter-spacing: 0.23px;
          font-weight: 400;
          // margin: -10px 14px 0px 14px;
          margin: 0px 14px;
          word-wrap: break-word;
        }
        .result-time {
          height: 42px;
          line-height: 42px;
          font-size: 13px;
          color: #666666;
          letter-spacing: 0.22px;
          text-align: center;
          font-weight: 400;
          margin-bottom: 20px;
          display: flex;
          justify-content: flex-end;
          margin-right: 10px;
        }
      }
    }
  }
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