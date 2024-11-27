import {
  api,
} from "./netUtils.js"

export const PAGE_COUNT = 10;

//获取图形验证码
export const getValidate = data => new api('/userCenter4B/getCaptcha').body(data).post().exec()
//发送短信验证码
export const sendVerifyCode = data => new api('/userCenter4B/sendVerifyCode').body(data).post().exec()
//短信验证码登录
export const loginByMsg = data => new api('/wechat/bindingThirdPartyAccount').body(data).post().exec()
/**
 * 微信授权登录
 */
export const wechatLogin = data => new api("/wechat/applet/login").query(data).get().exec()
export const wechatBinding = data => new api("/wechat/wechatBinding").body(data).post().exec(null, true)
export const refreshSessionKey = data => new api("/wechat/refreshSessionKey").query(data).get().exec()
//注销登录
export const logout = data => new api("/userCenter4B/logout").query().get().exec()

//获取用户信息
export const getDoctorUserInfo = data => new api("/userCenter4B/getDoctorUserInfo").query(data).get().exec()
// 获取IMURL信息
export const getIMData = data => new api("/b/instantMessaging/getIMData").query().get().hideLoading().exec()


/////////////////////////////////////////////////健康管理相关///////////////////////////////////////////////////////
//随访计划
export const getFlupPlanPatientList = data => new api("/b/PatientManage/getFlupPlanPatientListV2").flup().body(data).post().exec()
//患者基本信息
export const getPatientInfo = data => new api("/b/personalRecord/queryEmrPatientBaseInfo").flup().query(data).get().exec()
//随访计划列表
export const getFlupPlanListByCurrent = data => new api("/c/flupPatientPlan/patient/getFlupPlanListByCurrent").flup().query(data).get().exec()
//门诊记录
export const clinicReportList = data => new api("/b/personalRecord/queryClinicReportListExt").flup().query(data).get().exec()
//门诊记录详情
export const clinicRecordDetail = data => new api("/b/personalRecord/queryClinicReportDetail").flup().query(data).get().exec()
//检查记录
export const examReportList = data => new api("/b/personalRecord/queryEmrExamReportList").flup().query(data).get().exec()
//检验记录
export const labReportList = data => new api("/b/personalRecord/queryEmrLabReportList").flup().query(data).get().exec()
//检验记录详情
export const labReportDetail = data => new api("/b/personalRecord/queryEmrLabReportDetail").flup().query(data).get().exec()
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//咨询记录
export const consultRecord = data => new api("/b/instantMessaging/selectConsultResultList").flup().query(data).get().exec()
//订单信息
export const consultOrder = data => new api("/b/instantMessaging/selectConsultOrderList").flup().query(data).get().exec()
//健康监测
export const selectGraphicGroupUserInfoList = data => new api("/b/instantMessaging/selectGraphicGroupUserInfoList").flup().query(data).get().exec()
export const queryFlupConfigList = data => new api("/b/systemManage/config/queryFlupConfigList").flup().query(data).get().exec()
//健康监测数据
export const queryTelemonitorDataByUserId = data => new api("/b/telemonitor/queryTelemonitorDataByUserId").flup().query(data).get().exec()
//获取某患者计划列表
export const queryPlanByPatient = data => new api("/b/flupPlan/queryPlanByPatient").flup().query(data).get().exec()
//根据任务类型获取内容
export const queryFollowUpContent = data => new api("/b/flupPath/queryFollowUpContent").flup().query(data).get().exec()
//增加计划
export const addTemporaryFollowUpTask = data => new api("/b/PatientManage/addTemporaryFollowUpTask/withSendMsg").flup().body(data).post().exec()


/////////////////////////////////////////////////服务列表相关接口///////////////////////////////////////////////////////
export const selectPersonalConsultCount = data => new api("/b/instantMessaging/selectPersonalConsultCount").flup().body(data).hideLoading().post().exec()
export const selectIncompleteCount = data => new api("/b/plat/package/order/selectIncompleteCount").flup().body(data).hideLoading().post().exec()

export const selectCompletedList = data => new api("/b/plat/package/order/selectCompletedList").flup().body(data).hideLoading().post().exec()
export const selectIncompleteList = data => new api("/b/plat/package/order/selectIncompleteList").flup().body(data).hideLoading().post().exec()
// 获取服务中房间详情
export const consultDetailsById = data => new api("/b/instantMessaging/getConsultDetailsById").flup().query(data).hideLoading().get().exec()
// 获取售前咨询房间详情
export const personalConsultDetailsById = data => new api("/b/instantMessaging/getPersonalConsultDetailsById").flup().query(data).hideLoading().get().exec()
// 获取群组成员1
export const selectGroupUserInfoList = data => new api("/b/instantMessaging/selectGroupUserInfoList").flup().query(data).hideLoading().get().exec()
export const readMessageCallback = data => new api("/b/instantMessaging/readMessageCallback").flup().query(data).hideLoading().post().exec()
// 添加医生
export const selectDockerListByDept = data => new api("/b/plat/package/order/selectDockerListByDept").flup().query(data).hideLoading().get().exec()
// 转诊
export const referral = data => new api("/b/instantMessaging/referral").flup().query(data).post().exec()
export const endConsultationAndReferral = data => new api("/b/instantMessaging/endConsultationAndReferral").flup().query(data).post().exec()
export const endGraphicConsultation  = data => new api("/b/instantMessaging/endGraphicConsultation").flup().query(data).post().exec()
// 结束咨询
export const imEndConsultation = data => new api("/b/instantMessaging/endConsultation").flup().query(data).post().exec()
// 添加成员
export const addDoctor = data => new api("/b/instantMessaging/addDoctor").flup().query(data).post().exec()
// 获取历史记录
export const historyQuery = data => new api("/b/instantMessaging/getHistoryQuery").flup().query(data).hideLoading().get().exec()
// 发消息回调接口
export const sendMessageCallback = data => new api("/b/instantMessaging/sendMessageCallback").flup().body(data).hideLoading().post().exec()
// 获取时间2
export const selectConsultRecordTime = data => new api("/b/instantMessaging/selectConsultRecordTime").flup().query(data).hideLoading().get().exec()
// 查询个案管理师列表5
export const selectManagerListByDept = data => new api("/b/plat/package/order/selectManagerListByDept").flup().query(data).hideLoading().get().exec()
// 切换个案管理师
export const switchManager = data => new api("/b/instantMessaging/switchManager").flup().query(data).post().exec()
// 获取权限列表
export const getPermissions = data => new api("/b/user/center/getPermissions").flup().query(data).hideLoading().get().exec()
// 获取售前咨询列表
export const selectPersonalConsultList = data => new api("/b/instantMessaging/selectPersonalConsultList").flup().body(data).hideLoading().post().exec()
// 售前咨询已读消息回调
export const personalReadMessageCallback = data => new api("/b/instantMessaging/personalReadMessageCallback").flup().query(data).hideLoading().get().exec()
// 售前咨询转介个管师
export const personalSwitchManager = data => new api("/b/instantMessaging/personalSwitchManager").flup().query(data).post().exec()
// 个案转回客服
export const backToCustomerService = data => new api("/b/instantMessaging/backToCustomerService").flup().query(data).get().exec()
export const selectConsultGraphicDetail  = data => new api("/b/instantMessaging/selectConsultGraphicDetail").flup().query(data).get().exec()
/////////////////////////////////////////////////小程序聊天常用语///////////////////////////////////////////////////////
// 列出常用语3
export const commonPhrasesQuery = data => new api("/b/commonPhrases/query").flup().query(data).hideLoading().get().exec()
// 删除常用语
export const commonPhrasesDelete = data => new api("/b/commonPhrases/delete").flup().query(data).post().exec()
// 移动常用语
export const commonPhrasesExchangeOrder = data => new api("/b/commonPhrases/exchangeOrder").flup().query(data).post().exec()
// 保存常用语
export const commonPhrasesSave = data => new api("/b/commonPhrases/save").flup().body(data).post().exec()
/////////////////////////////////////////////////问卷///////////////////////////////////////////////////////
// 发送问卷
export const sendConsultTemplateRoom = data => new api("/b/instantMessaging/sendConsultTemplateRoom").flup().body(data).post().exec()
// 查询问卷记录
export const queryConsultHistoryQuestionnaire = data => new api("/b/template/queryConsultHistoryQuestionnaire").flup().query(data).get().exec()
// 查询最新一条问卷咨询记录
export const queryLastConsultQuestionnaire = data => new api("/b/template/queryLastConsultQuestionnaire").flup().query(data).get().exec()
// 获取问卷详情
export const queryTemplateContent = data => new api("/c/template/querySaveContent").flup().query(data).get().exec()
export const queryTemplateContents = data => new api("/b/template/queryTemplateContent").flup().query(data).get().exec()
// 查询售前群组成员
export const selectPersonalGroupUserInfoList = data => new api("/b/instantMessaging/selectPersonalGroupUserInfoList").flup().query(data).hideLoading().get().exec()
// 健康咨询发消息回调
export const personalSendMessageCallback = data => new api("/b/instantMessaging/personalSendMessageCallback").flup().body(data).hideLoading().post().exec()
export const sendGraphicMessageCallback = data => new api("/b/instantMessaging/sendGraphicMessageCallback").flup().body(data).hideLoading().post().exec()
export const doctorIncreaseConsultTime = data => new api("/b/instantMessaging/doctorIncreaseConsultTime").flup().query(data).hideLoading().post().exec()
// 文件上传
export const uploadFile = data => new api("/file/upload").flup().body(data).hideLoading().post().exec()
/////////////////////////////////////////////////迭代5///////////////////////////////////////////////////////
export const getAllPackageClassListApi = data => new api("/c/PlatPackageInfo4C/getAllPackageClassList").flup().query(data).hideLoading().get().exec()
export const listPackageInfo = data => new api("/c/PlatPackageInfo4C/listPackageInfo").flup().query(data).hideLoading().get().exec()
export const flupGroupList = data => new api("/c/instantMessaging/getFlupGroupList").flup().query(data).hideLoading().get().exec()
export const selectAllPackageDept = data => new api("/c/instantMessaging/selectAllPackageDept").flup().query(data).hideLoading().get().exec()
export const getToDoFlupTask = data => new api("/b/flupPlan/getToDoFlupTask").flup().body(data).hideLoading().post().exec()
// 随访任务作废
export const deleteFuFlupPatientPlan = data => new api("/b/flupPatientPlan/deleteFuFlupPatientPlan").flup().query(data).hideLoading().post().exec()
// 完成
export const savePhoneFlupRecord = data => new api("/b/phoneFlup/savePhoneFlupRecord").flup().body(data).hideLoading().post().exec()
// 服务中改变聊天室AI开启状态
export const changeAiStatus = data => new api("/b/instantMessaging/changeAiStatus").flup().query(data).post().exec()
// 售前咨询改变聊天室AI开启状态
export const changePreAiStatus = data => new api("/b/instantMessaging/changePreAiStatus").flup().query(data).post().exec()
// 置顶备注
export const topOrCancelTopPatientRemark = data => new api("/b/personalRecord/TopOrCancelTopPatientRemark").flup().query(data).post().exec()
// 
export const dictPoByDictCode = data => new api("/b/SystemManage/BaseDict/getDictPoByDictCode").flup().query(data).hideLoading().get().exec()
export const GetDictItems = data => new api("/b/SystemManage/BaseDict/GetDictItems").flup().query(data).hideLoading().get().exec()
export const onePackageVerifyList = data => new api("/b/instantMessaging/personalRecord/getOnePackageVerifyList").flup().query(data).hideLoading().get().exec()
export const verifyOrderEquity = data => new api("/b/personalRecord/verifyOrderEquity").flup().query(data).hideLoading().post().exec()
export const updateOrInsertOrderEquity = (data1, data2) => new api("/b/personalRecord/updateOrInsertOrderEquity").flup().query(data1).body(data2).hideLoading().post().exec()
export const recallMsg = data => new api("/b/instantMessaging/recallMsg").flup().query(data).hideLoading().post().exec()
export const queryEmrDischargeRecordList = data => new api("/b/personalRecord/queryEmrDischargeRecordList").flup().query(data).hideLoading().get().exec()
export const queryEmrDischargeRecordDetail = data => new api("/b/personalRecord/queryEmrDischargeRecordDetail").flup().query(data).hideLoading().get().exec()
export const satisfaction = recordId => new api(`/c/satisfaction/${recordId}`).flup().hideLoading().post().exec()
export const patientRemark = data => new api("/b/personalRecord/getPatientRemark").flup().query(data).hideLoading().get().exec()
export const patientRemarkLog = data => new api("/b/personalRecord/getPatientRemarkLog").flup().query(data).hideLoading().get().exec()
export const editPatientRemark = data => new api("/b/personalRecord/editPatientRemark").flup().query(data).hideLoading().post().exec()
export const deletePatientRemark = data => new api("/b/personalRecord/deletePatientRemark").flup().query(data).hideLoading().post().exec()
export const insertPatientRemark = data => new api("/b/personalRecord/insertPatientRemark").flup().query(data).hideLoading().get().exec()
export const doctorInitiatesReferral = data => new api("/b/instantMessaging/doctorInitiatesReferral").flup().query(data).hideLoading().post().exec()
export const getTransferStatus = data => new api("/b/referral/getTransferStatus").referral().query().hideLoading().get().exec()
export const selectRecordList = data => new api("/b/referral/selectRecordList").referral().body(data).hideLoading().post().exec()
export const selectReferralApply = data => new api("/b/referral/selectReferralApply").referral().query(data).hideLoading().post().exec()
export const reviewRecord = data => new api("/b/referral/reviewRecord").referral().query(data.params).body(data.payload).hideLoading().post().exec()
export const admConditionInfo = data => new api("/b/his/zy/up/getAdmConditionInfo").referral().get().exec()
export const getIncomeInfo = data => new api("/b/plat/income/getIncomeInfo").flup().get().exec()
export const listGroupSelfIncome = data => new api("/b/plat/income/listGroupSelfIncome").flup().query(data).get().exec()
export const listLeaderGroupIncome = data => new api("/b/plat/income/listLeaderGroupIncome").flup().query(data).get().exec()
export const listGroupMemberIncome = data => new api("/b/plat/income/listGroupMemberIncome").flup().query(data).get().exec()
export const saveIncomeDistribution = data => new api("/b/plat/income/saveIncomeDistribution").flup().body(data).hideLoading().post().exec()
//下诊断-创建互联网医院订单
export const createOrder = data => new api("/order/create").flup().body(data).hideLoading().post().exec()
//一键延期
export const delayEquityDate = data => new api("/b/personalRecord/delayEquityDate").flup().query(data).hideLoading().post().exec()
//获取患者就诊记录 /c/patient/clinicRecordTotalList?
export const clinicRecordTotalList = data => new api("/c/patient/clinicRecordTotalList").flup().query(data).hideLoading().get().exec()