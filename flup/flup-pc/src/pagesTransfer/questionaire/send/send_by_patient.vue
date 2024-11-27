//患者发送模块
<template>
  <section>
    <section v-show="!showSendView">
      <!-- <selectTemplate ref="selectTemplate" @next="onNext"></selectTemplate> -->
      <SelectPatient ref="selectPatient" send-by="patient"></SelectPatient>
      <el-row type="flex" align="middle" class="footer padding-left20">
        <el-button class="width80px" type="primary" @click="onNext">下一步</el-button>
      </el-row>
    </section>
    <section v-if="showSendView">
      <SelectedInfo
        send-by="patient"
        :type="2"
        :selected-list="patientList"
        :currentSelectedList="templateList||[]"
      ></SelectedInfo>
      <SelectTemplate ref="selectTemplate" @next="onNext" @selected="(v)=>{templateList = [...v]}"></SelectTemplate>
      <!-- <selectPatient ref="selectPatient" :template-list="templateList"></selectPatient> -->
      <el-row class="footer padding-left20" type="flex" align="middle">
        <el-button class="width80px" type="primary" v-if="!showSendView" @click="onPrev">上一步</el-button>
        <el-button class="width80px" type="primary" @click="onSend">发送</el-button>
      </el-row>
    </section>
  </section>
</template>

<script>
import SelectTemplate from './components/select_template'
import SelectPatient from './components/select_patient'
import SelectedInfo from './components/selected_info'
import { patientModel } from '@/mixins/enum.js'
export default {
  name: 'send-by-patient',
  inject: ['reload'],
  mixins: [patientModel],
  data() {
    return {
      showSendView: this.$route.query.showSendView
        ? Boolean(this.$route.query.showSendView)
        : false,
      patientList: null,
      templateList: null,
      carryPatient: null,
    }
  },
  components: {
    SelectTemplate,
    SelectPatient,
    SelectedInfo,
  },
  created() {
    if (this.showSendView) {
      this.carryPatient = {
        idNo: this.$route.query.idNo,
        openId: this.$route.query.openId,
        patientName: this.$route.query.patientName,
        patientTypeCode: this.$route.query.patientTypeCode,
        serialNo: this.$route.query.serialNo,
        phone: this.$route.query.phone,
        userId: this.$route.query.userId,
      }
      this.patientList = [this.carryPatient]
    }
  },
  methods: {
    onNext(v) {
      this.patientList = this.$refs.selectPatient.selectedList
      if (this.patientList.length == 0) {
        this.$message({
          message: `请至少选择一名患者`,
          type: 'warning',
        })
        return
      }
      this.showSendView = true
    },
    onPrev() {
      this.showSendView = false
    },
    onSend() {
      //如果是从其他页面跳转直接赋值
      if (this.showSendView) {
        this.$refs.selectPatient.selectedList = JSON.parse(
          JSON.stringify(this.patientList)
        )
        if (this.$route.query.patientTypeCode) {
          this.$refs.selectPatient.patientTypeCode =
            this.$route.query.patientTypeCode
        }
      }

      let templateList = this.$refs.selectTemplate.selectedList
      let patientList = this.$refs.selectPatient.selectedList
      if (templateList.length == 0) {
        this.$message({
          message: `请至少选择一份${
            this.$route.params.type === 'wenjuan' ? '问卷' : '宣教'
          }`,
          type: 'warning',
        })
        return
      }
      let quesTemps = [],
        patients = []
      templateList.forEach((element) => {
        quesTemps.push({
          questionnaireId: element.serialNo,
          questionnaireName: element.questionnaireName,
          versionNumber: element.versionNumber,
        })
      })
      // quesTemps.push(`${this.templateItem.serial_no || ''}|${this.templateItem.questionnaire_name || ''}`)

      let tableName
      if (
        this.$refs.selectPatient.patientTypeCode == this.patientModel.admission
      ) {
        tableName = 'emr_admission_record'
      } else if (
        this.$refs.selectPatient.patientTypeCode == this.patientModel.discharge
      ) {
        tableName = 'emr_discharge_record'
      } else {
        tableName = 'clinic_record'
      }
      patientList.forEach((element) => {
        patients.push({
          deptName: element.deptName,
          deptCode: element.deptCode,
          userId: element.userId,
          patientName: element.patientName,
          idNo: element.idNo,
          openId: element.openId,
          phone: element.phone,
          patientSourceTableName: tableName,
          patientSourceTableId: element.serialNo || '',
          patientTypeCode: this.$refs.selectPatient.patientTypeCode,
          patientId: element.patientId,
        })
      })
      let loadingInstance = this.$loading({
        text: '正在发送中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      this.$apis
        .questionnairesendTemplateManual({
          userId: this.$global.serial_no || '',
          userName: this.$global.user_name || '',
          deptId: this.$global.dept_id || '',
          deptName: this.$global.dept_name || '',
          questionnaireTypeId:
            this.$route.params.type == 'wenjuan'
              ? '1'
              : this.$route.params.type == 'WJDC'
              ? '1'
              : '3',
          quesTemps: quesTemps,
          patients: patients,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          loadingInstance.close()
          this.$notify.info({
            title: '发送完成',
            message: res,
          })
        })
    },
  },
}
</script>
