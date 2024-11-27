//我的签约
<template>
  <section v-if="hide" ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </div>-->
    <div v-if="signList.length !=0" class="servicePackList">
      <div v-for="(item, index) in signList" :key="index" class="servicePack">
        <h3>
          {{item.packageName}}
          <span v-if="item.auditStatus==0" style="color:#4185F3">审核中</span>
          <span v-else-if="item.auditStatus==1" style="color:#B2B2B2">已签约</span>
          <span v-else-if="item.auditStatus==2" style="color:#FF7B35">已退回</span>
          <span v-else-if="item.auditStatus==3" style="color:#B2B2B2">已失效</span>
          <span v-else-if="item.auditStatus==9" style="color:#FF5F4E">支付失败</span>
        </h3>
        <div>
          <p>
            <span>服务包有效期</span>
            <span>生效日起{{item.validityDay}}天</span>
          </p>
          <p>
            <span>服务包价格</span>
            <span>¥{{item.price}}</span>
          </p>
          <p>
            <span>签约医生</span>
            <span>{{item.doctorName}}</span>
          </p>
          <p>
            <span>申请时间</span>
            <span>{{item.applyDatetime}}</span>
          </p>
        </div>
        <router-link :to="'servicePackDetails?serialNo='+item.serialNo">
          查看详情
          <img src="../../assets/images/jr.png" />
        </router-link>
      </div>
    </div>
    <div v-else class="noDatabox">
      <img src="../../assets/images/zwsj.png" />
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      hide: false,
      signList: [],
    }
  },
  created() {
    let _this = this
    this.$apis.getSignList().then((res) => {
      this.signList = res.retData
      setTimeout(function () {
        _this.hide = true
      }, 100)
    })
  },
  methods: {},
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
}
.servicePackList {
  .servicePack {
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #fff;
    h3 {
      padding: 18px 14px 8px;
      margin-block-start: 0px;
      margin-block-end: 0px;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-size: 17px;
      color: #111111;
      letter-spacing: 0.24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e2e2;
      span {
        font-size: 16px;
        letter-spacing: 0.2px;
        font-weight: 500;
      }
    }
    div {
      padding: 16px 14px;
      border-bottom: 1px solid #e2e2e2;
      p {
        line-height: 30px;
        font-size: 16px;
        color: #111;
        letter-spacing: 0.2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span:first-child {
          width: 130px;
          display: inline-block;
          color: #666666;
          letter-spacing: 0.19px;
          margin-right: 20px;
        }
      }
    }
    a {
      height: 40px;
      padding: 10px 14px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #0081ea;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
