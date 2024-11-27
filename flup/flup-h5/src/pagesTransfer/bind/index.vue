<template>
  <section ref="section" class="bind height100pct flex-column bgcolor-f2f2f2">
    <van-cell-group class="flex1 bindTop">
      <van-field
        v-model="user.patientName"
        required
        label="姓名"
        :readonly="isEdit"
        :error-message="patientNameErrorMsg"
        placeholder="请输入姓名"
        maxlength="15"
        show-word-limit
        @blur="verifyPatientName(user.patientName)"
      />
      <van-field
        v-model="user.idNo"
        required
        label="身份证"
        :readonly="isEdit"
        placeholder="请输入身份证"
        :error-message="idCardErrorMsg"
        @blur="verifyIdCard(user.idNo)"
      />
      <van-field v-model="user.dateOfBirth" readonly label="出生日期" />
      <van-field v-model="user.sex" label="性别" readonly />
      <van-field
        v-model="user.phone"
        required
        label="手机号"
        type="tel"
        placeholder="请输入手机号"
        :error-message="phoneErrorMsg"
        @blur="verifyPhoneNumber(user.phone)"
      />
      <van-field
        v-if="!hideConsultationCard"
        v-model="user.consultationCard"
        label="就诊卡号"
        placeholder="请输入就诊卡号"
        maxlength="18"
        show-word-limit
        type="digit"
      />
    </van-cell-group>
    <van-row class="marginX20 margin20X" type="flex" justify="center">
      <van-button
        :disabled="disableButton"
        @click="submit"
        type="info"
        size="large"
      >{{ type === "append" ? "下一步" : "提交" }}</van-button>
    </van-row>
  </section>
</template>

<script>
export default {
  data() {
    return {
      openId: '',
      user: {
        dateOfBirth: '',
        idNo: '',
        patientName: '',
        sex: '',
        phone: '',
        consultationCard: '',
        openId: '',
      },
      //isEdit:false,
      idCardErrorMsg: '',
      phoneErrorMsg: '',
      patientNameErrorMsg: '',
      hospitalErrorMsg: '',
      hideConsultationCard: process.env.RUN_MODE == 'wlmq',
      value: '',
      showPicker: false,
    }
  },
  computed: {
    disableButton() {
      return !this.user.phone || !this.user.idNo || !this.user.patientName
    },
    type() {
      return this.$route.query.pathMatch
    },
    isEdit() {
      return this.type === 'append'
    },
  },
  mounted() {
    this.openId =
      this.$route.query.openId ||
      this.openId ||
      (sessionStorage.getItem('userInfo')
        ? JSON.parse(sessionStorage.getItem('userInfo')).openId
        : '')
    if (!this.openId) {
      if (location.search.indexOf('openId=') != -1) {
        let openIdRule = new RegExp('(^|&)openId=([^&]*)(&|$)')
        let openIdValue = window.location.search.substr(1).match(openIdRule)
        if (openIdValue[2]) {
          this.openId = openIdValue[2]
        }
      } else {
        if (this.$route.query.code) {
          this.getOpenId(this.$route.query.code)
        } else if (location.search.indexOf('code=') != -1) {
          let code = new RegExp('(^|&)code=([^&]*)(&|$)')
          let codeValue = window.location.search.substr(1).match(code)
          this.getOpenId(codeValue[2])
        }
      }
    } else {
      sessionStorage.setItem('openId', this.openId)
      this.getInfo()
    }
    this.initData()
  },
  methods: {
    getOpenId(id) {
      this.$apis.getOpenIdByCode({ code: id }).then((res) => {
        if (res.retData && res.retData.openId) {
          this.openId = res.retData.openId
          sessionStorage.setItem('openId', this.openId)
        }
        if (res.retData.bindingState) {
          this.$router.replace(
            this.$route.query.redirect || '/hospitalName?openId=' + this.openId
          )
        }
      })
    },
    getInfo() {
      this.$apis.getPatientInfo({ openId: this.openId }).then((res) => {
        if (res.retData) {
          if (this.type != 'bind') {
            this.$router.replace(
              this.$route.query.redirect ||
                '/hospitalName?openId=' + this.openId
            )
          } else {
            this.user.patientName = res.retData.patientName
            this.user.idNo = res.retData.idNo
            this.user.phone = res.retData.phone
            this.user.consultationCard = res.retData.consultationCard
            if (this.user.idNo) {
              this.verifyIdCard(this.user.idNo)
            }
          }
        }
      })
    },
    submit() {
      if (
        this.verifyPatientName(this.user.patientName) &&
        this.verifyIdCard(this.user.idNo) &&
        this.verifyPhoneNumber(this.user.phone)
      ) {
        if (this.type === 'append') {
          this.$router.push({
            name: 'addDetailInfo',
            params: { user: this.user },
          })
        } else {
          this.user.openId = this.openId
          this.$apis
            .savePatientInfoOld({ ...this.user, whetherBind: false })
            .then((res) => {
              if (res.error) {
                this.$dialog
                  .confirm({
                    message: res.retInfo,
                  })
                  .then(() => {
                    this.$apis
                      .savePatientInfoOld({ ...this.user, whetherBind: true })
                      .then((res) => {
                        if (res) {
                          this.$toast(res.retInfo)
                          this.getPatientInfo()
                        } else {
                          this.$toast('绑定失败')
                          return
                        }
                      })
                  })
              } else {
                if (res) {
                  this.$toast(res.retInfo)
                  this.getPatientInfo()
                } else {
                  this.$toast('绑定失败')
                  return
                }
              }
            })
        }
      }
    },
    getPatientInfo() {
      this.$apis.getPatientInfo({ openId: this.openId }).then((res) => {
        let userInfo = { ...res.retData, age: this.user.age }
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        this.$router.replace(
          this.$route.query.redirect || '/hospitalName?openId=' + this.openId
        )
      })
    },
    initData() {
      if (this.type === 'append') {
        this.user = JSON.parse(sessionStorage.getItem('userInfo'))
        this.user.birthday = this.$dayjs(this.user.birthday).format(
          'YYYY-MM-DD'
        )
      }
    },
    verifyPatientName(v) {
      if (v) {
        this.patientNameErrorMsg = ''
        return true
      } else {
        console.log(1)
        this.patientNameErrorMsg = '请输入姓名'
        return false
      }
    },
    verifyIdCard(v) {
      if (v) {
        let info = this.$utils.getInfoByIdCard(v)
        if (info) {
          this.user.sex = info.sex
          this.user.dateOfBirth = info.birthday
          this.user.age = info.age
          this.idCardErrorMsg = ''
          return true
        } else {
          this.idCardErrorMsg = '身份证信息有误'
          return false
        }
      } else {
        this.idCardErrorMsg = '请输入身份证号'
        return false
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
