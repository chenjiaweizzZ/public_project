/**
 * @description api 接口地址统一管理
 * @author 刘晨明
 */
let cisBaseUrl = window.globalURL.cisBaseUrl;
let bisBaseUrl = window.globalURL.bisBaseUrl;

// 保存所有的接口地址
const apiUrl = {
  login: `${bisBaseUrl}/WXSuite/CorpAppIndex/jkglcs`, // 登入页面
  // GetJsConfigInfo: `${cisBaseUrl}/DjWorkWx/GetJsConfigInfo`,
  GetDictItems: `${cisBaseUrl}/b/SystemManage/BaseDict/GetDictItems`, // 获取企业微信配置信息
  patientList: `${cisBaseUrl}/b/plat/patient/list`,
  GetListForCp: `${cisBaseUrl}/b/plat/patient/listForCp`, // 获取患者列表
  uploadImg: `${cisBaseUrl}/b/plat/patient/uploadImg`, // 上企业微信文件
  sendCpMsg: `${cisBaseUrl}/b/plat/patient/sendCpMsg`, // 推送消息
  getUserInfo: `${bisBaseUrl}/api/DjUser/GetUserInfo`, // 获取用户信息
  GetJsConfigInfo: `${bisBaseUrl}/api/DjWorkWx/GetJsConfigInfo`, // 获取企业微信配置信息
  getFlupPatientPlusPlan: `${cisBaseUrl}/b/phoneFlup/getFlupPatientPlusPlan`, //任务列表
  queryFlupConfigAllByGroup: `${cisBaseUrl}/b/systemManage/config/queryFlupConfigAllByGroup`, //任务列表
  ChangePatientPlanAuthState: `${cisBaseUrl}/b/flupPatientPlan/ChangePatientPlanAuthState`, //任务提交、作废
  getPrescriptionDrugByPlanSerialNo: `${cisBaseUrl}/c/prescription/getPrescriptionDrugByPlanSerialNo`, //获取处方药详情
  queryFlupConfigOne: `${cisBaseUrl}/b/systemManage/config/queryFlupConfigOne`, //查询一个随访配置项
  getPatientCheckItemList: `${cisBaseUrl}/b/appointment/getPatientCheckItemList`, //获取一体化预约检查检验接口
  getDiseaseReport: `${cisBaseUrl}/b/chronic/report/query`, //获取慢病评估报告
  getFormById: `${cisBaseUrl}/b/chronic/report/getFormInfoById`, //获取评估报告
  reportAuditQueryById: `${cisBaseUrl}/b/reportAudit/queryById`, //随访任务慢病报告----固定数据版
  templatequeryTemplateContent: `${cisBaseUrl}/b/template/queryTemplateContent`, //查询模板详情
  getTelSaveContent: `${cisBaseUrl}/b/phoneFlup/querySaveContent`, // 获取电话宣教或问卷内容
  ExaminegetCheckTypeList: `${cisBaseUrl}/b/System/Examine/getCheckTypeList`, //获取检查类型
  ExaminegetCheckPartsList: `${cisBaseUrl}/b/System/Examine/getCheckPartsList`, //获取检查部位
  ExaminegetCheckItemList: `${cisBaseUrl}/b/System/Examine/getCheckItemList`, //获取检查项目
  ExaminegetExamineList: `${cisBaseUrl}/b/System/Examine/getExamineList`, //获取检验列表
  ExaminegetSampleList: `${cisBaseUrl}/b/System/Examine/getSampleList`, // //获取检验样本类型
  savePhoneFlupRecord: `${cisBaseUrl}/b/phoneFlup/savePhoneFlupRecord`, // //获取检验样本类型
  getPatientInfo: `${cisBaseUrl}/b/wechat/medicalCare/PatientInfo`, // 获取患者信息
  getDictItems: `${cisBaseUrl}/b/SystemManage/BaseDict/GetDictItems`, // 获取标签
  getFollowUpPlan: `${cisBaseUrl}/b/flupPatientPlan/getFollowUpPlanByPatientV2`, // 获取标签
  getFlupGroupByUserId: `${cisBaseUrl}/b/manager/group/getFlupGroupByUserId`, // 获取标签
  currentByAuth: `${cisBaseUrl}/b/flupPatientPlan/flupPatientPlan/patient/currentByAuth`, // 获取标签
  flupPatientPlan: `${cisBaseUrl}/c/flupPatientPlan/patient/current`, // 获取标签
  getFollowupTypeList: `${cisBaseUrl}/b/flupType/queryFollowTypeList`, // 获取标签
  BaseDictGetDictItems: `${cisBaseUrl}/b/SystemManage/BaseDict/GetDictItems`, // 获取标签
  getFlupPlanBelongHospital: `${cisBaseUrl}/b/wechat/medicalCare/getFlupPlanBelongHospital`, // 患者信息获取医院
  getFlupPlanByPatientByTeacher: `${cisBaseUrl}/b/wechat/medicalCare/getFlupPlanByPatientByTeacher`, // 患者信息获取计划
  queryFollowUpContent: `${cisBaseUrl}/b/flupPath/queryFollowUpContent`, // 查询随访内容列表
  queryCurrentUserDept: `${cisBaseUrl}/b/systemManage/queryCurrentUserDept`, //获取当前用户的执行科室
  getCheckTypeList: `${cisBaseUrl}/b/System/Examine/getCheckTypeList`, //获取检查类型
  queryJoinPlanPatientTypeById: `${cisBaseUrl}/b/flupPlan/queryJoinPlanPatientTypeById`, //获取检查类型
  getPatientInfoBySerialNo: `${cisBaseUrl}/b/Patient/getPatientInfoBySerialNo`, //获取检查类型
  addTemporaryFollowUpTask: `${cisBaseUrl}/b/PatientManage/addTemporaryFollowUpTask`, //获取检查类型
  savePhoneFlupRecord: `${cisBaseUrl}/b/phoneFlup/savePhoneFlupRecord`, // //提交
  saveSendCheckContent: `${cisBaseUrl}/b/flupPatientPlan/saveSendCheckContent`, // 保存更新检查检验项目
  flupPathsaveFlupPath: `${cisBaseUrl}/b/flupPath/saveFlupPath`, //保存随访规则常规路径
  flupPathdelFlupPath: `${cisBaseUrl}/b/flupPath/delFlupPath`, //删除随访规则常规路径
  reportpushAndSend: `${cisBaseUrl}/b/chronic/report/pushAndSend`, //发送慢病报告
};

export default apiUrl;
