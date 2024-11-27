//支付结果
<template>
  <section ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </div>-->
    <div class="box">
      <div v-if="payment" class="payment">
        <img src="../../assets/images/cg.png" />
        <h3>支付成功</h3>
        <p>签约申请已经提交给医师进行审核，请保证联络方式畅通。1-2个工作日内医师会联系您。</p>
      </div>
      <div v-else class="payment">
        <img src="../../assets/images/sb.png" />
        <h3>支付失败</h3>
        <p>
          签约申请提交失败，请检查支付情况，网络是否正常。如无法操作，欢迎致电客服
          <span style="color:#1C97FC">0571-XXXXXXXX</span>
        </p>
      </div>
    </div>
    <div style="width:90%; margin: 35px auto; 0">
      <van-button type="primary" size="large" color="#1C97FC" @click="shutDown">确定</van-button>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      payment: this.$route.query.payment,
    }
  },
  created() {},
  methods: {
    shutDown() {
      this.$router.replace(
        '/healthFileS?openId=' +
          JSON.parse(sessionStorage.getItem('userInfo')).openId
      )
      // var ua = navigator.userAgent.toLowerCase()
      // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      //   //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      //   wx.miniProgram.getEnv((res) => {
      //     if (res.miniprogram) {
      //       wx.miniProgram.navigateBack()
      //     } else {
      //       WeixinJSBridge.invoke('closeWindow')
      //     }
      //   })
      // } else {
      //   window.close()
      // }
    },
  },
}
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.evalReport {
  position: relative;
  width: 100%;
  height: 100%;
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
      background: #fff url('../../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .payment {
    width: 100%;
    height: 215px;
    padding: 30px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #fff;
    img {
      width: 65px;
      height: 65px;
    }
    h3 {
      margin-block-start: 0px;
      margin-block-end: 0px;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      width: 100%;
      font-size: 20px;
      color: #111111;
      letter-spacing: 0.2px;
      text-align: center;
    }
    p {
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.2px;
      text-align: center;
    }
  }
}
</style>
