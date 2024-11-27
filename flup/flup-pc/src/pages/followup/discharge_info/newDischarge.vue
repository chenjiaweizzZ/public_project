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
        <div class="label">住院天数</div>
        <div class="value">{{basicInfo.admissionDays}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">入院时间</div>
        <div class="value">{{basicInfo.admissionDatetime}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">出院时间</div>
        <div class="value">{{basicInfo.dischargeDatetime}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">主诊医生</div>
        <div class="value">{{basicInfo.chiefPhysician}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院原因</div>
      <div class="value">{{basicInfo.admissionReason}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院诊断</div>
      <div>{{basicInfo.admittingDiagnosis}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院诊断</div>
      <div class="value">{{basicInfo.dischargeDiagnosis}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院情况</div>
      <div class="value">{{basicInfo.admissionSituation}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">住院治疗经过</div>
      <div>{{basicInfo.hospitalCourse}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院状况</div>
      <div class="value">{{basicInfo.dischargeSituation}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院去向</div>
      <div class="value">{{basicInfo.disposition}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院带药</div>
      <div class="flex1">
        <el-table class="width100" :data="medicalList" border>
          <el-table-column label="药品名称" :resizable="false" prop="drugName"></el-table-column>
          <el-table-column label="药品名称/数量" :resizable="false" prop="drugSpecQuantity"></el-table-column>
          <el-table-column label="单次量/用法" :resizable="false" prop="dosage"></el-table-column>
          <el-table-column label="备注" :resizable="false" prop="memo"></el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">随访指导</div>
      <div class="value">
        <div>{{basicInfo.tipsAcitivity}}</div>
        <div>{{basicInfo.tipsDiet}}</div>
        <div>{{basicInfo.tipsDrugs}}</div>
        <div>{{basicInfo.tipsSelfCare}}</div>
      </div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">手术部位目测性监测</div>
      <div class="value">{{basicInfo.surgicalSiteMonitoring}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">复诊时间</div>
      <div class="flex1">
        <el-table class="width100" :data="subsequentVisitList" border>
          <el-table-column label="时间" :resizable="false" prop="followupTime"></el-table-column>
          <el-table-column label="地点" :resizable="false" prop="followupPlace"></el-table-column>
          <el-table-column label="复诊目的" :resizable="false" prop="followupPerpose"></el-table-column>
          <el-table-column label="科室" :resizable="false" prop="followupDept"></el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院医嘱</div>
      <div class="value">{{basicInfo.dischargeDoctorOrder}}</div>
    </el-row>
    <div
      class="text-align-right margin-top80"
    >{{`书写医师签名：${basicInfo.chiefPhysicianSignature || ''}`}}</div>
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
            .getEmrDischargeRecordDetail({
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