import { axiosInsance } from './index'

export default function (Vue) {
  return {
    //绑定设备
    bindDevice(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + '/b/device/binding/binding', params)
    },
    //解绑
    unBindDevice(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + '/b/device/binding/deleteBinding', params)
    },
    //字典管理
    queryDictByCode(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/SystemManage/BaseDict/queryDictByCode', { params })
    },
    //getDictsByDictCode
    queryDevicesTypeList(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/device/binding/queryDevicesTypeList', { params })
    },
    savePhoneFlupRecord(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + '/b/phoneFlup/savePhoneFlupRecord', params)
    },
    getRoutineFlupList(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/getRoutineFlupList', { params })
    },
    queryCurrentUserFlupPlanList(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/flupPlan/queryCurrentUserFlupPlanList', {
        params: {
          ...params,
          hospitalId: Vue.prototype.$global.hospital_id
        }
      })
    },
    selectParametersByParameterKey(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/Parameter/selectParametersByParameterKey', { params })
    },
    //立即执行计划任务
    sendFlupPatientPlanManual(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/sendFlupPatientPlanManual', { params })
    },
    reSendFlupPlanTask(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/reSendFlupPlanTask', { params })
    },
    //出院记录查询
    getPatientDischargeRecordList(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/phoneFlup/getPatientDischargeRecordList', { params })
    },
    //异常内容
    getExceptionContent(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/getExceptionContent', { params })
    },
    //删除计划
    delPatientPlanNew(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/delPatientPlan', null, { params })
    },
    getGroupPatienList(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/getGroupPatienList', { params })
    },
    //新删除计划
    delPatientPlanExt(params) {
      return axiosInsance.get(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/delPatientPlanExt', { params })
    },

  }
}
