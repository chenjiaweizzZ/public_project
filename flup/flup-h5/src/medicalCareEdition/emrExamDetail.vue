<template>
  <div class="medicalcarebox20">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="
        patientInfo.patientName +
        ' ' +
        patientInfo.age +
        ' 岁 ' +
        patientInfo.sex +
        ' ' +
        patientInfo.phone
      "
    />
    <div class="emrReport">
      <div style="margin: 8px">
        <div class="reportTitle">
          <p>影像所见</p>
        </div>
        <div class="reportBody">{{ examReport.imagingFindings }}</div>
      </div>
      <div class="reportTitle">
        <p>检查结果</p>
      </div>
      <div class="reportBody">{{ examReport.imagingDiagnosis }}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      patientInfo: {
        patientName: '',
        sex: '',
        age: '',
        phone: '',
      },
      examReport: {},
    };
  },
  created() {
    let userId = this.$route.query.userId;
    let hospitalId = sessionStorage.getItem('hospitalId');
    this.$apis.getEmrPatientBaseInfo({ userId }).then((res) => {
      this.patientInfo = res.retData;
      let info = this.$utils.getInfoByIdCard(this.patientInfo.idNo);
      this.patientInfo.age = info.age;
      this.patientInfo.dateOfBirth = info.birthday;
    });
    let examId = this.$route.query.examId;
    this.$apis.getEmrExamReportDetail({ serialNo: examId }).then((res) => {
      this.examReport = res.retData;
    });
  },
};
</script>
<style lang="scss" scoped>
.medicalcarebox20 {
  .emrReport {
    .reportTitle {
      height: 47px;
      background: #ffffff;
      border-bottom: 1px solid #e2e2e2;
      p {
        padding: 14px 0 13px 14px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0.2px;
        line-height: 20px;
        font-weight: bold;
        white-space: nowrap;
      }
    }
    .reportBody {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #111111;
      letter-spacing: 0.2px;
      line-height: 24px;
      padding: 12px 14px 16px 14px;
      background-color: #fff;
    }
  }
}
</style>