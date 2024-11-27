// 医生绑定
<template>
  <div class="medicalcarebox2">
    <van-cell-group>
      <van-field
        v-model="doctorName"
        required
        label="姓名"
        placeholder="请输入姓名"
        @input="doctorName=doctorName.replace(/\s+/g,'')"
      />
      <van-field
        type="tel"
        v-model="phone"
        required
        label="手机号"
        placeholder="请输入手机号"
        :error-message="phoneqd||phonetf?'':'手机号格式错误'"
        @input="doctorName=doctorName.replace(/\s+/g,'')"
      />
    </van-cell-group>
    <div class="but1">
      <van-button :disabled="!doctorName||!phoneqd" type="info" size="large" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      doctorName: '',
      phoneyz: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
      phonetf: true,
      phoneqd: false,
      changebound: null,
      flag: 0,
    }
  },
  watch: {
    phone() {
      this.phoneqd = this.phoneyz.test(this.phone)
      this.phonetf = this.phoneqd
    },
  },
  mounted() {
    if (this.$route.query.changebound) {
      this.changebound = this.$route.query.changebound
      this.flag = 1
    }
    if (this.$route.query.openId && this.$route.query.openId != '') {
      sessionStorage.setItem('openId', this.$route.query.openId)
    } else if (location.search.indexOf('openId=') != -1) {
      let openIdRule = new RegExp('(^|&)openId=([^&]*)(&|$)')
      let openIdValue = window.location.search.substr(1).match(openIdRule)
      if (openIdValue[2]) {
        sessionStorage.setItem('openId', openIdValue[2])
      }
    }
    if (this.$route.query.token) {
      sessionStorage.setItem('token', this.$route.query.token)
      this.$apis
        .getDoctorInfoByToken({
          token: this.$route.query.token,
          openid: this.$route.query.openId,
        })
        .then((res) => {
          if (res.retData != null) {
            sessionStorage.setItem('ucUserId', res.retData.serialNo)
            sessionStorage.setItem('openId', res.retData.openId)
            this.$router.replace({
              path: 'Doctor-homepage',
              query: {
                openId: res.retData.openId,
              },
            })
          }
        })
    } else if (sessionStorage.getItem('openId')) {
      this.$apis.DoctorgetDoctorInfo().then((res) => {
        if (res.retData != null && !this.changebound) {
          sessionStorage.setItem('ucUserId', res.retData.serialNo)
          this.$router.replace({
            path: 'Doctor-homepage',
            query: {
              openId: res.retData.openId,
            },
          })
        } else {
          if (res.retData != null) {
            this.doctorName = res.retData.realName
            this.phone = res.retData.userName
          }
        }
      })
    } else if (this.$route.query.code) {
      this.dgetOpenId(this.$route.query.code)
    } else if (location.search.indexOf('code=') != -1) {
      let code = new RegExp('(^|&)code=([^&]*)(&|$)')
      let codeValue = window.location.search.substr(1).match(code)
      this.dgetOpenId(codeValue[2])
    }
  },
  methods: {
    dgetOpenId(code) {
      this.$apis
        .dgetOpenId({
          code,
        })
        .then((res) => {
          if (res.retData.openId) {
            sessionStorage.setItem('openId', res.retData.openId)
          }
          if (res.retData.isBanding) {
            this.$router.replace({
              path: 'Doctor-homepage',
              query: {
                openId: res.retData.openId,
              },
            })
            return
          }
        })
    },
    submit() {
      this.$apis
        .doctorsaveDoctorBinding({
          flag: this.flag,
          phone: this.phone,
          doctorName: this.doctorName,
        })
        .then((res) => {
          if (res.retCode != 0) {
            this.$dialog.alert({
              title: '绑定失败',
              message: res.retInfo,
            })
          } else {
            this.$toast.success('绑定成功')
            var _this = this
            setTimeout(function () {
              _this.$router.replace({
                path: 'Doctor-homepage',
                query: {
                  openId: res.retData.openId,
                },
              })
            }, 1000)
          }
        })
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox2 {
  .van-cell__title {
    color: #333;
  }
  .but1 {
    padding: 10px 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 2px solid #eee;
  }
}
</style>


