// import {patientModel} from '@/mixins/enum.js'
// mixins: [patientModel],
const patientModel = {
  data() {
    return {
      patientModel: {
        //体检患者 0
        examination: 'EXAMINATION_PATIENT',
        //住院患者 1
        admission: 'ADMISSION_PATIENT',
        // 出院患者 2
        discharge: 'DISCHARGE_PATIENT',
        // 签约患者 3
        sign: 'SIGN_PATIENT',
        // 门诊患者 4
        out: 'OUT_PATIENT',
        // 互联网患者 5
        internet: 'INTERNET_PATIENT',
        // 转院患者 6
        transfer: 'TRANSFER_PATIENT',
        // 家医患者 7
        family: 'FAMILY_PATIENT',
        //手术患者 8
        operation: 'OPERATION_PATIENT'
      }
    }
  },
}

//随访路径类型dictCode
const ruleType = {
  data() {
    return {
      ruleType: {
        ruleType: '202012221530366591nr',
        ruleTypeDept: '20201222153055074f7s',
        ruleTypeAge: '20201222153159503gcz'
      }

    }
  }

}

export { patientModel, ruleType }