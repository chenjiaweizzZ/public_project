import { axiosInsance } from "./index";
import qs from "qs";

export default function (Vue) {
  return {
    queryBindDevices(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/device/binding/queryBindDevices",
        {
          params
        }
      );
    },
    getReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/list",
        { params }
      );
    },
    saveReport(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/push",
        params
      );
    },
    getEmrLabReportDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrLabReportDetail",
        {
          params
        }
      );
    },
    getDiseaseReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/query",
        { params }
      );
    },
    getConfigHistory(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flup/patient/items/queryHistory",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getCurrentConfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flup/patient/items/query",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    saveCurrentConfig(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flup/patient/items/save",
        params
      );
    },
    executeCurrentConfig(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flup/patient/items/push",
        params
      );
    },
    queryInterveneConfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/intervene/config/queryByTab",
        {
          params
        }
      );
    },
    getDischargeRecordDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrDischargeRecordDetail",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    addIcdmPatientManage(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/AddIcdmPatientManage",
        params
      );
    },
    getIcdmPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/queryFlupPlanList",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getEmrPatientBaseInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrPatientBaseInfo",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getEmrDischargeRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrDischargeRecordList",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getByParameterKeyNoCache(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Parameter/getByParameterKeyNoCache",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    deletePatientRemark(remarkId) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/personalRecord/deletePatientRemark?remarkId=${remarkId}`,
        // {
        //   params: {
        //     ...params,
        //     hospitalId: Vue.prototype.$global.hospital_id
        //   }
        // }
      );
    },
    getFilledFlupContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/phoneFlup/queryFilledFlupContent",
        {
          params
        }
      );
    },
    importFilledFlupContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/phoneFlup/importFilledFlupContent",
        {
          params
        }
      );
    },
    //健康档案-检查记录接口
    getEmrExamReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrExamReportList",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getEmrEmrLabReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrLabReportList",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getPhysicalExaminationList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/tijian/getList",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getphysicalExaminationDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/tijian/geRecord",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },

    getPatientProDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryClinicReportDetail",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getEmrDischargeRecordDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrDischargeRecordDetail",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getClinicReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryClinicReportList",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getClinicReportListExt(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryClinicReportListExt",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },

    getEmrPatient(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/telemonitor/queryEmrPatient",
        { params }
      );
    },
    getEmrPatient2(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/telemonitor/queryUserGroupEmrPatient",
        { params }
      );
    },
    queryTelemonitorDataByUserId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/telemonitor/queryTelemonitorDataByUserId",
        {
          params
        }
      );
    },
    GetPatientDischargeRecordBySerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/api/Patient/GetPatientDischargeRecordBySerialNo",
        { params }
      );
    },
    reportpushAndSend(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/pushAndSend",
        params
      );
    },
    // 获取阳性指标规则列表
    getPositiveIndicatorRuleList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/platPositiveIndicatorRules/selectPositiveRuleList?${qs.stringify(
          params,
          {
            arrayFormat: "repeat"
          }
        )}`
      );
    },
    getSelectPositiveRuleListCount() {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/platPositiveIndicatorRules/selectPositiveRuleListCount`
      );
    },

    getPositiveIndicatorRuleDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/platPositiveIndicatorRules/selectRuleDetailBySerialNo",
        {
          params
        }
      );
    },
    // 保存阳性指标规则
    savePositiveIndicatorRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/platPositiveIndicatorRules/saveOrEditPositiveRules",
        params
      );
    },
    // 阳性规则启用或关闭短信推送
    enableNotify(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/platPositiveIndicatorRules/enableNotify",
        params
      );
    },
    // 删除阳性指标规则
    deletePositiveIndicatorRule(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/platPositiveIndicatorRules/deletePositiveRule",
        {
          params
        }
      );
    },
    // 根据指标筛选患者
    checkTargetRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/platPositiveIndicatorRules/checkTargetRule",
        params
      );
    },
    //筛选记录
    getPositiveRuleRecordList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/platPositiveIndicatorRules/selectPositiveRuleCountList?${qs.stringify(
          params,
          {
            arrayFormat: "repeat"
          }
        )}`
      );
    },
    //筛选记录患者数据
    getRuleWarningPatientList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/platPositiveIndicatorRules/selectRuleWarningPatientList?${qs.stringify(
          params,
          {
            arrayFormat: "repeat"
          }
        )}`
      );
    },
    //删除筛选的患者
    deleteWarningDetail(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/telemonitor/warning/deleteWarningDetail",
        params
      );
    },
    // 查询阳性指标参数
    getSelectIndicatorAttributeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/platPositiveIndicatorRules/selectIndicatorAttributeList",
        {
          params
        }
      );
    },
    // 导出指标异常预警
    exportTelemonitorWarning(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/telemonitor/warning/export",
        {
          params,
          responseType: "blob"
        }
      );
    },
    // 获取操作记录
    queryOperationRecords(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/telemonitor/warning/queryOperationRecords",
        {
          params
        }
      );
    },
    // 结束预警
    updateWarningState(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/telemonitor/warning/updateWarningState?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    selectWarningDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/telemonitor/warning/selectWarningDetail",
        {
          params
        }
      );
    },
    getPatientRemark(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/getPatientRemark",
        {
          params: {
            ...params,
            hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
    getPatientRemarkLog(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/getPatientRemarkLog",
        {
          params
        }
      );
    },
    editPatientRemark(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/personalRecord/editPatientRemark?remarkId=${params.remarkId}&remarkContent=${params.remarkContent}`,
      );
    },
    topPatientRemark(remarkId, isTop) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/personalRecord/TopOrCancelTopPatientRemark?remarkId=${remarkId}&isTop=${isTop}`,
      );
    },
    insertPatientRemark(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/insertPatientRemark",
        {
          params: {
            ...params,
            // hospitalId: Vue.prototype.$global.hospital_id
          }
        }
      );
    },
  };
}
