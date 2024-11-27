<template>
  <div class="discharge-info">
    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">姓名</div>
        <div class="value">{{basicInfo.patient_name}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">性别</div>
        <div class="value">{{basicInfo.sex}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">出生日期</div>
        <div class="value">{{this.$utils.formatDate(basicInfo.date_of_birth)}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">病理号</div>
        <div class="value">{{basicInfo.pathology_no}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">入院病区</div>
        <div class="value">{{basicInfo.admission_ward}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">住院天数</div>
        <div class="value">{{basicInfo.admission_ward}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">入院时间</div>
        <div class="value">{{basicInfo.admission_datetime}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">出院时间</div>
        <div class="value">{{basicInfo.discharge_datetime}}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">主诊医生</div>
        <div class="value">{{basicInfo.chief_physician}}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院原因</div>
      <div class="value">{{basicInfo.admission_reason}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院诊断</div>
      <div>{{basicInfo.admitting_diagnosis}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院诊断</div>
      <div class="value">{{basicInfo.discharge_diagnosis}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">入院情况</div>
      <div class="value">{{basicInfo.admission_situation}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">住院治疗经过</div>
      <div>{{basicInfo.hospital_course}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院状况</div>
      <div class="value">{{basicInfo.discharge_situation}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院去向</div>
      <div class="value">{{basicInfo.disposition}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院带药</div>
      <div class="flex1">
        <el-table class="width100" :data="medicalList" border>
          <el-table-column label="药品名称" :resizable="false" prop="drug_name"></el-table-column>
          <el-table-column label="药品名称/数量" :resizable="false" prop="drug_spec_quantity"></el-table-column>
          <el-table-column label="单次量/用法" :resizable="false" prop="dosage"></el-table-column>
          <el-table-column label="备注" :resizable="false" prop="memo"></el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">随访指导</div>
      <div class="value">
        <div>{{basicInfo.tips_acitivity}}</div>
        <div>{{basicInfo.tips_diet}}</div>
        <div>{{basicInfo.tips_drugs}}</div>
        <div>{{basicInfo.tips_self_care}}</div>
      </div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">手术部位目测性监测</div>
      <div class="value">{{basicInfo.surgical_site_monitoring}}</div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">复诊时间</div>
      <div class="flex1">
        <el-table class="width100" :data="subsequentVisitList" border>
          <el-table-column label="时间" :resizable="false" prop="followup_time"></el-table-column>
          <el-table-column label="地点" :resizable="false" prop="followup_place"></el-table-column>
          <el-table-column label="复诊目的" :resizable="false" prop="followup_perpose"></el-table-column>
          <el-table-column label="科室" :resizable="false" prop="followup_dept"></el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">出院医嘱</div>
      <div class="value">{{basicInfo.discharge_doctor_order}}</div>
    </el-row>
    <div
      class="text-align-right margin-top80"
    >{{`书写医师签名：${basicInfo.chief_physician_signature || ''}`}}</div>
  </div>
</template>

<script>
export default {
  props: {
    serial_no: String,
  },
  data() {
    return {
      basicInfo: {},
      medicalList: [],
      subsequentVisitList: [],
    }
  },
  watch: {
    serial_no: {
      async handler() {
        if (this.serial_no) {
          await this.$apis
            .getDischargeInfo({
              serial_no: this.serial_no,
            })
            .then((res) => {
              this.basicInfo = res
            })
          this.$apis
            .getPatientDischargeMedicationList({
              user_id: this.basicInfo.user_id,
              page_index: 1,
              page_size: 100,
            })
            .then((res) => {
              this.medicalList = res.dataList
            })
          this.$apis
            .getPatientSubsequentVisitList({
              user_id: this.basicInfo.user_id,
              page_index: 1,
              page_size: 100,
            })
            .then((res) => {
              this.subsequentVisitList = res.dataList
            })
        }
      },
      immediate: true,
    },
  },
  // async created() {
  //   await this.$apis.getDischargeInfo({
  //     serial_no: this.serial_no
  //   }).then((res) => {
  //     this.basicInfo = res
  //   })
  //   this.$apis.getPatientDischargeMedicationList({
  //     user_id: this.basicInfo.user_id,
  //     page_index: 1,
  //     page_size: 100
  //   }).then((res) => {
  //     this.medicalList = res.dataList
  //   })
  //   this.$apis.getPatientSubsequentVisitList({
  //     user_id: this.basicInfo.user_id,
  //     page_index: 1,
  //     page_size: 100
  //   }).then((res) => {
  //     this.subsequentVisitList = res.dataList
  //   })
  // }
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