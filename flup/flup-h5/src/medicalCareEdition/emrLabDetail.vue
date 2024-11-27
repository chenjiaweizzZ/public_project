<template>
  <div class="medicalcarebox21">
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
    <div class="labList">
      <div class="reportBody">
        <p class="p1 width100">检验项目</p>
        <p class="p1 width80">检查结果</p>
        <p class="p1 width80">参考范围</p>
        <p class="p1 width40">异常</p>
      </div>
      <div class="reportBody" v-for="(item, index) in labReport" :key="index">
        <p class="width100">{{ item.testName }}</p>
        <p class="width80">{{ item.testResult }}</p>
        <p class="width80">{{ item.referenceMin }}~{{ item.referenceMax }}</p>
        <p class="width40">{{ isNor(item) ? isNor(item) : "&emsp;" }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      patientInfo: {
        patientName: "",
        sex: "",
        age: "",
        phone: "",
      },
      labReport: {},
    };
  },
  created() {
    let userId = this.$route.query.userId;
    let hospitalId = sessionStorage.getItem("hospitalId");
    this.$apis.getEmrPatientBaseInfo({ userId }).then((res) => {
      this.patientInfo = res.retData;
      let info = this.$utils.getInfoByIdCard(this.patientInfo.idNo);
      this.patientInfo.age = info.age;
      this.patientInfo.dateOfBirth = info.birthday;
    });
    let labSn = this.$route.query.labSn;
    this.$apis.getEmrEmrLabReportDetail({ labSn: labSn, patientId: this.patientInfo.patientId }).then((res) => {
      this.labReport = res.retData;
    });
  },
  methods: {
    isNor(item) {
      return isNaN(item.testResult)
        ? ""
        : item.testResult < item.referenceMax &&
          item.testResult > item.referenceMin
        ? "正常"
        : "异常";
    },
  },
};
</script>
<style lang="scss" scoped>
.medicalcarebox21 {
  .labList {
    background: #fff;
    padding: 0 3.75%;
    .reportBody {
      background: #fafafa;
      padding: 12px 0;
      line-height: 21px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        font-family: PingFangSC-Regular;
        font-size: 15px;
        display: inline-block;
        white-space: pre-wrap;
        word-wrap: break-word;
        text-align: left;
      }
      .p1 {
        color: #666666;
        letter-spacing: 0.2px;
      }
    }
  }
}
</style>