//审核详情
<template>
  <div class="medicalcarebox14">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="patientName + ' ' + age+' 岁 '  + sex +' '+ phone"
    />
    <p>
      <span>随访类型</span>
      {{flupType}}
    </p>
    <p>
      <span>随访执行时间</span>
      {{executeDate}}
    </p>
    <p>
      <span>随访完成时间</span>
      {{realDate != 'null'?realDate:''}}
    </p>
    <p>
      <span>随访内容</span>
      {{content}}
    </p>
    <div v-show="status == 10" class="butbox">
      <div style="width:48%">
        <van-button type="default" size="large" @click="cancellation">作废</van-button>
      </div>
      <div style="width:48%">
        <van-button color="#1C97FC" type="primary" size="large" @click="pass">通过</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patientName: this.$route.query.patientName,
      age: this.$route.query.age,
      sex: this.$route.query.sex,
      phone: this.$route.query.phone,
      userId: this.$route.query.userId,
      flupType: this.$route.query.flupType,
      serialNo: this.$route.query.serialNo,
      realDate: this.$route.query.realDate,
      executeDate: this.$route.query.executeDate,
      content: this.$route.query.content,
      status: this.$route.query.status
    }
  },
  watch: {},
  mounted() {},
  methods: {
    pass() {
      this.$apis
        .saveAudit({
          serialNo: this.serialNo
        })
        .then(res => {
          if (res.retData) {
            this.$toast.success('审核通过')
            let _this = this
            setTimeout(function() {
              _this.$router.go(-1)
              // _this.$router.push({
              //   path: '/Doctor-auditList?flupType=' + _this.flupType
              // })
            }, 1000)
          }
        })
    },
    cancellation() {
      this.$apis
        .cancelAudit({
          serialNo: this.serialNo
        })
        .then(res => {
          if (res.retData) {
            this.$toast.success('作废成功')
            let _this = this
            setTimeout(function() {
              _this.$router.go(-1)
            }, 1000)
          }
        })
    }
  }
}
</script>

<style lang="scss" >
.medicalcarebox14 {
  height: 100%;
  background-color: #f2f2f2;
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
  p {
    font-size: 15px;
    padding: 3.7% 3.7%;
    color: #666;
    letter-spacing: 0.2px;
    line-height: 20px;
    background-color: #fff;
    span {
      width: 100px;
      display: inline-block;
      font-size: 15px;
      color: #111111;
      letter-spacing: 0.2px;
    }
  }
  .butbox {
    width: 100%;
    height: 62px;
    padding: 3.7%;

    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
  }
}
</style>