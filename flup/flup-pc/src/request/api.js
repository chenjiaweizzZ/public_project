import { axiosInsance } from "./index";
import qs from "qs";
import chronicDiseaseApi from "./chronic_disease_api";
import transferApi from "./transfer";
import healthManagementApi from "./health_management_api";
import axios from "axios";
const checkHospitalID = "1119041818384238319";
let request = {};
request.install = function (Vue, option) {
  Vue.prototype.$get = axiosInsance.get;
  Vue.prototype.$post = axiosInsance.post;
  Vue.prototype.$request = axiosInsance.request;
  Vue.prototype.$http = axios;
  console.log(Vue.prototype.$baseURL);

  //封装接口
  Vue.prototype.$apis = {
    ...chronicDiseaseApi(Vue),
    ...transferApi(Vue),
    ...healthManagementApi(Vue),
    pushOperateLogs(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/b/user/center/pushOperateLogs`,
        {
          ...params
        }
      );
    },
    equityUsedStatistics(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/flup/equityUsedStatistics?pageNo=${params.pageNo}&pageSize=${params.pageSize}&beginDate=${params.beginDate}&endDate=${params.endDate}&hospitalId=${params.hospitalId}&deptId=${params.deptId}&groupId=${params.groupId}&manageUserId=${params.manageUserId}`
      );
    },
    //获取服务权益使用详情
    getGroupEquityDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/flup/getGroupEquityDetail?pageNo=${params.pageNo}&pageSize=${params.pageSize}&beginDate=${params.beginDate}&endDate=${params.endDate}&groupId=${params.groupId}&verifyItemCode=${params.verifyItemCode}&patientName=${params.patientName}&packageId=${params.packageId}`
      );
    },
    //获取服务权益使用套餐列表
    getPackageList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/flup/getPackageList?pageNo=${params.pageNo}&pageSize=${params.pageSize}&beginDate=${params.beginDate}&endDate=${params.endDate}&groupId=${params.groupId}&verifyItemCode=${params.verifyItemCode}`
      );
    },

    //健康管理师筛选列表
    getManagerUserList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flup/getManagerUserList",
        { params }
      );
    },

    //创建患者组
    createGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/create?patientGroupName=${params.patientGroupName}`
      );
    },
    //创建并加入患者组
    createAndJoin(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/createAndJoin`,
        params
      );
    },
    //编辑患者组
    updateGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/update?patientGroupName=${params.patientGroupName}&groupId=${params.groupId}`
      );
    },
    //删除患者组
    deleteGroup(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/delete?groupId=${params.groupId}`
      );
    },
    //加入患者组
    joinGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/join`,
        params
      );
    },
    //获取患者组列表
    patientGroupList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/getPatientGroupList?pageNo=${params.pageNo}&pageSize=${params.pageSize}&patientGroupName=${params.patientGroupName}`
      );
    },
    //获取患者组下的患者
    groupPatientList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/getPatientMembersList?groupId=${params.groupId}`
      );
    },
    //删除患者组组下的患者
    deleteGroupPatient(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/pgm/removePatient?groupId=${params.groupId}&patientId=${params.patientId}`
      );
    },
    getDeptByPrivileges(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/manager/department/getDeptByPrivileges`,
        {
          params
        }
      );
    },
    getGroupByPrivileges(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/manager/group/getGroupByPrivileges`,
        {
          params
        }
      );
    },
    exportQualityControlStatisticsData(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/s/statistics/exportQualityControlStatisticsData`,
        {
          ...params
        },
        {
          responseType: "blob"
        }
      );
    },
    exclEquityUsedStatistics(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/flup/exclEquityUsedStatistics?beginDate=${params.beginDate}&endDate=${params.endDate}&hospitalId=${params.hospitalId}&deptId=${params.deptId}&groupId=${params.groupId}&manageUserId=${params.manageUserId}`,
        {},
        {
          responseType: "blob"
        }
      );
    },
    satisfaction(recordId) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/satisfaction/${recordId}`
      );
    },
    getOnePackageVerifyList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/instantMessaging/personalRecord/getOnePackageVerifyList`,
        {
          params
        }
      );
    },
    selectVerifySatisfactionStatistics(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/s/statistics/selectVerifySatisfactionStatistics`,
        {
          ...params
        }
      );
    },
    selectStatisticsResponseQuery(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/s/statistics/selectStatisticsResponseQuery`,
        {
          ...params
        }
      );
    },
    selectStatisticsResponseAverage(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/s/statistics/selectStatisticsResponseAverage`,
        {
          ...params
        }
      );
    },
    selectStatisticsOrderAverage(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/s/statistics/selectStatisticsOrderAverage`,
        {
          ...params
        }
      );
    },
    selectStatisticsOrderQuery(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/s/statistics/selectStatisticsOrderQuery`,
        {
          ...params
        }
      );
    },
    verifyOrderEquity(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/personalRecord/verifyOrderEquity?verifyItemId=${params.verifyItemId}&times=${params.times}&verifyDate=${params.verifyDate}&remark=${params.remark}`
      );
    },
    updateOrInsertOrderEquity(params, payOrderId, remark) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/personalRecord/updateOrInsertOrderEquity?payOrderId=${payOrderId}&remark=${remark}`,
        params
      );
    },
    getAllPackageVerifyList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/personalRecord/getAllPackageVerifyList`,
        {
          params
        }
      );
    },
    selectGroupUserInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/instantMessaging/selectGroupUserInfoList`,
        {
          params
        }
      );
    },
    selectGraphicGroupUserInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/instantMessaging/selectGraphicGroupUserInfoList`,
        {
          params
        }
      );
    },
    //售前
    selectPersonalGroupUserInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/instantMessaging/selectPersonalGroupUserInfoList`,
        {
          params
        }
      );
    },
    getHistoryQuery(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/instantMessaging/getHistoryQuery`,
        {
          params
        }
      );
    },
    listOrderForChat(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/listOrderForChat`,
        {
          ...params
        }
      );
    },
    //售前聊天记录
    selectPersonalConsultChatList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/selectPersonalConsultChatList`,
        {
          ...params
        }
      );
    },
    //获取随访类型列表 new
    queryFollowTypeList(hospitalId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/flupType/queryFollowTypeList?pageNo=1&pageSize=10&hospitalId=${hospitalId}&name=`
      );
    },
    //获取随访任务信息（java）
    getFollowupTaskInfoForJava(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/phoneFlup/getPhoneFlupPatientInfoBySerialNo",
        { params }
      );
    },
    //获取电话随访列表（java）
    getFolloupListInTelephoneForJava(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/phoneFlup/getPhoneFlupTaskList",
        { params }
      );
    },
    //添加临时随访计划new
    addTemporaryFollowupTaskNew(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/addTemporaryFollowUpTask",
        {
          ...params
        }
      );
    },
    //延期计划
    offsetDayPatientWaitingPlan(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/offsetDayPatientWaitingPlan",
        {
          ...params
        }
      );
    },
    //编辑临时随访计划new
    updateTemporaryFollowupTaskNew(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/updateFuFlupPatientPlanV2",
        {
          ...params
        }
      );
    },
    //废除随访任务
    deleteFuFlupPatientPlan(serialNo) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/deleteFuFlupPatientPlan?serialNo=" +
        serialNo
      );
    },
    //查询随访计划
    getFlupTaskBulletinBoard(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/getFlupTaskBulletinBoard",
        {
          ...params
        }
      );
    },
    //获取病人随访计划 new
    getFollowupPlanByPatientNew(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/getFollowUpPlanByPatient",
        {
          params
        }
      );
    },
    // 随访计划列表 new
    queryPatientFlupPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/flupPlan/queryCurrentUserFlupPlanList`,
        {
          params
        }
      );
    },

    // 获取电话宣教或问卷内容
    getTelSaveContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/phoneFlup/querySaveContent",
        { params }
      );
    },
    cutFlupPlanNew(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPatientPlan/cutFlupPlan",
        {
          ...params
        }
      );
    },
    //慢病计划列表
    chronicdiseaserelevance(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/queryFlupPlanList",
        { params }
      );
    },
    //问卷统计接口
    queryFollowUpContents(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPath/queryFollowUpContent",
        { params }
      );
    },
    //问卷统计查询随访计划
    queryFlupPlanListByDeptId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryFlupPlanListByDeptId",
        {
          params
        }
      );
    },
    //慢病计划体检指标列表
    physicalexaminationindex(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryHealthParameterByFlupPlanId",
        { params }
      );
    },
    //慢病计划关联
    SaveHealthParameterByFlupPlanId(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/saveHealthParameterByFlupPlanId",
        params
      );
    },
    //检查指标管理
    gethealthparameter(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/health/parameter/",
        { params }
      );
    },
    //检查指标新增
    posthealthparameter(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/health/parameter/",
        params
      );
    },
    //检查指标修改
    posthealthparameterupdate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/health/parameter/update/",
        params
      );
    },
    //检查指标删除
    deleteputposthealthparameter(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/parameter/" +
        params +
        "/delete",
        { params }
      );
    },
    //删除选中的监测指标范围数据
    deleteparameterrange(params) {
      let a =
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/parameter/range/" +
        params +
        "/delete";
      return axiosInsance.post(a);
    },
    //查询全部健康干预模板树结构
    getinterveneconfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/health/intervene/config",
        { params }
      );
    },
    //保存健康干预模板树结构
    postinterveneconfig(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/health/intervene/config",
        params
      );
    },
    //更新节点上的长文本内容
    configcontent(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/intervene/config/content",
        params
      );
    },
    //重命名节点名称
    confignode(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/health/intervene/config/node",
        params
      );
    },
    //删除节点以及其子节点
    deleteconfignode(params) {
      // let a = Vue.prototype.$baseURL.ICDMApiUrl + '/b/health/intervene/config/node/' + params + '/delete'
      // return axiosInsance.put(a)
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/intervene/config/node/" +
        params +
        "/delete"
      );
    },
    //查询健康干预模板树结构
    interveneconfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/intervene/config/" +
        params
      );
    },
    //保存到私人模板
    configsaveToPrivate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/health/intervene/config/saveToPrivate",
        params
      );
    },
    //查询慢病综合报告模板配置
    diseasesynthesis(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/chronic/disease/synthesis",
        {
          params
        }
      );
    },
    //保存慢病模板
    diseasesynthesissave(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/chronic/disease/synthesis/save",
        params
      );
    },
    //查询风险报告模板配置
    riskassessment(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/config/risk/assessment",
        { params }
      );
    },
    //查询风险报告模板配置
    riskassessmentSave(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/config/risk/assessment",
        { ...params }
      );
    },
    //查询风险报告模板配置
    riskassessmentDelect(id) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/config/risk/assessment/" + id
      );
    },
    //新字典查询字典分类列表
    BaseDictGetItemTypesForTree() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/GetItemTypesForTree"
      );
    },
    //保存字典数据
    BaseDictSaveDictItem(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/SaveDictItem",
        params
      );
    },
    //保存字典分类
    BaseDictSaveDictType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/SaveDictType",
        params
      );
    },
    //getDictsByDictCode
    BaseDictGetDictsByDictCode(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/GetDictsByDictCode",
        {
          params
        }
      );
    },
    //根据父级id 查询字典列表
    BaseDictGetDictItems(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/GetDictItems",
        {
          params
        }
      );
    },
    //根据父级id 查询字典列表    //随访规则库管理
    BaseDictGetEnableDictItems(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/baseDict/getEnableDictItems",
        {
          params
        }
      );
    },
    //getDictBySerialNo
    BaseDictGetDictBySerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/GetDictBySerialNo",
        {
          params
        }
      );
    },
    //delete
    BaseDictDeleteDictBySerialNo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/DeleteDictBySerialNo?serial_No=" +
        params
      );
    },
    //ChengeEnabled
    BaseDictChengeEnabled(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/ChengeEnabled?serial_no=" +
        params
      );
    },
    //新医院管理查询字典分类列表
    hospitalGetHospitalList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/GetHospitalList",
        params
      );
    },
    //新医院管理新增
    hospitalSaveHospital(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/SaveHospital",
        params
      );
    },
    //新医院管理删除医院
    hospitalDeleteHospitalBySerialNo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/DeleteHospitalBySerialNo?serial_No=" +
        params
      );
    },
    //查询所有医院列表
    hospitalgetAllHospitals() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/getAllHospitals"
      );
    },
    //查询随访类型，该方法和下面的代码重复，先临时提交保证流程走通在优化
    flupTypequeryFollowTypeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupType/queryFollowTypeList",
        { params }
      );
    },
    //查询随访类型列表
    getFollowupTypeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupType/queryFollowTypeList",
        { params }
      );
    },
    //保存随访类型详情
    flupTypesaveFollowType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupType/saveFollowType",
        params
      );
    },
    //查询随访规则列表
    flupRulequeryFollowUpRuleList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupRule/queryFollowUpRuleList",
        { params }
      );
    },
    //新缓存列表接口
    cacheManageGetKeys(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/CacheManage/GetKeys",
        {
          params
        }
      );
    },
    //新缓存删除
    CacheManagedeleteCacheByKey(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/CacheManage/DeleteCacheByKey",
        params
      );
    },
    //新缓存查询
    CacheManageGetKey(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/CacheManage/GetKey?pageNo=1&pageSize=" +
        params.pageSize +
        "&key=" +
        params.key,
        params
      );
    },
    //deleteAll
    CacheManageDeleteAllCache() {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/CacheManage/DeleteAllCache"
      );
    },
    //新接口管理 DeleteDictBySerialNo
    InterfaceDeleteDictBySerialNo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/DeleteDictBySerialNo",
        params
      );
    },
    //新接口管理 DeleteInterface
    InterfaceDeleteInterface(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/DeleteInterface",
        params
      );
    },
    //新接口管理GetInterfaceBySerialNo
    InterfaceGetInterfaceBySerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/GetInterfaceBySerialNo",
        { params }
      );
    },
    //新接口管理 GetInterfaceParameter
    InterfaceGetInterfaceParameter(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/GetInterfaceParameter",
        params
      );
    },
    //新接口管理 GetInterfacesForSelect
    InterfaceGetInterfacesForSelect() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/GetInterfacesForSelect"
      );
    },
    //新接口管理 GetInterfacesForTree
    InterfaceGetInterfacesForTree() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/GetInterfacesForTree"
      );
    },
    //新接口管理 SaveInterfaceName
    InterfaceSaveInterfaceName(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/SaveInterfaceName",
        params
      );
    },
    //新接口管理 SaveParameter
    InterfaceSaveParameter(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ConfigurationManage/Interface/SaveParameter",
        params
      );
    },
    //计划管理删除计划
    flupPlandeleteFollowPlanById(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/delFollowPlan?serialNo=" +
        params
      );
    },
    //获取随访计划下的慢病报告列表
    flupPlanqueryChronicDiseaseByFlupPlanId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryChronicDiseaseByFlupPlanId",
        {
          params
        }
      );
    },
    //获取当前用户随访计划
    flupPlanqueryCurrentUserFlupPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryCurrentUserFlupPlanList",
        {
          params
        }
      );
    },
    //获取当前用户随访计划New
    flupPlanqueryCurrentUserFlupPlanListNew(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryCurrentUserFlupPlanListNew",
        {
          params
        }
      );
    },
    //获取当前用户随访计划(不分页)
    transferPatientQueryCurrentUserFlupPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferPatient/queryCurrentUserFlupPlanList",
        { params }
      );
    },
    //获取计划
    flupPlanqueryFollowPlanById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/queryFollowPlanById",
        { params }
      );
    },
    //保存随访计划慢病报告列表
    flupPlansaveChronicDiseaseByFlupPlanId(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/saveChronicDiseaseByFlupPlanId",
        params
      );
    },
    //保存(新增|修改)随访计划配置
    flupPlansaveFollowPlan(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/saveFollowPlan",
        params
      );
    },
    //保存(新增|修改)随访计划配置New
    flupPlansaveFollowPlanNew(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/saveFollowPlanNew",
        params
      );
    },
    //获取当前用户的执行科室
    systemManagequeryCurrentUserDept(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/queryCurrentUserDept",
        {
          params
        }
      );
    },
    //根据科室id查随访/慢病组
    systemManagequeryFlupGroupByDeptId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/queryFlupGroupByDeptId",
        {
          params
        }
      );
    },
    queryFlupGroupByGroupType(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/queryFlupGroupByGroupType",
        {
          params
        }
      );
    },
    //根据组id查随访/慢病医生
    systemManagequeryFlupGroupMembersByGroupId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/queryFlupGroupMembersByGroupId",
        { params }
      );
    },
    //删除随访规则常规路径
    flupPathdelFlupPath(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPath/delFlupPath?serialNo=" +
        params
      );
    },
    //根据时间配置获取常规路径列表
    flupPathqueryFlupPathList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPath/queryFlupRuleConfigList",
        {
          params
        }
      );
    },
    //根据时间配置获取常规路径列表New
    queryAllFollowUpRuleList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupRule/queryAllFollowUpRuleList",
        {
          params
        }
      );
    },
    //根据时间配置获取常规路径列表New
    flupPathqueryFlupPathListNew(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPath/queryFlupRuleConfigListNew",
        {
          params
        }
      );
    },
    //查询随访内容列表
    flupPathqueryFollowUpContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPath/queryFollowUpContent",
        { params }
      );
    },
    //保存随访规则常规路径
    flupPathsaveFlupPath(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPath/saveFlupPath",
        params
      );
    },
    //保存随访规则常规路径——多条路径New
    flupPathsaveFlupPathNew(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPath/saveFlupPathNew",
        params
      );
    },
    //删除随访规则
    flupRuledelFollowRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupRule/delFollowRule?serialNo=" +
        params
      );
    },
    //查询随访规则列表
    flupRulequeryFollowUpRuleList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupRule/queryFollowUpRuleList",
        { params }
      );
    },
    //保存(新增|修改)随访规则
    flupRulesaveFollowRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupRule/saveFollowRule",
        params
      );
    },
    //修改 处方配置 状态
    editRulePrescriptionState(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupRule/editRulePrescriptionState",
        params
      );
    },
    //复制随访规则
    flupPathcopyFlupPath(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPath/copyFlupPath",
        params
      );
    },
    //删除随访规则时间
    timeconfigdelFlupTimeconfig(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/timeconfig/delFlupTimeconfig?id=" +
        params
      );
    },
    //根据规则查询时间配置列表
    timeconfigqueryTimeconfigListByRuleId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/timeconfig/queryTimeconfigListByRuleId",
        {
          params
        }
      );
    },
    //保存随访规则时间
    timeconfigsaveFlupTimeconfig(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/timeconfig/saveFlupTimeconfig",
        params
      );
    },
    //添加知识库标签
    FlupKnowledgeAddKnowledgeMark(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/FlupKnowledge/AddKnowledgeMark",
        params
      );
    },
    //删除知识库
    FlupKnowledgeDelKnowledge(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/FlupKnowledge/DelKnowledge",
        params
      );
    },
    //删除知识库标签
    FlupKnowledgeDelKnowledgeMarkByName(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/FlupKnowledge/DelKnowledgeMarkByName",
        params
      );
    },
    //获取知识库标签记录
    FlupKnowledgeGetKnowledgeMarkRecord(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/FlupKnowledge/GetKnowledgeMarkRecord",
        params
      );
    },
    //知识库查询
    FlupKnowledgeGetKnowledgeRecord(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/FlupKnowledge/GetKnowledgeRecord",
        params
      );
    },
    //更新修改知识库
    FlupKnowledgeSubmitAddKnowledge(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/FlupKnowledge/SubmitAddKnowledge",
        params
      );
    },
    //删除参数记录
    ParameterdeleteParameter(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Parameter/deleteParameter/" +
        params
      );
    },
    //删除参数类型记录
    ParameterdeleteParameterType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Parameter/deleteParameterType/" +
        params
      );
    },
    //保存一条参数记录
    ParametersaveParameter(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Parameter/saveParameter",
        params
      );
    },
    //保存一条参数类型记录
    ParametersaveParameterType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Parameter/saveParameterType",
        params
      );
    },
    //获取全部参数类型
    ParameterselectParameterType(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Parameter/selectParameterType",
        { params }
      );
    },
    //通过参数类型Id获取全部参数类型
    ParameterselectParametersByParameterTypeId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Parameter/selectParametersByParameterTypeId?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //修改一条参数
    ParameterupdateParameter(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Parameter/updateParameter",
        params
      );
    },
    //修改一条参数类型
    ParameterupdateParameterType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Parameter/updateParameterType",
        params
      );
    },
    //科室管理-根据医院查询 [所有科室] 列表
    departmentgetDeptByHospitalId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/department/getDeptByHospitalId",
        {
          params
        }
      );
    },
    //获取自己组所对应的科室
    selectDeptByUserGroup(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/department/selectDeptByUserGroup",
        {
          params
        }
      );
    },
    //查询医院列表
    hospitalgethospitallist() {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/GetHospitalList"
      );
    },
    //查询科室列表
    departmentquery(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/manager/department/query",
        params
      );
    },
    //宣教
    //模板库列表
    baseTemplatequeryQuBaseTemplateList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/baseTemplate/queryQuBaseTemplateList",
        {
          params
        }
      );
    },
    //设置随访组健康管理师
    setGroupManager(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/manager/group/setGroupManager?userId=${params.userId}&serialNo=${params.serialNo}`
      );
    },
    setGroupShowMember(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/manager/group/setGroupShowMember?serialNo=${params.serialNo}&userId=${params.userId}&selected=${params.selected}`
      )
    },
    moveGroupMemberOrder(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/manager/group/moveGroupMemberOrder?serialNo=${params.serialNo}&action=${params.action}`
      )
    },
    //设置聊天室成员
    setGroupChatMember(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/manager/group/setGroupChatMember?serialNo=${params.serialNo}&userId=${params.userId}&selected=${params.selected}`,
        params
      );
    },
    //查询出院病区列表
    flupPlanqueryDischargeWard(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/queryDischargeWard",
        { params }
      );
    },
    //查询患者列表
    flupPlanqueryPatientList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/queryPatientList",
        { params }
      );
    },
    //问卷统计接口
    questionnaireQuestionnaireStatistic(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/QuestionnaireStatistic",
        {
          params
        }
      );
    },
    //获取患者发送宣教列表
    questionnairequeryPatientSendRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/queryPatientSendRecord",
        {
          params
        }
      );
    },
    //获取统计记录详情
    questionnairequeryPatientSendRecordStatisticsDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/queryPatientSendRecordStatisticsDetail",
        { params }
      );
    },
    //发送统计接口
    questionnairequeryPatientSendRecordStatisticsList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/queryPatientSendRecordStatisticsList",
        { params }
      );
    },
    //问卷样本统计
    questionnairequeryQuestionnaireSampleAccount(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/queryQuestionnaireSampleAccount",
        { params }
      );
    },
    //获取反馈记录详情
    feedbackDetail(recordId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/feedback/detail/" + recordId
      );
    },
    //获取历史反馈记录列表
    feedbackList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/feedback/list",
        { params }
      );
    },
    //回复反馈
    feedbackReply(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/feedback/reply?recordId=${params.recordId}&feedbackContent=${params.feedbackContent}`
      );
    },
    //手动发送到患者，只支持问卷/宣教
    questionnairesendTemplateManual(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/sendTemplateManual",
        params
      );
    },
    //获取消息提醒列表
    selectMessage(params) {
      let { name, pageIndex, pageSize } = params;
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/template/selectMessage?name=${name}&pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
    },
    //新建消息提醒模板
    addMessage(params) {
      let { name, content } = params;
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/template/addMessage?name=${name}&content=${content}`
      );
    },
    //编辑消息提醒模板
    updateMessage(params) {
      let { templateId, name, content } = params;
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/template/updateMessage?name=${name}&content=${content}&templateId=${templateId}`
      );
    },
    //删除消息提醒模板
    deleteMessage(templateId) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/template/deleteMessage?templateId=${templateId}`
      );
    },
    //删除模板数据
    templatedelTemplateData(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/template/delTemplateData?serialNo=" +
        params.serialNo +
        "&hospitalId=" +
        params.hospitalId
      );
    },
    //导入模板数据
    templateimportTemplate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/importTemplate",
        params
      );
    },
    //查询模板详情
    templatequeryTemplateContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/queryTemplateContent",
        { params }
      );
    },
    //查询模板列表
    templatequeryTemplateList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/queryTemplateList",
        params
      );
    },
    //查询模板版本
    templatequeryTemplateVersion(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/template/queryTemplateVersion?serialNo=" +
        params
      );
    },
    //保存模板数据
    templatesaveTemplateData(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/saveTemplateData",
        params
      );
    },
    //delFlupGroupMember
    groupdelFlupGroupMember(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/delFlupGroupMember?serialNo=" +
        params
        // return axiosInsance.put(
        // 	Vue.prototype.$baseURL.ICDMApiUrl + '/b/manager/group/delFlupGroupMember?serialNo=' + params
      );
    },
    updateShowOnMobile(serialNo) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/updateShowOnMobile?serialNo=" + serialNo
      );
    },
    //删除慢病随访组
    groupdeleteFlupGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/manager/group/deleteFlupGroup",
        params
      );
    },
    //getFlupGroupByUserId
    groupgetFlupGroupByUserId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/getFlupGroupByUserId?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //查询随访慢病组列表
    groupgetFlupGroupList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/manager/group/getFlupGroupList",
        { params }
      );
    },
    //查询随访慢病组列表
    groupgetGroupByPrivileges(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/getGroupByPrivileges",
        { params }
      );
    },
    //查询组下成员列表
    groupgetFlupGroupMembersByGroupId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/getFlupGroupMembersByGroupId",
        { params }
      );
    },
    //getFlupGroupMembersByGroupIdAll
    groupgetFlupGroupMembersByGroupIdAll(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/getFlupGroupMembersByGroupIdAll",
        { params }
      );
    },
    //modifyGroupMembers
    groupmodifyGroupMembers(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/modifyGroupMembers",
        params
      );
    },
    //modifyUserFlupGroup
    groupmodifyUserFlupGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/group/modifyUserFlupGroup",
        params
      );
    },
    //保存慢病随访组
    groupsaveFlupGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/manager/group/saveFlupGroup",
        params
      );
    },
    //入院出院患者登记
    PatientaddRegistInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Patient/addRegistInfo",
        params
      );
    },
    //根据患者病案号住院号返回入院信息
    bgetEmrAdmissionRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Patient/b/getEmrAdmissionRecord",
        {
          params
        }
      );
    },
    //根据患者Id返回单个患者基本信息
    bgetPatientInfoByUserId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Patient/b/getPatientInfoByUserId",
        {
          params
        }
      );
    },
    //根据患者Id返回患者基本信息
    bgetPatientInfoListByUserList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Patient/b/getPatientInfoListByUserList",
        params
      );
    },
    //上传患者数据
    bimportExcelData(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Patient/b/importExcelData",
        params
      );
    },
    //获取患者列表
    PatientgetPatientList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Patient/getPatientList",
        { params }
      );
    },
    //获取患者列表2
    getUserGroupPatientList2(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Patient/getUserGroupPatientList",
        { params }
      );
    },
    //获取患者列表new
    PatientgetPatientListNew(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/device/binding/queryPatientAndDeviceList",
        {
          params
        }
      );
    },
    //更新患者状态
    PatientupdateEmrPatientStatus(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Patient/updateEmrPatientStatus",
        { params }
      );
    },
    //查询用户列表-带分页
    querygetUsersByHospitalId4Page(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/base/user/query/getUsersByHospitalId4Page",
        params
      );
    },
    //查询可显示列，及选中列
    columnqueryPageColumnConfigDisplay(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/page/column/queryPageColumnConfigDisplay",
        { params }
      );
    },
    //查询选中列
    columnqueryPageColumnDisplay(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/page/column/queryPageColumnDisplay",
        { params }
      );
    },
    //保存用户勾选的列
    columnsavePageColumns(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/page/column/savePageColumns",
        params
      );
    },
    //角色管理列表
    rolegetRoles(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/base/role/getRoles",
        { params }
      );
    },
    //查询操作日志
    systemManagequeryOperationLogList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/queryOperationLogList",
        {
          params
        }
      );
    },
    //登录验证
    FlupSmartgetLoginInfoByToken(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/api/FlupSmart/GetLoginInfoByToken",
        {
          params
        }
      );
    },
    //通过参数类型Key获取参数详情
    ParameterselectParametersByParameterKey(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Parameter/selectParametersByParameterKey",
        {
          params
        }
      );
    },
    //获取慢病患者
    PatientManagegetIcdmPatientManageList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/getIcdmPatientManageList",
        {
          params
        }
      );
    },
    //当前登陆用户- 根据header中的token值判断
    querycurrent() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/base/user/query/current"
      );
    },
    // 获取当前登入用户的路由访问权限
    getPermitMenuUrl(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/user/center/GetPermitMenuUrl",
        {
          params
        }
      );
    },
    //医院列表同步
    synchospital() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/user/center/sync/hospital"
      );
    },
    //科室列表同步
    syncdept() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/user/center/sync/dept"
      );
    },
    //根据计划id获取入组患者类型
    queryJoinPlanPatientTypeById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryJoinPlanPatientTypeById?serialNo=" +
        params
      );
    },
    //添加慢病患者
    AddIcdmPatientManage(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/AddIcdmPatientManage",
        params
      );
    },
    //获取计划下的患者
    getFlupPlanPatientList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/getFlupPlanPatientList",
        {
          params
        }
      );
    },
    //获取计划下的患者。 *健康管理迭代1新增
    getFlupPlanPatientListV2(params) {
      // return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + '/b/PatientManage/getFlupPlanPatientListV2', {
      // 	params
      // })
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/getFlupPlanPatientListV2",
        params
      );
    },
    //更新患者计划任务
    updateFuFlupPatientPlan(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/updateFuFlupPatientPlan",
        params
      );
    },

    //检查检验项目-------------------------------------------------
    //获取检查项目
    ExaminegetCheckItemList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/System/Examine/getCheckItemList?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //获取检查部位
    ExaminegetCheckPartsList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/System/Examine/getCheckPartsList?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //获取检查类型
    ExaminegetCheckTypeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/System/Examine/getCheckTypeList?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //获取检验列表
    ExaminegetExamineList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/System/Examine/getExamineList?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //获取检验样本类型
    ExaminegetSampleList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/System/Examine/getSampleList?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //送审单审核
    flupPatientPlanChangePatientPlanAuthState(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/ChangePatientPlanAuthState",
        params
      );
    },
    //根据单号获取详情
    flupPatientPlangetSendCheckDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/getSendCheckDetail",
        {
          params
        }
      );
    },
    //获取送检单审批列表
    flupPatientPlangetSendCheckList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/getSendCheckList",
        {
          params
        }
      );
    },
    //保存更新检查检验项目
    flupPatientPlansaveSendCheckContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/saveSendCheckContent",
        {
          params
        }
      );
    },
    //版本号
    getVersionList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/api/getVersionList"
      );
    },
    //评估报告查询接口(已生成情况下使用)
    queryById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/reportAudit/queryById",
        { params }
      );
    },
    //评估报告查询接口(已生成情况下使用)--返回最新的慢病报告
    queryByIdExt(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/reportAudit/queryByIdExt",
        { params }
      );
    },
    //发送评估报告
    sendReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/send",
        { params }
      );
    },
    //慢病评估报告审核
    changeChronicDiseaseReportAuthState(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/reportAudit/changeChronicDiseaseReportAuthState",
        params
      );
    },
    //获取评估报告列表
    queryReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/reportAudit/queryReportList",
        { params }
      );
    },
    //删除慢病模板
    diseasesynthesisdelete(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/chronic/disease/synthesis/" +
        params +
        "/delete"
      );
    },
    //查询比率列表
    statisticsqueryRatioList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/statistics/queryRatioList",
        params
      );
    },
    //健康档案个人信息上传报告记录
    reportQuery(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/patient/report/query?patientId=" +
        params
      );
    },
    //异常预警
    warningQuery(pageNo, pageSize, warningType, name, start, end, states, deptId = '') {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/telemonitor/warning/query?pageNo=${pageNo}&pageSize=${pageSize}&name=${name}&start=${start}&end=${end}&states=${states}&warningType=${warningType}&deptId=${deptId}`
      );
    },
    queryHistory(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/telemonitor/warning/queryHistory`,
        {
          params
        }
      );
    },
    addWainingHandle(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/telemonitor/warning/addWainingHandle",
        {
          ...params
        }
      );
    },
    getNewPlanStatisticsListx(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/getPatientPlanReport",
        {
          params
        }
      );
    },
    //获取样本统计表头
    querySampleHeader(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/statistics/querySampleHeader",
        params
      );
    },
    //查询样本列表
    querySampleList(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/statistics/querySampleList",
        params
      );
    },
    //获取样本统计表头2
    querySampleHeaderExt(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/s/statistics/querySampleHeaderExt",
        params
      );
    },
    //查询样本列表2
    querySampleListExt(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/statistics/querySampleListExt",
        params
      );
    },
    //获取随访计划下的慢病报告
    queryChronicDiseaseDetailByFlupPlanId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryChronicDiseaseDetailByFlupPlanId",
        { params }
      );
    },
    //评估报告查询接口(已生成情况下使用)
    cqueryById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/reportAudit/queryById",
        { params }
      );
    },
    //异常反馈模式
    ExceptionEnabled(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/ExceptionEnabled",
        params
      );
    },
    //获取基础患者列表
    getPatientBasicInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/Patient/getPatientBasicInfo",
        params
      );
    },
    //服务包--------------------------------------------------------------
    //删除服务包
    delPackageBySerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/delPackageBySerialNo",
        {
          params
        }
      );
    },
    //删除签约负责人
    delSignMember(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ServicePackage/delSignMember",
        { params }
      );
    },
    //获取服务包列表
    getAllPackageList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/getAllPackageList",
        {
          params
        }
      );
    },
    //获取当前服务包详情
    getPackageDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/getPackageDetail",
        {
          params
        }
      );
    },
    //根据服务包序列号查询签约医生列表
    getSignMember(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ServicePackage/getSignMember",
        { params }
      );
    },
    //查询当前要修改的负责人信息
    getSignMemberDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/getSignMemberDetail",
        {
          params
        }
      );
    },
    //根据服务包序列号查询用户列表
    getSignMemberByPackageNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/getSignMemberByPackageNo",
        {
          params
        }
      );
    },
    //获取科室类型列表
    queryDeptTypeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/queryDeptTypeList",
        {
          params
        }
      );
    },
    //获取服务包类型列表
    queryServicePackageTypeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/queryServicePackageTypeList",
        { params }
      );
    },
    //提交保存编辑后的负责人信息
    saveSignMemberDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/saveSignMemberDetail",
        {
          params
        }
      );
    },
    //更新服务包
    updatePackageStatus(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/updatePackageStatus",
        {
          params
        }
      );
    },
    //更新签约医生状态
    updateSignMemberStatus(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/updateSignMemberStatus",
        {
          params
        }
      );
    },
    //保存服务包
    savePackage(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ServicePackage/savePackage",
        params
      );
    },
    //保存选择的签约人
    saveSignMember(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ServicePackage/saveSignMember",
        params
      );
    },
    //编辑科室信息
    editDept(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/manager/department/editDept",
        params
      );
    },
    //提交保存编辑后的负责人信息
    saveSignMemberDetail(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/ServicePackage/saveSignMemberDetail",
        params
      );
    },
    //更新申请签约记录的状态为审核通过，并新增一条签约患者记录
    auditSignApply(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/signApplyRecord/auditSignApply?serialNo=" +
        params
      );
    },
    //查询申请签约列表
    getSignApplyRecordListExt(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/signApplyRecord/getSignApplyRecordListExt",
        { params }
      );
    },
    //更新申请签约记录的状态为退回
    retrunSignApply(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/signApplyRecord/retrunSignApply?serialNo=" +
        params
      );
    },
    //签约记录
    getSignRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/signApplyRecord/getSignRecordList",
        {
          params
        }
      );
    },
    //服务包签约统计
    getSignReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/signApplyRecord/getSignReport",
        { params }
      );
    },
    //呼叫中心
    //获取ipcc坐席列表
    getIpccAllAgent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getAllAgent",
        { params }
      );
    },
    //获取分机列表
    getDevicesList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getDevicesList",
        { params }
      );
    },
    //获取用户坐席信息
    getAgentByUser(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getAgentByUser",
        { params }
      );
    },
    //同步ipcc坐席列表
    syncIpccAgent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/syncAgent"
      );
    },
    //获取分机号码列表
    getIpccAllDevices(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getAllDevices",
        { params }
      );
    },
    //同步分机号码列表
    syncIpccDevices(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/syncDevices"
      );
    },
    //获取Ipcc列表
    getAllIpccConfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getAllIpccConfig",
        { params }
      );
    },
    //新增更新Ipcc配置
    editIpccConfig(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/editIpccConfig",
        params
      );
    },
    //更新Ipcc是否可用
    enableIpccConfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/enableIpccConfig",
        { params }
      );
    },
    //删除Ipcc
    delIpccConfig(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/delIpccConfig",
        { params }
      );
    },
    //获取未接来电列表
    getMissIn(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getMissIn",
        { params }
      );
    },
    //获取未接来电列表展开
    getMissInChild(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getMissInChild",
        { params }
      );
    },
    //数据源
    //获取数据源分类列表
    getDatasetBaseList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/getDatasetBaseList"
      );
    },
    //获取指定的一个数据源分类
    getDatasetBaseOne(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/getDatasetBaseOne",
        { params }
      );
    },
    //新增数据源分类
    saveDatasetBase(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/saveDatasetBase",
        params
      );
    },
    //删除数据源分类
    deleteDatasetBase(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/s/b/deleteDatasetBase?baseId=" +
        params
      );
    },

    //获取数据源列表
    getDatasetList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/getDatasetList",
        { params }
      );
    },
    //获取指定的一个数据源
    getDatasetOne(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/getDatasetOne",
        { params }
      );
    },
    //新增数据源
    saveDataset(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/saveDataset",
        params
      );
    },
    //删除数据源
    deleteDataset(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/s/b/deleteDataset?datasetId=" +
        params
      );
    },

    //获取数据源字段列表
    getDatasetFieldList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/getDatasetFieldList",
        { params }
      );
    },
    //获取指定的一个数据源字段
    getDatasetFieldOne(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/getDatasetFieldOne",
        { params }
      );
    },
    //新增数据源字段
    saveDatasetField(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/s/b/saveDatasetField",
        params
      );
    },
    //删除数据源字段
    deleteDatasetField(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/s/b/deleteDatasetField?fieldId=" +
        params
      );
    },

    //查询一个随访配置项
    queryFlupConfigOne(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/config/queryFlupConfigOne",
        {
          params
        }
      );
    },
    //查询随访组工作量
    queryFlupGroupWorkload(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flup/queryFlupGroupWorkload",
        params
      );
    },
    //查询年度随访工作量
    queryFlupYearWorkload(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flup/queryFlupYearWorkload",
        { params }
      );
    },
    //查询随访组工作量 详情列表
    getFlupPatientPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flup/getFlupPatientPlanList",
        { params }
      );
    },
    //处理记录
    getFeedbackRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getFeedbackRecord",
        { params }
      );
    },
    //处理记录详情
    getFeedbackDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getFeedbackDetail",
        { params }
      );
    },
    //选择导入患者列表
    getPatientList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getPatientList",
        { params }
      );
    },
    //保存处理记录
    saveFeedback(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/saveFeedback",
        params
      );
    },
    //通话总量统计
    getCallRecordReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getCallRecordReport",
        { params }
      );
    },
    //科室管理-根据医院id查询 [随访科室] 列表
    departmentgetFlupDeptByHospitalId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/manager/department/getFlupDeptByHospitalId",
        { params }
      );
    },
    //根据科室获取用户信息
    getUserBySectionId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getUserBySectionId",
        { params }
      );
    },
    //通话记录
    getCallRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getCallRecord",
        { params }
      );
    },
    //问卷库/宣教库获取模板信息
    getQuBaseTemplateNew(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/getQuBaseTemplate",
        { params }
      );
    },
    //来电弹屏
    getCallPatientInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getCallPatientInfo",
        { params }
      );
    },
    //获取录音文件
    getRecordUrl(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/getRecordUrl",
        { params }
      );
    },
    saveExamForClinic3(url) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: Vue.prototype.$baseURL.hisUrl + url
        }).then(res => {
          resolve(res.data);
        });
      });
    },
    //呼叫操作
    callOperation(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/callCenter/callOperation",
        { params }
      );
    },
    //病人基本信息列表
    getPatientBasicInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/getPatientBasicInfoList",
        {
          params
        }
      );
    },
    //编辑新增病人基本信息
    editPatientBasicInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PatientManage/editPatientBasicInfo",
        params
      );
    },
    //首页总数
    getHomePageCount(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/homepage/getHomePageCount",
        { params }
      );
    },
    // 患者列表 查询可显示列，及选中列new
    columnqueryPageColumnConfigDisplayExt(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/page/column/queryPageColumnConfigDisplayExt",
        { params }
      );
    },
    // 获取随访计划列表
    getAllFlupPlan(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/getAllFlupPlan",
        { params }
      );
    },
    // 获取随访计划列表
    getHomePageFlupPlan(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/homepage/getHomePageFlupPlan",
        { params }
      );
    },
    // 问卷宣教发送记录
    querySendDetailList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/querySendDetailList",
        { params }
      );
    },
    //患者随访记录
    getPatientPlanRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/getPatientPlanRecord",
        {
          params
        }
      );
    },
    //随访患者明细查询
    getPatientPlanDetailReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/getPatientPlanDetailReport",
        {
          params
        }
      );
    },
    //获取处方列表
    getPrescriptionList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/prescription/getPrescriptionList",
        {
          params
        }
      );
    },
    //获取处方列表详情
    getPrescriptionDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/prescription/getPrescriptionDetail",
        {
          params
        }
      );
    },
    //随访任务慢病报告----固定数据版
    reportAuditQueryById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/reportAudit/queryById",
        { params }
      );
    },
    //随访新发疾病统计
    getPatientPlanReportV2(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/getPatientPlanReportV2",
        {
          params
        }
      );
    },
    //新增长处方处理
    savePrescription(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/prescription/savePrescription",
        params
      );
    },
    //处方入组
    prescriptionJoiningGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/prescription/prescriptionJoiningGroup",
        params
      );
    },
    //删除处方
    deletePrescription(params) {
      let a =
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/prescription/" +
        params +
        "/delete";
      return axiosInsance.post(a);
    },
    //获取处方药详情
    getPrescriptionDrugByPlanSerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/prescription/getPrescriptionDrugByPlanSerialNo",
        { params }
      );
    },
    //获取患者聊天记录
    queryChat(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/doctor/patient/chat/queryChat",
        { params }
      );
    },
    //向患者发送消息
    sendChat(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/doctor/patient/chat/send",
        params
      );
    },
    //获取一体化预约检查检验接口
    getPatientCheckItemList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/appointment/getPatientCheckItemList",
        {
          params
        }
      );
    },
    //查询转入转出医院列表
    getTransferHospitalList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferHospital/getTransferHospitalList",
        {
          params
        }
      );
    },

    //选择转入转出医院列表
    selectTransferHospital(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferHospital/selectTransferHospital",
        {
          params
        }
      );
    },
    //保存转院配置
    saveTransferHospital(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferHospital/saveTransferHospital",
        params
      );
    },
    //删除转院配置
    delTransferHospital(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferHospital/delTransferHospital",
        {
          params
        }
      );
    },
    //编辑人群分类接口
    editPatientCrowdType(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/patientInfo/editPatientCrowdType",
        {
          params
        }
      );
    },
    //获取开启处方计划
    queryFlupPlanListByPrescriptionEnable(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryFlupPlanListByPrescriptionEnable",
        { params }
      );
    },
    //处理续方详情
    savePrescriptionAndJoiningGroup(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/prescription/savePrescriptionAndJoiningGroup",
        params
      );
    },
    //患者转院列表
    getTransferPatientRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferPatient/getTransferPatientRecordList",
        { params }
      );
    },
    //保存患者转出
    saveTransferPatient(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferPatient/saveTransferPatient",
        params
      );
    },
    //转院记录处理
    transferPatientHandle(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/transferPatient/transferPatientHandle",
        {
          params
        }
      );
    },
    //当前患者的随访任务
    getFlupPlanByPatient(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/getFlupPlanByPatient",
        {
          params
        }
      );
    },
    //获取配置了规则的随访计划
    getFlupRulePlanList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlanRule/getFlupRulePlanList"
      );
    },
    //获取待入组队列列表
    getFlupPatientPlanQueue(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlanQueue/getFlupPatientPlanQueue",
        { params }
      );
    },
    //确认待入组患者状态
    addGroupQueue(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlanQueue/addGroupQueue",
        {
          params
        }
      );
    },
    //取消待入组患者状态
    ignoreQueue(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlanQueue/ignoreQueue",
        {
          params
        }
      );
    },
    //根据随访计划获取规则配置
    getFlupPlanRule(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlanRule/getFlupPlanRule",
        { params }
      );
    },
    //新增编辑随访计划规则配置
    saveFlupPlanRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlanRule/saveFlupPlanRule",
        params
      );
    },
    //获取所有患者类型列表
    queryPatientTypeAll() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/patientType/queryPatientTypeAll?hospitalId=" +
        Vue.prototype.$global.hospital_id
      );
    },
    //获取患者类型列表，pageNo,pageSize
    queryPatientTypeList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/patientType/queryPatientTypeList?hospitalId=" +
        Vue.prototype.$global.hospital_id,
        {
          params
        }
      );
    },
    //保存患者类型
    savePatientType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/patientType/savePatientType",
        params
      );
    },
    //删除患者类型
    delPatientType(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/patientType/delPatientType/" +
        params
      );
    },
    //获取计划详情
    queryFlupPlanDetail(planId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryFlupPlanDetail?planId=" +
        planId
      );
    },
    //根据id和patientType获取信息
    getPatientInfoBySerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/Patient/getPatientInfoBySerialNo",
        {
          params
        }
      );
    },
    //问卷样本分析
    getQuestionAnalysisReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/questionnaire/getQuestionAnalysisReport",
        {
          params
        }
      );
    },
    querySaveContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/querySaveContent",
        { params }
      );
    },
    //获取未回复管理列表
    getReplyConditionList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/getReplyConditionList",
        {
          params
        }
      );
    },
    //未回复管理回收详情
    getReplyConditionDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/getReplyConditionDetail",
        {
          params
        }
      );
    },
    //获取历史反馈记录列表
    getSatisfactionList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/satisfaction/list",
        {
          params
        }
      );
    },
    //查询可添加异常信息的患者列表
    getPositivePatientList(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + "/b/Patient/getPositivePatientList", params);
    },
    //获取科室详情
    getSectionDetail(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + '/b/userCenter4B/getSectionDetail?sectionId=' + params.sectionId)
    },

    //满意度调查记录导出
    exportSatisfaction(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/satisfaction/exportSatisfaction",
        {
          params,
          responseType: "blob"
        }
      );
    },
    //随访执行统计
    getFlupPerformStatistics(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flup/queryFlupPerformStatistics",
        {
          params
        }
      );
    },
    //随访执行统计详情
    getFlupPerformStatisticsDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flup/queryFlupPerformStatisticsDetail",
        {
          params
        }
      );
    },
    //查询可添加异常信息的患者列表
    addPositiveWarning(params) {
      return axiosInsance.post(Vue.prototype.$baseURL.ICDMApiUrl + "/b/telemonitor/warning/addPositiveWarning", params);
    },
    //查询随访配置列表
    getFlupConfigList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/config/queryFlupConfigList",
        {
          params
        }
      );
    },
    //上传video返回路径
    upload(param) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/file/upload",
        param
      );
    },
    //删除人群标签规则
    deleteCrowdRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/crowdRule/deleteCrowdRule?id=" +
        params.id
      );
    },
    //查询人群标签规则
    getCrowdRuleList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/crowdRule/getCrowdRuleList",
        { params }
      );
    },

    //保存人群标签规则
    saveCrowdRule(param) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/crowdRule/saveCrowdRule",
        param
      );
    },
    //获取当前用户的归属(全院/科室/个人)
    queryCurrentUserBelong() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/queryCurrentUserBelong"
      );
    },
    //查询知识库内容详情
    GetKnowledgeContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/FlupKnowledge/GetKnowledgeContent",
        {
          params
        }
      );
    },
    //获取短信模板列表
    getTemplateList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ms/getTemplateList",
        { params }
      );
    },
    //新增编辑短信模板
    saveMessageTemplate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ms/create",
        params
      );
    },
    //删除编辑短信模板
    deleteMessageTemplate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/ms/delete/" + params
      );
    },
    //获取短信消息列表
    getMessageRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/msg/getMessageRecordList",
        { params }
      );
    },
    //电话随访更新完成时间
    EditFollowUpTimeReal(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/msg/getMessageRecordList",
        { params }
      );
    },

    //手术患者登记
    saveDate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/emr/operation/saveData",
        params
      );
    },

    //获取评估报告中的风险评估表单ID
    getFormId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/getFormId",
        { params }
      );
    },

    //获取评估报告
    getFormById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/chronic/report/getFormInfoById",
        { params }
      );
    },
    //医院配置初始化
    configInitialize(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/configInitialize?hospitalId=" +
        Vue.prototype.$global.hospital_id
      );
    },
    //获取入院记录列表
    queryEmrAdmissionRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrAdmissionRecordList",
        { params }
      );
    },
    //获取慢病患者入院详情
    queryEmrAdmissionRecordDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/personalRecord/queryEmrAdmissionRecordDetail",
        { params }
      );
    },
    //查询所有随访配置-分组显示
    queryFlupConfigAllByGroup(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/config/queryFlupConfigAllByGroup",
        { params }
      );
    },
    //修改一个随访配置项
    updateFlupConfigOne(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/systemManage/config/updateFlupConfigOne?serialNo=${params.serialNo}&componentValue=${params.componentValue}`
      );
    },
    //呼出语音电话
    voiceFollowUpMakeCall(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/b/voiceFollowUp/makeCall`,
        params
      );
    },
    //通过随访任务主键查询语音通话记录详细内容
    queryVoiceFollowUpRecordBySn(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/voiceFollowUp/queryVoiceFollowUpRecordBySn",
        { params }
      );
    },
    //查询模板是否生成了业务数据
    existBusinessData(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/existBusinessData",
        { params }
      );
    },
    //风险评估模板-是否已生成业务数据 是true不能修改风险模板
    assessmentExistBusinessData(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/config/risk/assessment/existBusinessData",
        { params }
      );
    },
    //保存坐席
    saveAgent(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/callCenter/saveAgent?id=${params.id}&type=${params.type}&name=${params.name}&nodehost=${params.nodehost}&hospitalId=${params.hospitalId}&password=${params.password}&groups=${params.groups}`
      );
    },
    //手术--查询记录列表
    operationGetList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/emr/operation/getList",
        { params }
      );
    },
    //模板入库
    addToQuBaseTemplate(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/baseTemplate/addToQuBaseTemplate",
        params
      );
    },
    //随访任务抽查
    spotCheckPatientPlanRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPatientPlan/spotCheckPatientPlanRecord",
        { params }
      );
    },
    //手动同步获取出院病人数据
    getPatientSysnRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/getPatientSysnRecordList",
        {
          params
        }
      );
    },
    //手动同步
    sysnDisPatData(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/sysnDisPatData",
        {
          params
        }
      );
    },
    //规则入库
    ruleAddQuRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/template/rule/addQuRule?ruleId=" +
        params.ruleId
      );
    },
    //从库导入规则
    ruleImportFuRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/rule/importFuRule",
        params
      );
    },
    //获取规则
    ruleGetQuRule(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/rule/getQuRule",
        {
          params
        }
      );
    },
    //获取规则--节点
    ruleGetQuRuleNode(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/rule/getQuRuleNode",
        {
          params
        }
      );
    },
    //获取规则--节点--path
    ruleGetQuRulePath(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/rule/getQuRulePath",
        {
          params
        }
      );
    },
    //启用、禁用患者类型
    updateStatus(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/patientType/updateStatus?id=${params.id}&enabled=${params.enabled}`
      );
    },
    //获取商城后台url
    getMallBackstageUrl(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/homepage/getMallBackstageUrl",
        {
          params
        }
      );
    },
    //获取控制权限接口， 根据返回的权限节点是否存在判断
    getPermissions(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/user/center/getPermissions",
        {
          params
        }
      );
    },
    //列出审核列表
    queryAuth(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/Auth/queryAuth",
        { params }
      );
    },
    //列出审核记录
    queryAuthLog(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/Auth/queryAuthLog",
        { params }
      );
    },
    //获取组详情
    getFlupGroup(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/manager/group/getFlupGroup",
        { params }
      );
    },
    //审核接口
    authApply(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/Auth/authApply",
        params
      );
    },
    getListEmrHospitalOrder(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/listEmrHospitalOrder",
        { params }
      );
    },
    updateHospitalOrderInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/updateHospitalOrderInfo",
        params
      );
    },

    //照护表保存
    patientNurseRecordSave(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/patientNurseRecord/save",
        params
      );
    },
    //照护表提交
    patientNurseRecordSubmit(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/patientNurseRecord/submit",
        params
      );
    },
    //照护表获取
    getPatientNurseRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/patientNurseRecord/get",
        { params }
      );
    },
    //根据计划id获取患者订单
    listUserFlowByPlanId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/listUserFlowByPlanId",
        { params }
      );
    },
    //服务包售卖统计数据列表
    listPackageOrderStatistics(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/listPackageOrderStatistics",
        { params }
      );
    },
    listAllGroupIncome(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/income/manager/listAllGroupIncome",
        { params }
      );
    },
    getIncomeInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/income/getIncomeInfo",
        { params }
      );
    },
    listGroupIncome(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/income/listGroupIncome",
        { params }
      );
    },
    listGroupMemberIncome(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/income/listGroupMemberIncome",
        { params }
      );
    },
    listGroupPackageIncome(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/income/listGroupPackageIncome",
        { params }
      );
    },
    exportAllGroupIncome(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/income/manager/exportAllGroupIncome",
        { params }
      );
    },
    //导出服务包售卖统计数据列表
    exportPackageOrder(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/exportPackageOrder",
        {
          params,
          responseType: "blob"
        }
      );
    },
    //导出反馈与建议
    exportFeedbackRecords(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/feedback/exportFeedbackRecords",
        {
          params,
          responseType: "blob"
        }
      );
    },
    //消息提醒模板列表
    selectMessage(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/template/selectMessage?name=${params.name}&pageSize=${params.pageSize}&pageIndex=${params.pageIndex}`
      );
    },
    getAudio(url) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          responseType: "blob",
          url
        }).then(res => {
          resolve(URL.createObjectURL(res.data));
        });
      });
    }
  };
};
export default request;
