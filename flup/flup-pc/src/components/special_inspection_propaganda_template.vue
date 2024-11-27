<template>
  <section class="wrapper">
    <section class="margin-top8 bgcolor-white">
      <el-row class="margin-top10" type="flex">
        <i class="icon-patient_info"></i>
        <div class="margin-left10 title1">患者信息</div>
      </el-row>
      <div class="paddingX14 padding14X">
        <tr class="patient-info-item">
          <td class="item-label">患者姓名</td>
          <td class="item-value padding-left20">{{patientInfo.name}}</td>
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
          <td class="item-label">床号</td>
          <td class="item-value padding-left20">{{patientInfo.bed_no}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">病区</td>
          <td class="item-value padding-left20">{{patientInfo.ward_name}}</td>
        </tr>
      </div>
    </section>
    <section class="margin-top8 bgcolor-white">
      <el-row class="margin-top10" type="flex">
        <i class="icon-check_info"></i>
        <div class="margin-left10 title1">检查信息</div>
      </el-row>
      <div class="paddingX14 padding14X">
        <tr class="patient-info-item">
          <td class="item-label">检查项目</td>
          <td class="item-value padding-left20">{{`${patientInfo.actual_exam_item}[${patientInfo.exam_part}]`}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">检查地点</td>
          <td class="item-value padding-left20">{{patientInfo.exam_address}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">预约号码</td>
          <td class="item-value padding-left20">{{patientInfo.exam_book_number}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">预约时间</td>
          <td class="item-value padding-left20">{{patientInfo.yy_date&&patientInfo.yy_date.replace('T', ' ')}}</td>
        </tr>
        <tr class="patient-info-item">
          <td class="item-label">排队队列</td>
          <td class="item-value padding-left20">{{patientInfo.exam_item}}</td>
        </tr>
      </div>
    </section>
    <section class="paddingX14 padding14X flex1" style="background-color:#FFF9F5">
      <div style="color:#E98550;font-size:16px">检查须知</div>
      <div class="precautions" v-html="getNote(patientInfo.note)"></div>
    </section>
  </section>
</template>

<script>
export default {
  data () {
    return {
      patientInfo: {}
    }
  },
  props: ['serial_no'],
  created () {
    let exam_number = this.serial_no.split('_')[2]
    this.$get(this.$baseURL.QuestionnaireApiUrl + '/api/Questionnaire/getSpecialExamQuestion',{
      params: {
        exam_number
      },
    }).then((res)=>{
      this.patientInfo = res
    })
  },
  methods: {
    getNote (note) {
      if(note) {
        note = note.replace(/\#\*/g, '. ')
        note = note.replace(/\\A\\/g, '<br>')
      }
      return note
    }
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
  }
  .item-value {
    font-size: 14px;
    color: #333333;
  }
  .title1 {
    font-size: 16px;
  }
}
</style>