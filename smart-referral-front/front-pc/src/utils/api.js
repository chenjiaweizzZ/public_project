// 获取环境变量
// const MODE = import.meta.env.MODE;
// 获取baseURL
let baseURL = "";
let ICDMApiUrl = "";

const url = window.location.href;
const hostname = new URL(url).hostname; // 从URL中提取hostname
const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/\S*)?$/;
if (ipRegex.test(hostname)) {
  console.log("ip地址访问");
  baseURL = window.globalURL.IPSRFApiUrl;
  ICDMApiUrl = window.globalURL.IPICDMApiUrl;
} else if (domainRegex.test(hostname)) {
  console.log("域名访问");
  baseURL = window.globalURL.SRFApiUrl;
  ICDMApiUrl = window.globalURL.ICDMApiUrl;
} else {
  console.log("vpn 访问");
  baseURL = window.globalURL.VPNSRFApiUrl;
  ICDMApiUrl = window.globalURL.VPNICDMApiUrl;
}

export const apiUrl = {
  getUserInfo: `${baseURL}/b/base/user/query/current`, // 获取用户星系
  uploadFile: `${baseURL}/file/upload`, // 上传文件接口
  queryClinicReportListExt: `${ICDMApiUrl}/b/personalRecord/queryClinicReportListExt`, // 门诊记录列表
  insertReferralApply: `${baseURL}/b/referral/insertReferralApply`, // 转诊申请保存、提交
  selectReferralApply: `${baseURL}/b/referral/selectReferralApply`, // 查看转诊申请
  queryClinicReportDetail: `${ICDMApiUrl}/b/personalRecord/queryClinicReportDetail`, // 获取门诊详情
  queryEmrAdmissionRecordList: `${ICDMApiUrl}/b/personalRecord/queryEmrAdmissionRecordList`, // 入院记录列表
  queryEmrDischargeRecordList: `${ICDMApiUrl}/b/personalRecord/queryEmrDischargeRecordList`, // 出院记录列表
  queryEmrExamReportList: `${ICDMApiUrl}/b/personalRecord/queryEmrExamReportList`, // 检查记录列表
  queryEmrLabReportList: `${ICDMApiUrl}/b/personalRecord/queryEmrLabReportList`, // 检验记录列表
  getReferralStatisticsList: `${baseURL}/b/referral/statistics/getReferralStatisticsList`, // 转诊统计数据
  exportReferralStatisticsData: `${baseURL}/b/referral/statistics/exportReferralStatisticsData`, // 转诊统计数据导出
  getTransferStatus: `${baseURL}/b/referral/getTransferStatus`, //获取转入转出状态列表
  getHospitalList: `${baseURL}/b/referral/getHospitalList`, //获取转入机构
  getDeptByHospitalId: `${baseURL}/b/referral/getDeptByHospitalId`, //获取转入机构科室(已弃用)
  getCurrentUserDept: `${baseURL}/b/referral/getCurrentUserDept`, //带权限的部门查询
  selectAllDeptByHospital: `${baseURL}/b/referral/selectAllUserCenterDept`, //根据医院id获取所有机构，湘雅医院获取健康管理平台机构，下级医院获取用户中心机构
  selectAllDeptBySourceId: `${baseURL}/b/referral/selectAllUserCenterDept`, // 门诊下转上科室列表
  getDeptByHospitalId: `${baseURL}/b/referral/getDeptByHospitalId`, //获取转入机构科室
  patientList: `${ICDMApiUrl}/b/Patient/getPatientListByKey`, // 患者列表
  patientTypeList: `${ICDMApiUrl}/b/patientType/queryPatientTypeAll`, // 患者列表
  deptList: `${ICDMApiUrl}/b/systemManage/queryCurrentUserDept`, // 科室列表
  selectRecordList: `${baseURL}/b/referral/selectRecordList`, //查询转入转出列表
  getCurrentUserHospital: `${baseURL}/b/referral/getCurrentUserHospital`, //获取当前用户医院
  reviewRecord: `${baseURL}/b/referral/reviewRecord`, //编辑审核记录状态
  doctorList: `${baseURL}/b/his/mz/up/queryLineUpScheduleInfoService`, // 查询可预约挂号排班信息
  admConditionInfo: `${baseURL}/b/his/zy/up/getAdmConditionInfo`, // 获取入院病情字典信息
  getPic: `${baseURL}/file/form/get`, // 获取表单已上传图片
  savePic: `${baseURL}/file/form/save`, // 保存上传成功图片
  deletePic: `${baseURL}/file/form/delete`, // 删除上传成功图片
  getPermitMenuUrl: `${ICDMApiUrl}/b/user/center/GetPermitMenuUrl`, //获取权限路由
  pushOperateLogs: `${ICDMApiUrl}/b/user/center/pushOperateLogs`, //获取权限路由
  getPatientInfoByUserId: `${ICDMApiUrl}/b/Patient/b/getPatientInfoByUserId`,
  getPatientInfoListByUserList: `${ICDMApiUrl}/b/Patient/b/getPatientInfoListByUserList`,
};
