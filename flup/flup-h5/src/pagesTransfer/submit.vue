<template>
  <section class="wrap-container">
    <img class="margin-top97 margin-bottom40" src="@/assets/images/figure/submit.png" />
    <div style=" padding-bottom: 5px;margin-bottom: 10px;border-bottom: 1px solid #333;" class="tip-info">问卷提交成功，感谢您的配合</div>
    <template v-if="evaluationEnabled != 0">
      <div v-if="showModule.indexOf('dimension') !=-1 ||showModule.indexOf('score') !=-1 " class="tip-info">您的{{title}}评测得分如下:</div>
      <div class="info">
        <template v-if="showModule.indexOf('dimension') !=-1">
          <div v-for="(item, index) in questionnaireScoringList" :key="index">
            <span>{{item.dimensionName}}：</span>
            <span>{{item.scoring}}</span>
          </div>
        </template>
        <div v-if="showModule.indexOf('score') !=-1">
          <span>总分：</span>
          <span>{{totalPoints.scoring}}</span>
        </div>
        <template v-if="showModule.indexOf('result') !=-1">
          <div v-for="(item, index) in questionnaireResultList" :key="item.description">
            <span>
              评测结果{{questionnaireResultList.length ==1 ?'':index+1}}
              <span style="font-size: 14px;color: #999">(由【 {{item.dimensionList}}】得出)</span>：
            </span>
            <span style=" font-size: 15px;">{{item.description}}</span>
          </div>
        </template>
      </div>
    </template>
    <div class="button-container">
      <van-button class="button" @click="onClose" type="info">关闭</van-button>
      <!-- <van-button class="button" @click="onViewTask" type="info">查看任务</van-button> -->
    </div>
  </section>
</template>

<script>
let hasPath;
export default {
  beforeRouteEnter(to, from, next) {
    next(() => {
      //console.log(from);
      hasPath = from.path;
    });
  },
  data() {
    return {
      evaluationEnabled: null,
      title: null,
      showModule: [],
      questionnaireScoringList: [],
      questionnaireResultList: [],
      totalPoints: {},
    };
  },
  created() {
    if (this.$route.params.message.evaluationEnabled != 0) {
      this.title = this.$route.query.title;
      this.showModule = JSON.parse(this.$route.query.showModule);
      this.evaluationEnabled = this.$route.params.message.evaluationEnabled;
      this.questionnaireResultList =
        this.$route.params.message.questionnaireResultList;
      this.questionnaireScoringList =
        this.$route.params.message.questionnaireScoringList.filter(
          (element) => {
            if (element.dimensionId != 0) {
              return element;
            } else {
              this.totalPoints = element;
            }
          }
        );
    }
  },
  methods: {
    onViewTask() {
      location.href = `${this.$baseURL.ICDMApiUrl}/c/wechat/redirectViewTasks?hospitalId=${this.$route.query.hospitalId}`;
      // location.href =
      //   "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4ff0ce901b915cb3&redirect_uri=https%3A%2F%2Fsficdm%2Dfront%2Dtest.zwjk.com%2Fh5%2F%23%2FpersonalInformationS&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect";
    },
    onClose() {
      // var ua = navigator.userAgent.toLowerCase();
      // if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //   //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      //   wx.miniProgram.getEnv((res) => {
      //     if (res.miniprogram) {
      //       wx.miniProgram.reLaunch({
      //         appId: "wxabb478c4d24d9ccc",
      //         url: "/pages/index/index",
      //       });
      //     } else {
      //       this.$router.go(-1);
      //     }
      //   });
      // } else {
      //   // window.close()
      //   this.$router.go(-1);
      // }
      console.log(123,hasPath,this.$route.query.back,typeof this.$route.query.back);
      // document.referrer == "" ? window.close() : this.$router.go(-1);
      if(this.$route.query.back) {
        console.log("true")
        this.$router.go(-1)
      }else {
        console.log("false")
        window.close()
        this.$router.push({
          path: "/home"
        })
      }
      // this.$router.go(-1);
      // setTimeout(() => {
      //   this.$router.push({
      //     path: "/home",
      //   });
      // }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-container {
  // position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  background-color: white;
  .tip-info {
    text-align: center;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0.23px;
  }
  .button-container {
    width: 100%;
    margin: 10px 0;
    // position: sticky;
    // bottom: 20px;
    // left: 0;
    // right: 0;
    display: flex;
    justify-content: center;
    .button {
      width: 40%;
    }
    .button + .button {
      margin-left: 20px;
    }
  }
  .info {
    width: 80%;
    div {
      margin: 15px;
      span:nth-child(1) {
        font-size: 16px;
      }
    }
  }
}
</style>
