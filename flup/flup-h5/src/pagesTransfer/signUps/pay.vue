//服务包支付
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
          <h3>{{servicePack.packageName}}</h3>
          <div>待支付</div>
        </div>
        <div>
          <p></p>
          <p>¥{{servicePack.price}}/{{servicePack.validityDay}}天 &ensp;</p>
        </div>
      </div>
      <div class="content">
        <div>
          <div class="title">
            <div>
              <img src="../../assets/images/fwbnr.png" />
              服务包内容
            </div>
          </div>
          <p style="white-space:pre-wrap; word-wrap:break-word;">{{servicePack.packageContent}}</p>
        </div>
        <div>
          <div class="title">
            <div>
              <img src="../../assets/images/yxq.png" />
              服务包有效期
            </div>
          </div>
          <p>生效日起{{servicePack.validityDay}}天</p>
        </div>
        <div>
          <div class="title">
            <div>
              <img src="../../assets/images/wj.png" />
              服务包价格
            </div>
          </div>
          <p>¥{{servicePack.price}}</p>
        </div>
        <div style="margin-bottom:0;">
          <div class="title">
            <div>
              <img src="../../assets/images/qyys.png" />
              签约医生
            </div>
          </div>
          <p>{{doctor.realName}}</p>
        </div>
      </div>
    </div>
    <span class="prompt">如对本服务包内容有疑问请致电0571-XXXXXXX</span>
    <div class="Signatory">
      <p>
        <span>签约人</span>
        {{userInfo.patientName}}
      </p>
      <p>
        <span>申请时间</span>
        {{myDate}}
      </p>
      <!-- <p>
        <span>身份证号</span>
        {{userInfo.idNo}}
      </p>-->

      <!-- <p>
        <span>手机号码</span>
        {{userInfo.phone}}
      </p>-->
    </div>
    <van-field v-model="userInfo.idNo" type="tel" label="身份证号" input-align="right" />
    <van-field v-model="userInfo.phone" type="tel" label="手机号码" input-align="right" />
    <span class="prompt">
      服务有效期时间将会从审核通过后开始起算
      如有问题欢迎致电0571-XXXXXXX
    </span>
    <div style=" width:100%;height: 61px;"></div>
    <div class="but">
      <van-button style="font-size: 17px;" type="primary" block color="#FF7B35" @click="pay">确认支付</van-button>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      myDate: null,
      servicePack: JSON.parse(this.$route.query.servicePack),
      doctor: JSON.parse(this.$route.query.doctor),
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
    }
  },
  created() {
    this.myDate = new Date().toLocaleDateString()
  },
  methods: {
    pay() {
      let phoneyz = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!reg.test(this.userInfo.idNo)) {
        this.$toast('身份证号不正确')
        return
      }
      if (!phoneyz.test(this.userInfo.phone)) {
        this.$toast('手机号不正确')
        return
      }
      this.$apis
        .saveSign({
          doctorId: this.doctor.userId,
          doctorName: this.doctor.realName,
          idNo: this.userInfo.idNo,
          packageCode: this.servicePack.serialNo,
          packageName: this.servicePack.packageName,
          patientName: this.userInfo.patientName,
          phone: this.userInfo.phone,
          price: this.servicePack.price,
          validityDay: this.servicePack.validityDay,
        })
        .then((res) => {
          let payment
          if (res.retData) {
            payment = true
          }
          this.$router
            .push({
              path: 'paymentResult',
              query: {
                payment: payment,
              },
            })
            .catch((err) => {
              err
            })
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
}
.contentbox {
  padding: 0 3.7% 5px;
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
        margin-bottom: 5px;
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
  padding: 0 0 0 14px;
  background: #ffffff;
  p {
    padding: 16px 14px 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #111111;
    letter-spacing: 0.2px;
    border-bottom: 1px solid #e2e2e2;
    span {
      color: #333;
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
  border-bottom: 8px solid #f2f2f2;
}
</style>
