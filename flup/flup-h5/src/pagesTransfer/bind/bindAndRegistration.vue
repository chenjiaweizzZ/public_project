<template>
  <section ref="section" class="bind height100pct flex-column bgcolor-f2f2f2">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      统一就诊人注册
    </div>-->
    <van-cell-group class="flex1 bindTop">
      <van-field
        v-model="phone"
        required
        label="电话"
        :error-message="phoneErrorMsg"
        placeholder="请输入电话"
        @blur="verifyPhoneNumber(phone)"
      />
    </van-cell-group>
    <van-row class="marginX20 margin20X" type="flex" justify="center">
      <van-button :disabled="!phone" @click="submit" type="info" size="large">提交</van-button>
    </van-row>
  </section>
</template>

<script>
export default {
  data() {
    return {
      openId: '',
      phone: '',
      phoneErrorMsg: '',
      hospitalId: '',
    }
  },
  created() {
    console.log(window.location.href)
    this.openId = this.$route.query.openId
    if (this.openId) {
      sessionStorage.setItem('openId', this.openId)
      this.$apis.loginWithOpenId4C({ openId: this.openId }).then((res) => {
        if (res.retCode == '0') {
          window.location.href = res.retData.unipUrl
        }
      })
    } else {
      let str = window.location.href
      // this.hospitalId = str.match(/state=(\S*)#/)[1];

      str.replace(/\?.*\#/g, (w) => {
        this.getOpenId(w.slice(6, w.length - 1))
      })
      this.$nextTick(() => {
        this.$refs.section.style.height =
          document.documentElement.clientHeight + 'px'
      })
    }
  },
  methods: {
    setOpenId() {
      let str = window.location.href
      str.replace(/\?.*\#/g, (w) => {
        this.getOpenId(w.slice(6, w.length - 1))
      })
      this.$nextTick(() => {
        this.$refs.section.style.height =
          document.documentElement.clientHeight + 'px'
      })
    },
    getOpenId(id) {
      this.$apis.getOpenIdByCode({ code: id }).then((res) => {
        this.openId = res.retData.openId
        sessionStorage.setItem('openId', this.openId)
        this.loginWithOpenId()
      })
    },
    loginWithOpenId() {
      this.$apis.loginWithOpenId4C({ openId: this.openId }).then((res) => {
        if (res.retCode == '0') {
          window.location.href = res.retData.unipUrl
        }
      })
    },
    submit() {
      if (this.verifyPhoneNumber(this.phone) && this.openId) {
        this.$apis
          .bindAndRegistration({ openId: this.openId, phone: this.phone })
          .then((res) => {
            if (res.retCode == '0') {
              window.location.href = res.retData
            }
          })
      }
    },
    verifyPhoneNumber(v) {
      if (v) {
        if (this.$utils.checkPhone(v)) {
          this.phoneErrorMsg = ''
          return true
        } else {
          this.phoneErrorMsg = '手机信息有误'
          return false
        }
      } else {
        this.phoneErrorMsg = '请输入手机号'
        return false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.bind {
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
      background: #fff url('../../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .bindTop {
    position: relative;
    // margin-top: 44px;
  }
}
</style>
