import axios from "axios";
import { axiosInsance } from "./index";

if (localStorage.getItem("openId")) {
  axios.defaults.headers.common["openId"] = localStorage.getItem("openId");
}

let plugin = {};
plugin.install = function (Vue, option) {
  Vue.prototype.$get = axiosInsance.get;
  Vue.prototype.$post = axiosInsance.post;
  Vue.prototype.$request = axiosInsance.request;
  Vue.prototype.$http = axios;

  //封装接口
  Vue.prototype.$apis = {
    //获取绑定用户信息绑定
    getBindUserInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.FollowUpApiUrl +
        "/api/WeChat/GetWeChatBindingByOpenId",
        {
          params,
        }
      );
    },

    //绑定用户
    register(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.FollowUpApiUrl + "/api/WeChat/AddWeChatBinding",
        params
      );
    },
    //添加信息
    addInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.FollowUpApiUrl +
        "/api/WeChat/UpdateWeChatBinding",
        params
      );
    },

    //获取随访任务列表
    getFullowupTaskList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.FollowUpApiUrl +
        "/api/FlupSmart/GetFollowUpTaskByUserId",
        {
          params,
        }
      );
    },

    //获取检查项目列表
    getCheckList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.FollowUpApiUrl +
        "/api/FlupPlan/GetFuFlupPatientPlanBySn",
        {
          params,
        }
      );
    },

    //审核通过
    verify(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.FollowUpApiUrl +
        "/api/FlupPlan/ChangePatientPlanAuthState",
        params
      );
    },
    getOpenId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.FollowUpApiUrl + "/api/WeChat/GetOpenId",
        { params }
      );
    },
    getSaveContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.QuestionnaireApiUrl +
        "/api/Template/GetSaveContent",
        {
          params,
        }
      );
    },
    saveContent(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.QuestionnaireApiUrl +
        "/api/Template/SaveTemplateContent",
        params
      );
    },
    baseCallApi(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.BasePlatformApiUrl + "/api/Base/CallApi",
        params
      );
    },
    getFolloupType(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.FollowUpApiUrl + "/api/FlupType/GetTypeRecord",
        {
          params: {
            keyWord: "",
            pageIndex: 1,
            pageSize: 20,
            hospital_id: JSON.parse(sessionStorage.getItem("user")).hospital_id,
          },
        }
      );
    },
    templatequerySaveContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/template/querySaveContent",
        { params }
      );
    },
    templatesaveTemplateContent(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/template/saveTemplateContent",
        params
      );
    },

    //新的接口
    //根据code获取openID
    getOpenIdByCode(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/wechat/getOpenIdByCode",
        { params }
      );
    },
    getAllHospitals(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/SystemManage/hospital/getAllHospitals",
        {
          params,
        }
      );
    },
    //验证身份手机号是否绑定
    getCheckPatientPhone(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/plat/patient/checkPatientPhone",
        {
          params,
        }
      );
    },
    //获取短信验证码
    getSendVerifyCode(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/userCenter4B/sendVerifyCode",
        params
      );
    },
    //获取图形验证码
    getCaptcha(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/userCenter4B/getCaptcha",
        params
      );
    },
    //绑定用户
    savePatientInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/wechat/savePatientInfo",
        params
      );
    },
    //修改用户信息
    editPatientInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/Patient/editPatientInfo",
        params
      );
    },
    //绑定用户老接口
    savePatientInfoOld(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/wechat/savePatientInfoOld",
        params
      );
    },
    //获取绑定用户信息绑定
    getPatientInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/wechat/getPatientInfo`,
        { params }
      );
    },
    //获取用药指导等， 生效历史查询
    queryHistory(patientId, typeName, hospitalId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flup/patient/items/queryHistory?patientId=${patientId}&typeName=${typeName}&hospitalId=${hospitalId}`
      );
    },
    //用药指导等 当前内容查询
    query(patientId, typeName) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flup/patient/items/query?patientId=${patientId}&typeName=${typeName}&hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}`
      );
    },
    queryInfo(id, typeName) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flup/patient/items/queryInfo?id=${id}&typeName=${typeName}`
      );
    },

    //获取当前患者的随访计划
    current() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flupPatientPlan/patient/current?hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}`
      );
    },
    //查询病例报告
    reportQuery(userId, hospitalId, planId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/chronic/report/query?userId=${userId}&hospitalId=${hospitalId}&planId=${planId}`
      );
    },
    //获取图片缩略图
    thumbnail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/file/thumbnail/${params}`
      );
    },
    //获取患者提交报告
    reportQuery(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/patient/report/query`,
        { params }
      );
    },
    //患者提交报告接口
    submit(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/patient/report/submit`,
        params
      );
    },
    //患者提交报告接口 V2
    uploadReport(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/patient/report/uploadReport`,
        params
      );
    },
    //患者查看宣教列表
    queryQuestionnaireList(planId, userId, hospitalId, startDate, endDate) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/template/queryQuestionnaireList?planId=${planId}&userId=${userId}&hospitalId=${hospitalId}&startDate=${startDate}&endDate=${endDate}`
      );
    },
    //获取随访计划
    getPlanList(patientId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flupPatientPlan/patient/current?patientId=${patientId}&hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}`
      );
    },
    //患者评估报告记录
    getEvalList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flupPatientPlan/getFlupPlanListByPatient`,
        {
          params,
        }
      );
    },
    //患者评估报告记录
    getReportList(userId, hospitalId, startDate, endDate) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/chronic/report/list?userId=${userId}&hospitalId=${hospitalId}&startDate=&endDate=`
      );
    },
    //获取慢病报告详情
    getEvalQuery(userId, hospitalId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/chronic/report/query?userId=${userId}&hospitalId=${hospitalId}`
      );
    },
    //患者健康监测列表
    queryTelemonitorDataByUserIdList(userId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/telemonitor/queryTelemonitorDataByUserId?userId=${userId}&range=bloodPressure%7Cspo2%7CbloodSugar%7Ctemperature%7Cheight%7Cweight%7Cbmi%7CwaistLine%7CboneDensity&scope=0`
      );
    },
    //患者健康监测列表
    queryOne(userId, type) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/telemonitor/queryTelemonitorDataByUserId?userId=${userId}&scope=0&range=${type}`
      );
    },
    //患者提交报告接口
    saveHealth(type, params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/telemonitor/${type}`,
        params
      );
    },
    //获取医生的聊天信息列表(多个患者)
    chatqueryByPatient(userId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/doctor/patient/chat/queryByPatient?hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}&patientId=${userId}`
      );
    },
    //是否有新消息 -- 患者端使用
    messagenew() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/doctor/patient/chat/message/new?hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}`
      );
    },
    //获取医生和患者的聊天记录
    chatqueryChatDoctor(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/doctor/patient/chat/queryChat`,
        { params }
      );
    },
    //更新聊天消息状态
    updateReadStatus(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/doctor/patient/chat/updateReadStatus`,
        params
      );
    },
    //获取服务包列表
    getAllPackageList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/sign/getAllPackageList`
      );
    },
    //获取服务包签约医生列表
    getDoctorByPackageId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/sign/getDoctorByPackageId`,
        { params }
      );
    },
    //个人签约记录详情
    getSignDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/sign/getSignDetail`,
        { params }
      );
    },
    //个人签约记录详情
    getSignList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/sign/getSignList`
      );
    },
    //确认支付
    saveSign(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/sign/saveSign`,
        params
      );
    },
    //患者随访计划详情
    getPatientPlanDetail() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `c/flupPatientPlan/doctor/getPatientPlanDetail`
      );
    },
    //查询监测指标列表数据
    parameterQuery() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/health/parameter/query`
      );
    },
    //医护端接口-----------------------------------------------------------
    //查询医生绑定信息
    DoctorgetDoctorInfo() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getDoctorInfo"
      );
    },
    //医护端医生绑定
    doctorsaveDoctorBinding(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/saveDoctorBinding",
        params
      );
    },
    //查询所有医院列表
    DoctorgetAllHospitals() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/SystemManage/hospital/getAllHospitals"
      );
    },
    //获取医生的聊天信息列表(多个患者)
    chatqueryByDoctor(userId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/patient/chat/queryByDoctor?hospitalId=" +
        sessionStorage.getItem("hospitalId") +
        "&userId=" +
        userId
      );
    },
    //获取医生和患者的聊天记录)
    chatqueryChat(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/patient/chat/queryChat",
        { params }
      );
    },
    //发送消息
    chatsend(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/patient/chat/send",
        params
      );
    },
    // //更新聊天消息状态
    // chatupdateReadStatus(params) {
    //   return axiosInsance.post(
    //     Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/patient/chat/updateReadStatus",
    //     params
    //   );
    // },
    //当前随访待处理
    getUnFollowupList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getUnFollowupList"
      );
    },
    //所有随访计划
    getAllFlupPlanList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getAllFlupPlanList"
      );
    },
    //我的关注患者
    getAttentionList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getAttentionList",
        { params }
      );
    },
    //用户下绑定的设备列表
    bindingDevices(userId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/device/binding/queryBindDevices?userId=" + userId
      );
    },
    //就诊记录
    ClinicRecordTotalList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/patient/clinicRecordTotalList",
        { params }
      );
    },
    //查询设备类型
    GetDictsByDictCode() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/device/binding/queryDevicesTypeList?dictCode=device_type"
      );
    },
    //关注患者
    attentionPatientPlan(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/attentionPatientPlan?userId=" +
        params.userId +
        "&planId=" +
        params.planId
      );
    },
    //审核单作废
    cancelAudit(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/cancelAudit?serialNo=" +
        // ?flupType=" +
        // params.flupType +
        // "&userId=" +
        // params.userId +
        // "&recordSerialNo=" +
        // params.recordSerialNo,
        params.serialNo
      );
    },
    //审核通过
    saveAudit(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/saveAudit?serialNo=" +
        params.serialNo
      );
    },
    //提交问卷
    saveTemplateContent(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/saveTemplateContent",
        params
      );
    },
    //取消关注
    unAttentionPatientPlan(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/unAttentionPatientPlan?userId=" +
        params.userId +
        "&planId=" +
        params.planId
      );
    },
    //查看问卷宣教内容
    querySaveContent(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/querySaveContent?serialNo=" +
        params
      );
    },
    //慢病计划全部患者
    getAllPatientIcdmList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getAllPatientIcdmList",
        { params }
      );
    },
    //随访计划全部患者
    getAllPatientPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getAllPatientPlanList",
        { params }
      );
    },
    //审核列表
    getAuditListByFlupType(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getAuditListByFlupType",
        { params }
      );
    },
    //我的待审核
    getCurrentUnAuditList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getCurrentUnAuditList",
        { params }
      );
    },
    //我的随访计划
    getFlupPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getFlupPlanList",
        { params }
      );
    },
    //患者随访计划
    getFollowUpPlanByPatient(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/getFollowUpPlanByPatient",
        {
          params,
        }
      );
    },
    //我的慢病计划
    getIcdmListByDoctor() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getIcdmListByDoctor"
      );
    },
    //随访计划各状态统计
    getPatientPlanStatistics() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getPatientPlanStatistics"
      );
    },
    //患者随访计划详情
    getSaveContent() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getSaveContent"
      );
    },
    //获取慢病患者健康监测数据
    queryTelemonitorDataByUserId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/doctor/queryTelemonitorDataByUserId",
        {
          params,
        }
      );
    },
    //随访计划重发
    reSendFlupPlanTask(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/reSendFlupPlanTask",
        { params }
      );
    },
    //全部随访类型
    queryAllFollowType() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/queryAllFollowType"
      );
    },
    //患者随访计划详情
    getPatientPlanDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getPatientPlanDetail",
        { params }
      );
    },
    //绑定设备
    binding(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/device/binding/binding",
        params
      );
    },
    //解除绑定
    deleteBinding(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/device/binding/deleteBinding",
        params
      );
    },
    //获取检查检验单
    getExamList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/ExamReport/getExamList",
        { params }
      );
    },
    //根据检查单获取详情
    getEmrExamReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/ExamReport/getEmrExamReport",
        { params }
      );
    },
    //根据检验单获取详情
    getEmrLabReport(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/ExamReport/getEmrLabReport",
        { params }
      );
    },
    //慢病报告内容
    getReportAudit(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getReportAudit",
        { params }
      );
    },
    //统计就诊人注册
    bindAndRegistration(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/usercenter/bindAndRegistration4C",
        {
          params,
        }
      );
    },
    //统一就诊人openId登录
    loginWithOpenId4C(params, hospitalId = "") {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/usercenter/loginWithOpenId4C",
        {
          params: {
            ...params,
            hospitalId: hospitalId
              ? hospitalId
              : sessionStorage.getItem("hospitalId"),
          },
        }
      );
    },
    //更新绑定患者信息
    updatePatientInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/unip/updatePatientInfo",
        { params }
      );
    },
    //获取慢病配置
    dgetOpenId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getOpenId",
        { params }
      );
    },
    //随访计划--我的患者
    getMyPatientPlanList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getMyPatientPlanList",
        { params }
      );
    },
    //获取pc端配置项
    getParametersByParameterTypeId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/Parameter/selectParametersByParameterTypeId?hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}`,
        {
          params,
        }
      );
    },
    //获取pc端配置项医生端
    getParametersByParameterTypeIds(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/d/Parameter/selectParametersByParameterTypeId?hospitalId=${sessionStorage.getItem(
          "hospitalId"
        )}`,
        {
          params,
        }
      );
    },
    //问卷合并
    queryMergeSaveContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/template/queryMergeSaveContent?serialNo=" +
        params
      );
    },

    getEmrPatientBaseInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrPatientBaseInfo",
        {
          params: {
            ...params,
            hospitalId: sessionStorage.getItem("hospitalId"),
          },
        }
      );
    },
    getEmrDischargeRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrDischargeRecordList",
        {
          params: {
            ...params,
            hospitalId: sessionStorage.getItem("hospitalId"),
          },
        }
      );
    },
    getEmrDischargeRecordDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrDischargeRecordDetail",
        {
          params: {
            ...params,
          },
        }
      );
    },
    //健康档案-检查记录接口
    getEmrExamReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrExamReportList",
        {
          params: {
            ...params,
            hospitalId: sessionStorage.getItem("hospitalId"),
          },
        }
      );
    },
    //健康档案-检验记录接口
    getEmrEmrLabReportList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrLabReportList",
        {
          params: {
            ...params,
            hospitalId: sessionStorage.getItem("hospitalId"),
          },
        }
      );
    },
    //健康档案-检查记录详情接口
    getEmrExamReportDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrExamReportDetail",
        {
          params: {
            ...params,
          },
        }
      );
    },
    //健康档案-检验记录详情接口
    getEmrEmrLabReportDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryEmrLabReportDetail",
        {
          params: {
            ...params,
          },
        }
      );
    },
    //健康档案-门诊记录接口
    getClinicReportListExt(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/queryClinicReportListExt",
        {
          params: {
            ...params,
            hospitalId: sessionStorage.getItem("hospitalId"),
          },
        }
      );
    },
    //健康档案-签约记录接口
    getSignRecordList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/personalRecord/getSignRecordList",
        {
          params: {
            ...params,
          },
        }
      );
    },
    //获取患者提交报告
    patientReportQuery(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/patient/report/patientQuery`,
        {
          params,
        }
      );
    },
    //获取处方药品详情
    getPrescriptionDrugByPlanSerialNo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/prescription/getPrescriptionDrugByPlanSerialNo`,
        {
          params,
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
    //根据就诊人code取就诊人信息
    getSelectedPatient(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/unip/getSelectedPatient",
        { params }
      );
    },
    //获取一体化预约检查检验接口
    getPatientCheckItemList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/appointment/getPatientCheckItemList",
        {
          params,
        }
      );
    },
    //查看预约申请状态
    getAppointmentApplyStatus(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/appointment/getAppointmentApplyStatus",
        {
          params,
        }
      );
    },
    //发送检查预约申请
    sendAppointmentApply(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/appointment/sendAppointmentApply?hospitalId=" +
        sessionStorage.getItem("hospitalId"),
        {
          params,
        }
      );
    },
    //获取医生和患者的聊天记录的宣教url
    queryChatUrl(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/doctor/patient/chat/queryChatUrl",
        {
          params,
        }
      );
    },
    //查询一个随访配置项
    queryFlupConfigOne(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/config/queryFlupConfigOne",
        {
          params,
        }
      );
    },
    //查询患者可订阅的计划及状态
    getSubscribePlanList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/subscribe/getSubscribePlanList"
      );
    },
    //患者订阅计划
    subscribe(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/subscribe/subscribe",
        { params }
      );
    },
    //患者取消订阅计划
    cancelSubscribe(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/subscribe/cancelSubscribe",
        { params }
      );
    },
    //查询随访配置列表
    getFlupConfigList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/systemManage/config/queryFlupConfigList",
        {
          params,
        }
      );
    },
    // token查询医生绑定信息
    getDoctorInfoByToken(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/d/doctor/getDoctorInfoByToken",
        {
          params,
        }
      );
    },
    // 医护端查询字典
    queryDictByCode(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/d/SystemManage/BaseDict/queryDictByCode",
        {
          params,
        }
      );
    },
    //查询参数字典
    selectParameterByKeyNoCache(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/c/Parameter/selectParameterByKeyNoCache",
        {
          params,
        }
      );
    },
    getHealthCheckRecord(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/c/tijian/geRecord",
        {
          params,
        }
      );
    },
    //获取就诊人列表
    getPatientList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/patient/list`,
        { params }
      );
    },
    //根据身份证号码获取就诊人手机号码
    getPatientPhone(idNo) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/patient/getPatientPhone?idNo=${idNo}`,
      );
    },
    //获取就诊人信息
    getInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/patient/get`,
        { params }
      );
    },
    //绑定就诊人列表
    saveBindPatient(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/patient/saveBind`,
        params
      );
    },
    //更换默认就诊人
    changeDefaultPatient(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/patient/changeDefaultPatient`,
        params
      );
    },
    //解绑就诊人
    unbindPatient(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/patient/unbind?userId=${params.userId}`
      );
    },
    //获取知识库tab
    getDictItems(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/SystemManage/BaseDict/GetDictItems`,
        { params }
      );
    },
    //知识库查询
    getKnowledgeRecord(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/FlupKnowledge/GetKnowledgeRecord`,
        params
      );
    },
    //知识库详情
    getKnowledgeContent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/FlupKnowledge/GetKnowledgeContent`,
        { params }
      );
    },
    //随访任务
    getFlupPlanListByCurrent(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flupPatientPlan/patient/getFlupPlanListByCurrent`,
        { params }
      );
    },
    //三天随访任务
    getRecent3DaysPlanTaskList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/flupPatientPlan/patient/getRecent3DaysPlanTaskList`,
        { params }
      );
    },
    //服务包分类接口
    getAllPackageClassList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/getAllPackageClassList`,
        { params }
      );
    },
    selectPackageDoctorsByDept(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/selectPackageDoctorsByDept`,
        { params }
      );
    },
    //服务包列表信息接口
    getListPackageInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/listPackageInfo`,
        { params }
      );
    },
    //首页团队
    getHomeDoctorTeamList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/getHomeDoctorTeamList`,
        { params }
      );
    },
    //服务包详情
    getPackageInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/getPackageInfo`,
        { params }
      );
    },
    //获取重点职称医生
    getAppointDoctorInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/getAppointDoctorInfo`,
        { params }
      );
    },
    //获取重点职称医生详情
    getAppointDoctorGroupDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/getAppointDoctorGroupDetail`,
        { params }
      );
    },
    //获取团队详情
    getAppointGroupDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatPackageInfo4C/getAppointGroupDetail`,
        { params }
      );
    },
    //支付订单保存字符信息
    createOrders(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/createOrders`,
        params
      );
    },
    //批量支付订单
    createOrderBatch(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/createOrderBatch`,
        params
      );
    },
    //订单详情
    getOrderInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/package/order/get`,
        { params }
      );
    },
    //获取批量订单详情
    getBatchPlayListInfo(outTradeNo) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/shoppingCart/getBatchPayListInfo?outTradeNo=${outTradeNo}`,
      );
    },
    //获取订单列表
    getOrderList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/package/order/list`,
        { params }
      );
    },
    //更新订单状态
    updateOrderStatus(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/updateStatus`,
        params
      );
    },
    //绑定企业微信userid
    bindCpUser(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/patient/bindCpUser?cpExternalUserId=${params.userId}`
      );
    },
    //添加修改收货地址
    saveOrEditReceivingInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatUserAddress/saveOrEditReceivingInfo`,
        params
      );
    },
    //获取地址列表
    selectReceiptList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatUserAddress/selectReceiptList`,
        { params }
      );
    },
    //获取地址列表
    deleteAddress(params) {
      return axiosInsance.delete(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/PlatUserAddress/deleteAddress?addressId=${params.addressId}`
      );
    },
    //发起，取消退款
    refundDeal(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/plat/package/order/refundDeal`,
        params
      );
    },
    //获取物流公司
    getFastMail() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/SystemManage/BaseDict/GetDictItems?parentId=20230816000000000002`
      );
    },
    //修改退款物流信息
    updateRefundInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/updateRefundInfo`,
        params
      );
    },
    //快递查询接口
    selectLogisticsInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/selectLogisticsInfo`,
        { params }
      );
    },
    //开发票
    issueInvoices(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/issueInvoices`,
        params
      );
    },
    //查询患者未读消息数
    homeConsultUnreadMessages(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/homeConsultUnreadMessages`,
        { params }
      );
    },
    //首页咨询列表查询
    homeConsultList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/plat/package/order/homeConsultList`,
        { params }
      );
    },
    //获取签名信息
    getWxConfigParam(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/wechat/createJsapiSignature`,
        { params }
      );
    },
    selectConsultGraphicDetail(orderSerialNo) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/selectConsultGraphicDetail?orderSerialNo=${orderSerialNo}`
      );
    },
    endGraphicConsultation(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/endGraphicConsultation?consultId=${params.consultId}`
      );
    },
    //撤回
    recallMsg(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/recallMsg?roomId=${params.roomId}&msgSeqList=${params.msgSeqList}`
      );
    },
    initiateGraphicConsultation(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/initiateGraphicConsultation`,
        params
      );
    },
    //获取im信息
    initiateChat(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/initiateChat?orderSerialNo=${params.orderSerialNo}&hospitalId=${params.hospitalId}`
      );
    },
    //获取新的imUrl
    getIMData(patientId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/getIMData?patientId=${patientId}`
      );
    },
    //服务包关闭ai机器人
    changeAiStatus(consultId) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/changeAiStatus?consultId=${consultId}`,
      );
    },
    //售前关闭ai机器人
    changePreAiStatus(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/changePreAiStatus`,
        params
      );
    },
    //发消息的回调
    sendMessageCallback(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/sendMessageCallback`,
        params
      );
    },
    //发消息的回调
    personalSendMessageCallback(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/personalSendMessageCallback`,
        params
      );
    },
    sendGraphicMessageCallback(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/sendGraphicMessageCallback`,
        params
      );
    },
    //售前已读
    personalReadMessageCallback(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/personalReadMessageCallback`,
        { params }
      );
    },
    //已读消息
    readMessageCallback(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/readMessageCallback?consultId=${params.consultId}`
      );
    },
    //获取已完成的订单信息
    getHistoryQuery(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/getHistoryQuery`,
        { params }
      );
    },
    //判断是否处于转诊
    getConsultDetailsById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/getConsultDetailsById`,
        { params }
      );
    },
    //售前Ai
    getPersonalConsultDetailsById(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/getPersonalConsultDetailsById`,
        { params }
      );
    },
    //结束咨询
    endConsultation(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/endConsultation?consultId=${params.consultId}`
      );
    },
    //查询群组成员
    selectGroupUserInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/selectGroupUserInfoList`,
        { params }
      );
    },
    //查询图文咨询群组成员
    selectGraphicGroupUserInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/selectGraphicGroupUserInfoList`,
        { params }
      );
    },
    //查询售前群组成员
    selectPersonalGroupUserInfoList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/selectPersonalGroupUserInfoList`,
        { params }
      );
    },
    //科室
    selectAllPackageDept(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/selectAllPackageDept`,
        { params }
      );
    },
    //组
    getFlupGroupList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/getFlupGroupList`,
        { params }
      );
    },
    //售前查询接口
    preSalesConsultation(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/preSalesConsultation`,
        { params }
      );
    },
    //获取问卷信息
    sendConsultTemplateHome(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/c/instantMessaging/sendConsultTemplateHome`,
        params
      );
    },
    queryTemplateContent(params, headers) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/b/template/queryTemplateContent`,
        { params, headers }
      );
    },
    addFeedback(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/feedback/add`,
        params
      );
    },
    getFeedbackList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/feedback/list`,
      );
    },
    getSatisfaction(recordId) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/satisfaction/${recordId}`,
      );
    },
    submitSatisfaction(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/satisfaction/submit`,
        params
      );
    },
    getLastFeedbackList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/feedback/getLastRecord`,
      );
    },
    getFeedbackDetail(recordId) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/feedback/detail/${recordId}`,
      );
    },
    getImageInfo(id) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/file/image/${id}`,
      );
    },
    shoppingCartSave(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/shoppingCart/save`,
        params
      );
    },
    shoppingCartList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/shoppingCart/list`,
      );
    },
    shoppingCartUpdateSpec(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/shoppingCart/updateSpec`,
        params
      );
    },
    shoppingCartUpdateBuyNumber(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/shoppingCart/updateBuyNumber`,
        params
      );
    },
    shoppingCartdelete(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + `/c/shoppingCart/delete`,
        params
      );
    },
    //获取互联网医院开单信息
    diagnoseDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + `/order/details`,
        { params }
      );
    },
  };
};
export default plugin;
