//服务包签约管理
<template>
  <section ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </div>-->
    <div class="reportList">
      <div
        class="reportLi"
        style="background: #E8F0FF;border-radius: 8px;"
        @click="goToUrl('application')"
      >
        <img src="../../assets/images/sqqy.png" />
        <div style="font-weight: 600;">
          申请签约
          <img src="../../assets/images/jt1.png" />
        </div>
      </div>
      <div
        class="reportLi"
        style="background: #FFEFE7;border-radius: 8px;"
        @click="goToUrl('mySigning')"
      >
        <img src="../../assets/images/qygl.png" />
        <div style="font-weight: 600;">
          我的签约
          <img src="../../assets/images/jt2.png" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {}
  },
  async created() {},
  methods: {
    goToUrl(rou) {
      this.$router.push({
        path: '/' + rou,
        query: {
          openId: this.$route.query.openId,
        },
      })
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

  .reportList {
    // margin-top: 44px;
    padding: 20px 14px;
    .reportLi {
      width: 100%;
      height: 120px;
      padding: 10px 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > img {
        width: 100px;
        height: 100px;
      }
      div {
        font-size: 18px;
        color: #111111;
        letter-spacing: 0.2px;
        line-height: 26px;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
