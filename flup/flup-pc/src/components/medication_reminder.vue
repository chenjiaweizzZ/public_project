<template>
  <section class="wrapper">
    <section class="margin-top8 bgcolor-white">
      <el-row class="margin-top10" type="flex" align="middle">
        <i class="icon-patient_info"></i>
        <div class="margin-left10 title1">患者信息</div>
      </el-row>
      <div class="paddingX14 padding14X">
        <tr class="patient-info-item">
          <td class="item-label">患者姓名</td>
          <td class="item-value padding-left20">{{patientInfo.patient_name}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">性别</td>
          <td class="item-value padding-left20">{{patientInfo.sex}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">住院号</td>
          <td class="item-value padding-left20">{{patientInfo.inp_no}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">出院时间</td>
          <td class="item-value padding-left20">{{patientInfo.discharge_datetime && patientInfo.discharge_datetime.slice(0,10)}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">出院病区</td>
          <td class="item-value padding-left20">{{patientInfo.discharge_ward}}</td>
        </tr>
      </div>
    </section>
    <section class="margin-top8 bgcolor-white">
      <el-row class="margin-top10" type="flex" align="middle">
        <i class="icon-check_info"></i>
        <div class="margin-left10 title1">出院带药</div>
      </el-row>
      <div class="paddingX14">
        <div
          v-for="(item, index) in medication"
          class="padding10X"
          :class="{'border-bottom1': index !== medication.length-1}"
          :key="index"
        >
          <el-row type="flex" justify="space-between">
            <div style="max-width:210px;font-size:16px;font-weight:bold">{{item.drug_name}}</div>
            <div class="margin-left10">{{item.drug_spec_quantity}}</div>
          </el-row>
          <el-row class="margin-top10">
            <div>用药频次：{{item.memo}}</div>
            <div class="margin-top10">单次剂量/用法：{{item.dosage}}</div>
          </el-row>
        </div>
      </div>
    </section>
    <section class="paddingX14 padding14X flex1" style="background-color:#FFF9F5">
      <div style="color:#E98550;font-size:16px">用药建议</div>
      <div class="precautions">为了您的健康，出院后需谨遵医嘱按时服药。服药前请详细阅读药品说明书，如病情变化，或服药过程中有任何不适，请您及时反馈或到医院就诊。</div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      patientInfo: {},
      medication: []
    }
  },
  props: {
    serial_no: String,
  },
  created() {
    let discharge_number = this.serial_no.split('_')[1]
    this.$get(this.$baseURL.FollowUpApiUrl + '/api/FlupPlan/getSendMedication', {
      params: {
        discharge_number
      },
    }).then((res) => {
      this.patientInfo = res.dischargeRecord
      this.medication = res.dischargeMedication
    })
  }
}
</script>

<style lang="scss" scoped>
/deep/.wrapper {
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  .patient-info-item {
    height: 30px;
  }
  .precautions {
    margin-top: 10px;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0.2px;
    line-height: 21px;
  }
  .item-label {
    font-size: 14px;
    color: #666666;
    text-align: justify;
  }
  .item-value {
    font-size: 14px;
    color: #333333;
  }
}
</style>