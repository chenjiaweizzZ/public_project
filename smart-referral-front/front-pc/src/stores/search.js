import { defineStore } from "pinia";
import { reactive } from "vue";
import { storage } from "@/utils/storage";
export const searchStore = defineStore(
  "search",
  () => {
    let beinHospitalLeaveSearch = reactive({
      applyStartDate: "", //申请开始时间
      applyEndDate: "", //申请结束时间
      patientName: "", //患者姓名
      patientPhone: "", //患者联系方式
      processStatus: "", //流程状态
      businessStatus: "", //业务状态
      sourceDeptId: "", //转出科室
      targetDeptId: "", //转入科室
      sourceHospitalId: "", //转出医院
      targetHospitalId: "", //转入医院
      lastNotingStartDate: "",
      lastNotingEndDate: "",
      applyUserName: "",
      pageNo: 1,
      pageSize: 10,
    });
    let beinHospitalToSeatch = reactive({
      applyStartDate: "", //申请开始时间
      applyEndDate: "", //申请结束时间
      patientName: "", //患者姓名
      patientPhone: "", //患者联系方式
      processStatus: "", //流程状态
      businessStatus: "", //业务状态
      sourceDeptId: "", //转出科室
      targetDeptId: "", //转入科室
      sourceHospitalId: "", //转出医院
      targetHospitalId: "", //转入医院
      applyUserName: "",
      pageNo: 1,
      pageSize: 10,
    });
    let outpatientServiceLeaveSearch = reactive({
      applyStartDate: "", //申请开始时间
      applyEndDate: "", //申请结束时间
      patientName: "", //患者姓名
      patientPhone: "", //患者联系方式
      processStatus: "", //流程状态
      businessStatus: "", //业务状态
      sourceDeptId: "", //转出科室
      targetDeptId: "", //转入科室
      sourceHospitalId: "", //转出医院
      targetHospitalId: "", //转入医院
      applyUserName: "",
      pageNo: 1,
      pageSize: 10,
    });
    let outpatientServiceToSearch = reactive({
      applyStartDate: "", //申请开始时间
      applyEndDate: "", //申请结束时间
      patientName: "", //患者姓名
      patientPhone: "", //患者联系方式
      processStatus: "", //流程状态
      businessStatus: "", //业务状态
      sourceDeptId: "", //转出科室
      targetDeptId: "", //转入科室
      sourceHospitalId: "", //转出医院
      targetHospitalId: "", //转入医院
      applyUserName: "",
      pageNo: 1,
      pageSize: 10,
    });
    return {
      beinHospitalLeaveSearch,
      beinHospitalToSeatch,
      outpatientServiceLeaveSearch,
      outpatientServiceToSearch,
    };
  },
  {
    // 自定义storeage存储
    persist: {
      storage: {
        getItem(key) {
          return storage.getSessionStorage(key);
        },
        setItem(key, value) {
          return storage.setSessionStorage(key, value);
        },
      },
    },
  }
);
