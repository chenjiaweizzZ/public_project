<template>
  <section class="healthFile">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      {{typeName[$route.query.index]}}
    </div>-->
    <div class="userInfo">
      <!-- <img src="../assets/images/medGuide.png" alt /> -->
      <img src="@/assets/images/medicine-bg.png" v-if="titieIndex==0" />
      <img src="@/assets/images/sport-bg.png" v-if="titieIndex==1" />
      <img src="@/assets/images/diet-bg.png" v-if="titieIndex==2" />
      <div class="title">
        {{funcDetail.type}}
        <div class="type">{{funcDetail.type}}</div>
      </div>
    </div>
    <div class="hfBtns">
      <div class="docInfo">
        <span class="short"></span>
        医生 : {{ funcDetail.doctor }}
        <span>{{ funcDetail.createTime.slice(0, 10) }}</span>
      </div>
      <div class="medInfo">
        <p style="white-space: pre-wrap;" v-html="funcDetail.content"></p>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      typeName: ['用药指导', '运动方案', '饮食建议'],
      funcDetail: [],
      titieIndex: null,
      patientId: '',
    };
  },
  created() {
    this.titieIndex = this.$route.query.index;
    this.title(this.typeName[this.$route.query.index]);
    this.patientId = this.$route.query.patientId;
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$apis.queryInfo(this.$route.query.id, this.typeName[this.$route.query.index]).then((res) => {
        this.funcDetail = res.retData;
      });
    },
  },
  beforeDestroy() {
    sessionStorage.setItem('currentPatientId', this.patientId);
  },
};
</script>
<style lang="scss">
.healthFile {
  .van-cell .van-cell__title {
    color: #333;
    img {
      width: 22px;
      vertical-align: middle;
    }
  }
}
</style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.healthFile {
  min-height: 200px;
  // background: url(../assets/images/healthFile/healthFileBg.png) no-repeat;
  background-size: contain;
  position: relative;
  &::before {
    content: '';
    display: table;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .userInfo {
    position: relative;
    // margin-top: 44px;
    .title {
      position: absolute;
      top: 40px;
      left: 20px;
      font-family: 苹方-简;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0.25px;

      color: #ffffff;
      .type {
        font-family: 苹方-简;
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        letter-spacing: 0.17px;
        color: #ffffff;
        margin-top: 12px;
      }
    }
  }
  .userInfo {
    position: relative;
    font-size: 0;
    img {
      width: 100%;
    }
  }
  .hfBtns {
    position: relative;
    top: -40px;
    // width: 92.5%;
    // margin-left: 3.75%;
    padding-bottom: 14px;
    background: #ffffff;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    overflow: hidden;
    border-radius: 24px 24px 0px 0px;
    .docInfo {
      padding: 33px 3.75% 10px 3.75%;
      color: #111;
      letter-spacing: 0.2px;
      border-bottom: 1px solid #e2e2e2;
      font-family: 苹方-简;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      color: #333333;
      .short {
        width: 3px;
        height: 16px;
        border-radius: 1.5px;
        background: #32ae57;
        float: left;
        margin-right: 10px;
      }
      span {
        float: right;
        font-family: ArialMT;
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        letter-spacing: 0.2px;
        color: #333333;
      }
    }
    .medInfo p {
      padding: 10px 3.75%;
      line-height: 20px;
      font-size: 14px;
      color: #111111;
    }
  }
}
</style>
