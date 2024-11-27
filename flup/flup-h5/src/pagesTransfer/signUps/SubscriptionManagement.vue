//申请签约
<template>
  <section ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </!-->
    <van-collapse v-if="currentPlan.length != 0" v-model="activeNames">
      <van-collapse-item v-for="(item, index) in currentPlan" :key="index" :name="index">
        <template #title>
          <div style=" display: flex;align-items: center;justify-content: space-between;">
            <span style=" color: #111;font-size: 17px;	font-weight: 600;">{{item.planName}}</span>
            <span style="font-size: 14px;color: #FF7B35;">{{item.status==1?'(订阅中)':''}}</span>
          </div>
        </template>
        <div class="service">
          <div>
            <div class="title">
              <p
                style="white-space:pre-wrap; word-wrap:break-word;"
                v-html="item.remarks?item.remarks:''"
              ></p>
              <van-button v-if="!item.status" type="info" size="small" @click="subscribe(item)">订阅</van-button>
              <van-button v-else type="info" size="small" @click="cancelSubscribe(item)">取消订阅</van-button>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div v-else class="noDatabox">
      <img src="../../assets/images/zwsj.png" />
    </div>
    <van-row v-if="show" class="footer marginX20 margin20X" type="flex" justify="center">
      <van-button @click="goSub" type="info">去订阅</van-button>
    </van-row>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // hide: false,
      activeNames: ['1'],
      planList: [],
      currentPlan: [],
      show: JSON.parse(this.$route.query.manager),
    }
  },
  created() {
    this.getShowPlanList()
  },
  watch: {
    show() {
      this.getShowPlanList()
    },
  },
  methods: {
    subscribe(item) {
      this.$dialog
        .confirm({
          message: '订阅后，您将会接收到该计划的推送内容，请确认操作',
        })
        .then(() => {
          this.$apis.subscribe({ planId: item.serialNo }).then((res) => {
            if (res.retData && res.retData.length > 0) {
              //通患者入组页面
              if (res.retData[0].groupCount > 0) {
                this.$dialog.alert({ message: '订阅成功！' })
                this.getShowPlanList()
              } else {
                this.$dialog.alert({ message: res.retData[0].groupInfo })
              }
            } else if (res.retInfo) {
              this.$dialog.alert({ message: res.retInfo })
            } else {
              this.$dialog.alert({ message: '订阅失败！' })
            }
          })
        })
        .catch(() => {})
    },
    cancelSubscribe(item) {
      this.$dialog
        .confirm({
          message:
            '取消订阅后，您将不会收到该订阅下的全部内容推送，您确认进行取消订阅操作吗？',
        })
        .then(() => {
          this.$apis.cancelSubscribe({ planId: item.serialNo }).then((res) => {
            if (res.retData) {
              this.$dialog.alert({ message: '取消订阅成功' })
              this.getShowPlanList()
            } else {
              this.$dialog.alert({ message: '取消订阅失败！' })
            }
          })
        })
        .catch(() => {})
    },
    goSub() {
      this.show = false
    },
    getShowPlanList() {
      this.$apis.getSubscribePlanList().then((res) => {
        this.planList = res.retData
        this.currentPlan = this.show
          ? this.planList.filter((x) => x.status)
          : this.planList
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
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
.service {
  > div {
    margin-bottom: 10px;
    .title {
      margin-bottom: 5px;
      display: flex;
      // align-items: center;
      justify-content: space-between;
      color: #333;
      font-size: 15px;
      > div {
        display: flex;
        align-items: center;
        color: #666;
        img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    p {
      // margin-left: 30px;
      font-size: 15px;
      color: #333;
      line-height: 25px;
    }
    > span {
      font-size: 14px;
      color: #b2b2b2;
      letter-spacing: 0.2px;
      line-height: 21px;
    }
  }
  .van-button--small {
    min-width: 70px;
  }
}
</style>
