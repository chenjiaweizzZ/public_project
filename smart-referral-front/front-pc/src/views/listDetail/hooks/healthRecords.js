import { ref } from "vue";
import { http } from "@/utils/http";
import { apiUrl } from "@/utils/api";
export default function () {
  let queryClinicReportList = ref([]);
  let queryEmrAdmissionRecordList = ref([]);
  let queryEmrDischargeRecordList = ref([]);
  let queryEmrExamReportList = ref([]);
  let queryEmrLabReportList = ref([]);
  // 选择入院列表
  let selectAdmissionRecordList = ref([]);
  // 选择出院列表
  let selectDischargeRecordList = ref([]);
  // 选择门诊列表
  let selectClinicReportList = ref([]);
  // 选择检验列表
  let selectEmrLabReportList = ref([]);
  // 选择检查列表
  let selectExamReportList = ref([]);
  // 获取门诊记录列表
  const getQueryClinicReportListExt = async (params) => {
    await http
      .get(apiUrl.queryClinicReportListExt, {
        params,
      })
      .then((res) => {
        queryClinicReportList.value = res.retData ? res.retData : [];
      });
  };
  // 获取入院记录列表
  const getQueryEmrAdmissionRecordList = async (params) => {
    await http
      .get(apiUrl.queryEmrAdmissionRecordList, {
        params,
      })
      .then((res) => {
        queryEmrAdmissionRecordList.value = res.retData ? res.retData : [];
      });
  };
  // 获取出院记录列表
  const getQueryEmrDischargeRecordList = async (params) => {
    await http
      .get(apiUrl.queryEmrDischargeRecordList, {
        params,
      })
      .then((res) => {
        queryEmrDischargeRecordList.value = res.retData ? res.retData : [];
      });
  };
  // 获取出院记录列表
  const getQueryEmrExamReportList = async (params) => {
    await http
      .get(apiUrl.queryEmrExamReportList, {
        params,
      })
      .then((res) => {
        queryEmrExamReportList.value = res.retData ? res.retData : [];
      });
  };
  // 获取出院记录列表
  const getQueryEmrLabReportList = async (params) => {
    await http
      .get(apiUrl.queryEmrLabReportList, {
        params,
      })
      .then((res) => {
        queryEmrLabReportList.value = res.retData ? res.retData : [];
      });
  };
  const selectList = (v) => {
    switch (v.type) {
      case "1":
        selectClinicReportList.value = v.value;
        break;
      case "2":
        selectExamReportList.value = v.value;
        break;
      case "3":
        selectEmrLabReportList.value = v.value;
        break;
      case "4":
        selectAdmissionRecordList.value = v.value;
        break;
      case "5":
        selectDischargeRecordList.value = v.value;
        break;
      default:
        break;
    }
  };
  return {
    queryClinicReportList,
    selectClinicReportList,
    selectEmrLabReportList,
    selectExamReportList,
    selectAdmissionRecordList,
    selectDischargeRecordList,
    queryEmrAdmissionRecordList,
    queryEmrDischargeRecordList,
    queryEmrExamReportList,
    queryEmrLabReportList,
    getQueryClinicReportListExt,
    getQueryEmrAdmissionRecordList,
    getQueryEmrDischargeRecordList,
    getQueryEmrExamReportList,
    getQueryEmrLabReportList,
    selectList,
  };
}
