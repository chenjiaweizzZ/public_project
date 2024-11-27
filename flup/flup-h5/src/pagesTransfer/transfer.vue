//统一就诊人
<template>
  <section ref="section" class="transfer">
    <div class="loading">
      <img src="../assets/images/loading.gif" alt />
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      openId: '',
      hospitalId: null,
    }
  },
  async created() {
    // console.log(window.location)
    //此处code是 统一就诊人 code 不是 微信code
    this.code = this.$route.query.code
    this.openId = this.$route.query.openId
    this.hospitalId = this.$route.query.hospitalId || this.$route.query.state
    if (this.hospitalId) {
      sessionStorage.setItem('hospitalId', this.hospitalId)
    }
    if (!this.hospitalId) {
      if (location.search.indexOf('state=') != -1) {
        let state = new RegExp('(^|&)state=([^&]*)(&|$)')
        let stateValue = window.location.search.substr(1).match(state)
        this.hospitalId = stateValue[2]
      } else if (location.search.indexOf('hospitalId=') != -1) {
        let hospitalIdRule = new RegExp('(^|&)hospitalId=([^&]*)(&|$)')
        let stateValue = window.location.search.substr(1).match(hospitalIdRule)
        this.hospitalId = stateValue[2]
      }
    }
    if (this.code) {
      await this.$apis
        .updatePatientInfo({
          openId: this.openId,
          code: this.code,
        })
        .then((res) => {
          if (res.retCode != '0') {
            // return;
            this.$dialog
              .alert({
                message: '该患者暂无随访计划',
              })
              .then(() => {
                this.$router.go(-1)
              })
          } else {
            sessionStorage.setItem('code', this.code)
            this.$router.replace({
              path: 'healthFileS',
              query: {
                openId: this.openId,
                conceal: true,
                hospitalId: this.hospitalId,
              },
            })
          }
        })
    } else if (!this.openId) {
      let str = window.location.href
      str.replace(/\?.*\#/g, (w) => {
        if (w.slice(6, w.length - 1)) {
          this.getOpenId(w.slice(6, w.length - 1))
        } else {
          return
        }
      })
    } else {
      this.loginWithOpenId4C()
    }
  },
  methods: {
    getOpenId(id) {
      this.$apis.getOpenIdByCode({ code: id }).then((res) => {
        this.openId = res.retData.openId
        sessionStorage.setItem('openId', this.openId)
        this.loginWithOpenId4C(this.openId)
      })
    },
    loginWithOpenId4C(openId) {
      this.$apis
        .loginWithOpenId4C(
          {
            openId: openId || this.openId,
            toMode: 'choose',
          },
          this.hospitalId
        )
        .then((res) => {
          if (res.retData) {
            // window.location.href = res.retData.unipUrl
            window.open(res.retData.unipUrl, '_self')
          } else {
            this.$dialog
              .alert({
                message: '该患者暂无随访计划',
              })
              .then(() => {
                this.$router.go(-1)
              })
          }
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.transfer {
  position: relative;
  width: 100%;
  height: 100%;
  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    padding: 10px;
    font-size: 0;
    border-radius: 8px;
    background: #ccc;
    img {
      width: 100%;
    }
  }
}
</style>
