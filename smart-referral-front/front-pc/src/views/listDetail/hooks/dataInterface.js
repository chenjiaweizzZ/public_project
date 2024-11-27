/**
 * 科室列表等一些数据
 */
import { ref } from "vue";
import { http } from "@/utils/http";
import { apiUrl } from "@/utils/api";
import { userInfoStore } from "@/stores/userInfo";
const store = userInfoStore();
// console.log(store);
export default function () {
  let hospitalList = ref([]);
  let admConditionInfoList = ref([]);
  // 获取转入机构列表
  const getHospitalList = async (params) => {
    await http
      .get(apiUrl.getHospitalList, {
        params,
      })
      .then((res) => {
        if (res.retCode == 0) {
          hospitalList.value = res.retData.filter((item) => {
            return item.HospitalId != store.userInfo.unitId;
          });
        }
      });
  };
  const getCurrentUserDept = async () => {
    let res = await http.get(apiUrl.getCurrentUserDept);
    return res.retData;
  };
  // 获取转入机构科室列表
  const getSelectAllDeptByHospital = async (params) => {
    let res = await http.get(apiUrl.selectAllDeptByHospital, {
      params,
    });
    return res.retData;
  };
  const getSelectAllDeptBySourceId = async (params) => {
    // console.log(params)
    let res = await http.get(apiUrl.selectAllDeptBySourceId, {
      params,
    });
    // console.log(res)
    return res.retData;
  };
  // 获取病情列表
  const getAdmConditionInfo = async () => {
    await http.get(apiUrl.admConditionInfo).then((res) => {
      if (res.retCode == 0) {
        admConditionInfoList.value = res.retData;
      }
    });
  };
  getAdmConditionInfo()
  return {
    hospitalList,
    admConditionInfoList,
    getSelectAllDeptByHospital,
    getSelectAllDeptBySourceId,
    // remoteMethod,
    getHospitalList,
    getCurrentUserDept
  };
}
