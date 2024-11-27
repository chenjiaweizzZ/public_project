<template>
  <div class="discharge-info">
    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">姓名</div>
        <div class="value">{{basicInfo.patientName | hideInfo('patientName')}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">性别</div>
        <div class="value">{{basicInfo.sex}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">出生日期</div>
        <div
          class="value"
        >{{basicInfo.dateOfBirth?this.$utils.formatDate(basicInfo.dateOfBirth):''}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">住院号</div>
        <div class="value">{{basicInfo.inpNo}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">入院病区</div>
        <div class="value">{{basicInfo.admissionWard}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">入院时间</div>
        <div class="value">{{basicInfo.admissionDatetime}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院原因</div>
      <div class="value">{{basicInfo.chiefComplaints }}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院诊断</div>
      <div>{{basicInfo.presentHistory}}</div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    serialNo: String,
  },
  data() {
    return {
      basicInfo: {},
      medicalList: [],
      subsequentVisitList: [],
    }
  },
  watch: {
    serialNo: {
      async handler() {
        if (this.serialNo) {
          await this.$apis
            .queryEmrAdmissionRecordDetail({
              serialNo: this.serialNo,
            })
            .then((res) => {
              this.basicInfo = res
              this.medicalList = res.medicationList
              this.subsequentVisitList = res.followupList
            })
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss">
.discharge-info {
  padding: 0px 20px 20px 20px;
  .label {
    margin-right: 10px;
    min-width: 130px;
    text-align: right;
    color: #333333;
  }
  .value {
    color: #111111;
    white-space: pre-wrap;
  }
}
</style>