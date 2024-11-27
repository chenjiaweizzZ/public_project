<template>
  <div class="processingDetails">
    <h3>基本信息</h3>
    <div class="Informationbox">
      <div>
        <span>来电号码</span>
        <p>{{ informationData.calledPhone | hideInfo("phone") }}</p>
      </div>
      <div>
        <span>主管/签约医生</span>
        <p>{{informationData.signDoctorName}}</p>
      </div>
      <div>
        <span>姓名</span>
        <p>{{ informationData.patientName | hideInfo("name") }}</p>
      </div>
      <div>
        <span>身份证号</span>
        <p>{{ informationData.idNo | hideInfo("idNo") }}</p>
      </div>
      <div>
        <span>年龄</span>
        <p>{{ informationData.age }}</p>
      </div>
      <div>
        <span>出生年月</span>
        <p>{{ informationData.dateOfBirth }}</p>
      </div>
      <div>
        <span>手机号码</span>
        <p>{{ informationData.mobile | hideInfo("phone") }}</p>
      </div>
      <div>
        <span>号码备注</span>
        <p>{{ informationData.mobileRemark }}</p>
      </div>
      <div>
        <span>常用住址</span>
        <p>{{ informationData.homeAddrState | reversalSite('1') }}{{ informationData.homeAddrCity | reversalSite('2') }}{{ informationData.homeAddrCounty | reversalSite('3') }}{{ informationData.homeAddrHouseNumber }}</p>
      </div>
    </div>
    <h3>处理记录</h3>
    <div class="recordingbox">
      <div>
        <span>问题分类</span>
        <p>{{ informationData.problemName }}</p>
      </div>
      <div>
        <span>紧急程度</span>
        <p>{{ informationData.urgencyName }}</p>
      </div>
      <div>
        <span>涉及科室</span>
        <p>{{ informationData.involveDeptName }}</p>
      </div>
      <div>
        <span>涉及医生</span>
        <p>{{ informationData.involveDoctorName }}</p>
      </div>
    </div>
    <div class="callList">
      <p>{{ informationData.processTime }}{{ informationData.patientName }}</p>
      <div>
        <p>
          <span>描述</span>
          {{ informationData.problemDetail }}
        </p>
        <p>
          <span>处理结果</span>
          {{ informationData.processResult }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      informationData: {},
    }
  },
  created() {
    this.$apis
      .getFeedbackDetail({
        id: this.$route.query.id,
      })
      .then((res) => {
        this.informationData = res
      })
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss">
.processingDetails {
  padding: 0 20px;
  h3 {
    font-size: 16px;
    color: #333333;
    padding-bottom: 10px;
    border-bottom: 1px solid #d7dae0;
  }
  .Informationbox,
  .recordingbox {
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    > div {
      min-width: 33%;
      display: flex;
      font-size: 14px;
      line-height: 40px;
      span {
        width: 100px;
        display: block;
        text-align: right;
        margin-right: 10px;
        color: #333333;
      }
      p {
        color: #111111;
      }
    }
  }
  .recordingbox {
    > div {
      min-width: 200px;
    }
  }
  .callList {
    padding: 17px 24px;
    > p {
      font-size: 14px;
      color: #333333;
      padding-bottom: 10px;
      border-bottom: 1px solid #d7dae0;
    }
    > div {
      p {
        font-size: 14px;
        color: #111111;
        line-height: 30px;
        span {
          width: 60px;
          display: inline-block;
          color: #333333;
          margin-right: 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>