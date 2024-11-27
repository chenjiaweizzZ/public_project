//服务包详情
<template>
  <section ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </div>-->
    <div style=" width:100%;height: 10px;"></div>
    <div class="contentbox">
      <div class="serviceCard">
        <div>
          <h3>{{detail.packageName}}</h3>
          <div>
            <span v-if="detail.auditStatus==0">审核中</span>
            <span v-else-if="detail.auditStatus==1">已签约</span>
            <span v-else-if="detail.auditStatus==2">已退回</span>
            <span v-else-if="detail.auditStatus==3">已失效</span>
            <span v-else-if="detail.auditStatus==9">支付失败</span>
          </div>
        </div>
        <div>
          <p></p>
          <p>¥{{detail.price}}/{{detail.validityDay}}天 &ensp;</p>
        </div>
      </div>
      <div class="content">
        <div>
          <div class="title">
            <div>
              <img src="../../assets/images/fwbnr.png" />
              服务包内容：
            </div>
          </div>
          <p style="white-space:pre-wrap; word-wrap:break-word;">{{detail.packageContent}}</p>
        </div>
        <div>
          <div class="title">
            <div>
              <img src="../../assets/images/yxq.png" />
              服务包有效期：
            </div>
          </div>
          <p>生效日起{{detail.validityDay}}天</p>
        </div>
        <div>
          <div class="title">
            <div>
              <img src="../../assets/images/wj.png" />
              服务包价格：
            </div>
          </div>
          <p>¥{{detail.price}}</p>
        </div>
        <div style="margin-bottom:0">
          <div class="title">
            <div>
              <img src="../../assets/images/qyys.png" />
              签约医生
            </div>
          </div>
          <p>{{detail.doctorName}}</p>
        </div>
      </div>
    </div>
    <span class="prompt">如对本服务包内容有疑问请致电0571-XXXXXXX</span>
    <div class="Signatory">
      <p>
        <span>签约人</span>
        {{detail.patientName}}
      </p>
      <p>
        <span>申请时间</span>
        {{detail.applyDatetime}}
      </p>
      <p>
        <span>身份证号</span>
        {{detail.idNo}}
      </p>
      <p>
        <span>手机号码</span>
        {{detail.phone}}
      </p>
    </div>
    <span style="border-bottom:0" class="prompt">
      服务有效期时间将会从审核通过后开始起算
      如有问题欢迎致电0571-XXXXXXX
    </span>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      detail: {},
    }
  },
  created() {
    this.$apis
      .getSignDetail({
        serialNo: this.$route.query.serialNo,
      })
      .then((res) => {
        this.detail = res.retData
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
.contentbox {
  padding: 0 3.7% 0;
  background-color: #fff;
  .serviceCard {
    height: 88px;
    padding: 20px 0 20px 20px;
    background-image: url(../../assets/images/fwbbj.png);
    background-size: cover;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        margin-block-start: 5px;
        margin-block-end: 5px;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-size: 17px;
        font-weight: 500;
        color: #ffffff;
        letter-spacing: 0.2px;
      }
      div {
        padding: 4px 20px;
        font-size: 14px;
        color: #fff;
        background-image: linear-gradient(90deg, #6cbdff 0%, #59b4ff 100%);
        border-radius: 14px 0 0 14px;
      }
      p {
        font-size: 12px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.8);
        letter-spacing: 0.17px;
      }
    }
  }
  .content {
    padding-top: 20px;
    > div {
      margin-bottom: 10px;
      .title {
        display: flex;
        align-items: center;
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
        margin-left: 30px;
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
  }
}
.Signatory {
  padding: 16px 14px;
  background: #ffffff;
  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #111111;
    letter-spacing: 0.2px;
    span {
      color: #666666;
    }
  }
}
.prompt {
  display: block;
  padding: 16px 14px;
  font-size: 14px;
  color: #b2b2b2;
  letter-spacing: 0.2px;
  line-height: 21px;
  background: #fff9f5;
  border-bottom: 18px solid #f2f2f2;
}
</style>
