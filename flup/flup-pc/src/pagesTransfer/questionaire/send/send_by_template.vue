<template>
  <section>
    <section v-show="!showSendView">
      <SelectTemplate ref="selectTemplate" @next="onNext"></SelectTemplate>
      <el-row type="flex" align="middle" class="footer padding-left20">
        <el-button class="width80px" type="primary" @click="onNext">下一步</el-button>
      </el-row>
    </section>
    <section v-if="showSendView">
      <SelectedInfo :type="1" :selected-list="templateList" :currentSelectedList="patientList||[]"></SelectedInfo>
      <SelectPatient
        ref="selectPatient"
        :template-list="templateList"
        @selected="(v)=>{patientList = v}"
      ></SelectPatient>
      <el-row class="footer padding-left20" type="flex" align="middle">
        <el-button class="width80px" type="primary" @click="onPrev">上一步</el-button>
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
  name: 'send-by-template',
  inject: ['reload'],
  mixins: [patientModel],
  data() {
    return {
      showSendView: false,
      templateList: null,
      patientList: null,
    }
  },
  components: {
    SelectTemplate,
    SelectPatient,
    SelectedInfo,
  },
  methods: {
    onNext(v) {
      this.templateList = this.$refs.selectTemplate.selectedList
      if (!this.templateList || this.templateList.length == 0) {
        this.$message({
          message: `请至少选择一份${this.type == 2 ? '问卷' : '宣教'}`,
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
      let templateList = this.$refs.selectTemplate.selectedList
      let patientList = this.$refs.selectPatient.selectedList
      if (!this.patientList || this.patientList.length == 0) {
        this.$message({
          message: `请至少选择一名患者`,
          type: 'warning',
        })
        return
      }
      let loadingInstance = this.$loading({
        text: '正在发送中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
      })
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

      this.$apis
        .questionnairesendTemplateManual({
          userId: this.$global.serial_no || '',
          userName: this.$global.user_name || '',
          deptId: this.$global.dept_id || '',
          deptName: this.$global.dept_name || '',
          questionnaireTypeId:
            this.$route.params.type === 'wenjuan'
              ? '1'
              : this.$route.params.type === 'WJDC'
              ? '1'
              : '3',
          quesTemps: quesTemps,
          patients: patients,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.showSendView = false
          loadingInstance.close()
          this.$notify.info({
            title: '发送完成',
            message: res,
          })
        })

      // this.$http
      //   .post(
      //     this.$baseURL.QuestionnaireApiUrl +
      //       "/api/SendTemplateNew/SendTemplateManual",
      //     {
      //       user_id: this.$global.serial_no || "",
      //       username: this.$global.user_name || "",
      //       deptid: this.$global.dept_id || "",
      //       deptname: this.$global.dept_name || "",
      //       questionnaire_type_id:
      //         this.$route.params.type === "wenjuan" ? "1" : "3",
      //       quesTemps: quesTemps,
      //       patients: patients,
      //       hospital_id: this.$global.hospital_id
      //     }
      //   )
      //   .then(res => {
      //     loadingInstance.close();
      //     if (res.status === 200) {
      //       if (res.data.ret_code === 0) {
      //         this.$notify({
      //           title: "发送完成",
      //           message: res.data.ret_info,
      //           duration: 0
      //         });
      //         this.showSendView = false;
      //       } else {
      //         this.$notify({
      //           title: "发送失败",
      //           message: res.data.ret_info,
      //           type: "error",
      //           duration: 0
      //         });
      //       }
      //     }
      //   });
    },
  },
}
</script>
