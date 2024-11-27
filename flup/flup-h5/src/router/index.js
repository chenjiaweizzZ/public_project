import Vue from 'vue'
import Router from 'vue-router'

if (!window.VueRouter) Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/',
			redirect: 'home'
		},
		{
			path: "/home",
			name: "home",
			component: resolve => require(["../pagesTransfer/home/index"], resolve),
			meta: {
				title: "橄榄云"
			}
		},
		{
			path: "/consult",
			name: "consult",
			component: resolve => require(["../pagesTransfer/consult/index"], resolve),
			meta: {
				title: "咨询"
			}
		},
		{
			path: "/shoppingCart",
			name: "shoppingCart",
			component: resolve => require(["../pagesTransfer/shoppingCart/index"], resolve),
			meta: {
				title: "预选方案"
			}
		},
		{
			path: "/core",
			name: "core",
			component: resolve => require(["../pagesTransfer/core/index"], resolve),
			meta: {
				title: "我的"
			}
		},
		{
			path: "/chat",
			name: "chat",
			component: resolve => require(["../pagesTransfer/chat/index"], resolve),
			meta: {
				title: "聊天",
				auth: true
			}
		},
		{
			path: "/call",
			name: "call",
			component: resolve => require(["../pagesTransfer/trtc/call"], resolve),
			meta: {
				title: "音视频聊天",
				auth: true
			}
		},
		{
			path: "/address",
			name: "address",
			component: resolve => require(["../pagesTransfer/address/index"], resolve),
			meta: {
				title: "收货地址",
				auth: true
			}
		},
		{
			path: "/feedback",
			name: "feedback",
			component: resolve => require(["../pagesTransfer/feedback/index"], resolve),
			meta: {
				title: "反馈与建议",
				auth: true
			}
		},
		{
			path: "/feedbackAdd",
			name: "feedbackAdd",
			component: resolve => require(["../pagesTransfer/feedback/feedbackAdd"], resolve),
			meta: {
				title: "反馈与建议",
				auth: true
			}
		},
		{
			path: "/feedbackDetail",
			name: "feedbackDetail",
			component: resolve => require(["../pagesTransfer/feedback/feedbackDetail"], resolve),
			meta: {
				title: "反馈与建议",
				auth: true
			}
		},
		{
			path: "/addAddress",
			name: "addAddress",
			component: resolve => require(["../pagesTransfer/addAddress/index"], resolve),
			meta: {
				title: "添加收货地址",
			}
		},
		{
			path: "/map",
			name: "map",
			component: resolve => require(["../pagesTransfer/map"], resolve),
			meta: {
				title: "地图"
			}
		},
		{
			path: "/knowledge",
			name: "knowledge",
			component: resolve => require(["../pagesTransfer/knowledge/index"], resolve),
			meta: {
				title: "健康知识"
			}
		},
		{
			path: "/knowledgeDetail",
			name: "knowledgeDetail",
			component: resolve => require(["../pagesTransfer/knowledgeDetail/index"], resolve),
			meta: {
				title: "健康知识"
			}
		},
		{
			path: "/featuredService",
			name: "featuredService",
			component: resolve => require(["../pagesTransfer/featuredService/index"], resolve),
			meta: {
				title: "特色服务"
			}
		},
		{
			path: "/featuredService2",
			name: "featuredService2",
			component: resolve => require(["../pagesTransfer/featuredService/index2"], resolve),
			meta: {
				title: "特色服务"
			}
		},
		{
			path: "/featuredSearch",
			name: "featuredSearch",
			component: resolve => require(["../pagesTransfer/featuredSearch/index"], resolve),
			meta: {
				title: "特色服务"
			}
		},
		{
			path: "/featureDocSearch",
			name: "featureDocSearch",
			component: resolve => require(["../pagesTransfer/featuredSearch/featureDocSearch"], resolve),
			meta: {
				title: "健康管理"
			}
		},
		{
			path: "/healthControl",
			name: "healthControl",
			component: resolve => require(["../pagesTransfer/healthControl/index"], resolve),
		},
		{
			path: "/firmOrder",
			name: "firmOrder",
			component: resolve => require(["../pagesTransfer/firmOrder/index"], resolve),
			meta: {
				title: '确认订单'
			}
		},
		{
			path: "/login",
			name: "login",
			component: resolve => require(["../pagesTransfer/login/index"], resolve),
			meta: {
				title: "绑定手机号"
			}
		},
		{
			path: "/phoneNumberChange",
			name: "phoneNumberChange",
			component: resolve => require(["../pagesTransfer/phoneNumberChange/index"], resolve),
			meta: {
				title: "修改手机号"
			}
		},
		{
			path: "/userManagement",
			name: "userManagement",
			component: resolve => require(["../pagesTransfer/userManagement/index"], resolve),
			meta: {
				title: "用户信息",
				auth: true
			}
		},
		{
			path: "/addUserManagement",
			name: "addUserManagement",
			component: resolve => require(["../pagesTransfer/addUserManagement/index"], resolve),
			meta: {
				title: "新增用户"
			}
		},
		{
			path: "/userDetails",
			name: "userDetails",
			component: resolve => require(["../pagesTransfer/userDetails/index"], resolve),
			meta: {
				title: "用户详情"
			}
		},
		{
			path: "/imageTextForm",
			name: "imageTextForm",
			component: resolve => require(["../pagesTransfer/imageTextConsult/form/index"], resolve),
			meta: {
				title: "图文咨询"
			}
		},
		{
			path: "/doctorDetail",
			name: "doctorDetail",
			component: resolve => require(["../pagesTransfer/doctorDetail/index"], resolve),
			meta: {
				title: "医生详情"
			}
		},
		{
			path: "/orderList",
			name: "orderList",
			component: resolve => require(["../pagesTransfer/orderList/index"], resolve),
			meta: {
				title: "订单列表",
				auth: true
			}
		},
		{
			path: "/orderDetails",
			name: "orderDetails",
			component: resolve => require(["../pagesTransfer/orderDetails/index"], resolve),
			meta: {
				title: "订单详情"
			}
		},
		{
			path: "/equityDetail",
			name: "equityDetail",
			component: resolve => require(["../pagesTransfer/orderDetails/equityDetail"], resolve),
			meta: {
				title: "权益详情"
			}
		},
		{
			path: "/invoicing",
			name: "invoicing",
			component: resolve => require(["../pagesTransfer/invoicing/index"], resolve),
			meta: {
				title: "发票开具"
			}
		},
		{
			path: "/paymentCompleted",
			name: "paymentCompleted",
			component: resolve => require(["../pagesTransfer/paymentCompleted/index"], resolve),
			meta: {
				title: "完成"
			}
		},
		{
			path: "/payAbnormal",
			name: "payAbnormal",
			component: resolve => require(["../pagesTransfer/payAbnormal"], resolve),
			meta: {
				title: "支付异常"
			}
		},
		{
			path: '/personalInformationS',
			name: 'personalInformationS',
			component: (resolve) => require(['../pagesTransfer/bind/index'], resolve),
			meta: {
				title: '绑定个人信息'
			}
		},
		{
			path: '/hospitalName',
			name: 'hospitalName',
			component: (resolve) => require(['../pagesTransfer/bind/hospitalName'], resolve),
			meta: {
				title: '医院选择'
			}
		},
		{
			path: '/healthFileS',
			name: 'healthFileS',
			component: (resolve) => require(['../pagesTransfer/heath_records/index'], resolve),
			meta: {
				title: '健康档案',
				auth: true
			}
		},
		{
			path: '/groupDetail',
			name: 'groupDetail',
			component: (resolve) => require(['../pagesTransfer/groupDetail/index'], resolve),
			meta: {
				title: '团队信息',
				auth: true
			}
		},
		{
			path: '/teamDetail',
			name: 'teamDetail',
			component: (resolve) => require(['../pagesTransfer/groupDetail/teamDetail'], resolve),
			meta: {
				title: '团队信息',
				auth: true
			}
		},
		{
			path: '/healthFileFuncList',
			name: 'healthFileFuncList',
			component: (resolve) => require(['../pagesTransfer/healthFileFuncList'], resolve),
			meta: {
				title: '健康档案功能',
				auth: true
			}
		},
		{
			path: '/healthFileFuncDetail',
			name: 'healthFileFuncDetail',
			component: (resolve) => require(['../pagesTransfer/healthFileFuncDetail'], resolve),
			meta: {
				title: '健康档案功能详情',
				auth: true
			}
		},
		//统一就诊人入口
		{
			path: '/transfer',
			name: 'transfer',
			component: (resolve) => require(['../pagesTransfer/transfer'], resolve),
			meta: {
				title: '',
				auth: true
			}
		},
		{
			path: '/report',
			name: 'report',
			component: (resolve) => require(['../pagesTransfer/reportV2'], resolve),
			meta: {
				title: '病历报告',
				auth: true
			}
		},
		{
			path: '/ncdReport',
			name: 'ncdReport',
			component: (resolve) => require(['../pagesTransfer/ncdReport'], resolve),
			meta: {
				title: '慢病综合评估报告',
				auth: true
			}
		},
		{
			path: '/ncdReportDetail',
			name: 'ncdReportDetail',
			component: (resolve) => require(['../pagesTransfer/ncdReportDetail'], resolve),
			meta: {
				title: '慢病综合评估报告详情',
				auth: true
			}
		},
		{
			path: '/healthTeach',
			name: 'healthTeach',
			component: (resolve) => require(['../pagesTransfer/healthTeach'], resolve),
			meta: {
				title: '健康宣教',
				auth: true
			}
		},
		{
			path: '/evalReport',
			name: 'evalReport',
			component: (resolve) => require(['../pagesTransfer/evalReport'], resolve),
			meta: {
				title: '评估报告',
				auth: true
			}
		},
		{
			path: '/FollowUp',
			name: 'FollowUp',
			component: (resolve) => require(['../pagesTransfer/FollowUp'], resolve),
			meta: {
				title: '健康计划',
				auth: true
			}
		},
		{
			path: '/taskDetail',
			name: 'taskDetail',
			component: (resolve) => require(['../pagesTransfer/taskDetail'], resolve),
			meta: {
				title: '任务详情',
				auth: true
			}
		},
		{
			path: '/evalReportLi',
			name: 'evalReportLi',
			component: (resolve) => require(['../pagesTransfer/evalReportLi'], resolve),
			meta: {
				title: '报告记录',
				auth: true
			}
		},
		{
			path: '/evalReportLiDetail',
			name: 'evalReportLiDetail',
			component: (resolve) => require(['../pagesTransfer/evalReportLiDetail'], resolve),
			meta: {
				title: '报告记录',
				auth: true
			}
		},
		{
			path: '/personalFiles',
			name: 'personalFiles',
			component: (resolve) => require(['../pagesTransfer/personalFiles'], resolve),
			meta: {
				title: '个人档案',
				auth: true
			}
		},
		{
			path: '/addDetailInfo',
			name: 'addDetailInfo',
			component: (resolve) => require(['../pagesTransfer/supply_info/index'], resolve),
			meta: {
				title: '个人信息补充',
				auth: true
			}
		},
		{
			path: '/healthMonitorList',
			name: 'healthMonitorList',
			component: (resolve) => require(['../pagesTransfer/healthMonitorList'], resolve),
			meta: {
				title: '健康监测',
				auth: true
			}
		},
		{
			path: '/submit',
			name: 'submit',
			component: (resolve) => require(['../pagesTransfer/submit'], resolve),
			meta: {
				title: '提交成功'
			}
		},
		{
			path: '/checkByPatient',
			name: 'checkByPatient',
			component: (resolve) => require(['../pagesTransfer/inspection'], resolve),
			meta: {
				title: '检查项目'
			}
		},
		{
			path: '/dcwj',
			name: 'dcwj',
			component: (resolve) => require(['../pagesTransfer/questionaire_content'], resolve),
			meta: {
				title: '调查问卷'
			}
		},
		{
			path: '/yytx',
			name: 'yytx',
			component: (resolve) => require(['../pagesTransfer/medication_reminder'], resolve),
			meta: {
				title: '用药提醒'
			}
		},
		{
			path: '/jkxj',
			name: 'jkxj',
			component: (resolve) => require(['../pagesTransfer/propaganda_content'], resolve),
			meta: {
				title: '健康宣教'
			}
		},
		{
			path: '/tjxj',
			name: 'tjxj',
			component: (resolve) => require(['../pagesTransfer/special_inspection_propaganda'], resolve),
			meta: {
				title: '特检宣教'
			}
		},
		{
			path: '/healthmonitor',
			name: 'healthmonitor',
			component: (resolve) => require(['../pagesTransfer/healthmonitor'], resolve),
			meta: {
				title: '健康监测',
				auth: true
			}
		},
		{
			path: '/devicesList',
			name: 'devicesList',
			component: (resolve) => require(['../pagesTransfer/devicesList'], resolve),
			meta: {
				title: '设备列表'
			}
		},
		{
			path: '/devicesChoose',
			name: 'devicesChoose',
			component: (resolve) => require(['../pagesTransfer/devicesChoose'], resolve),
			meta: {
				title: '设备列表'
			}
		},
		{
			path: '/myMessage',
			name: 'myMessage',
			component: (resolve) => require(['../pagesTransfer/myMessage'], resolve),
			meta: {
				title: '我的消息'
			}
		},
		{
			path: '/sendAMessage',
			name: 'sendAMessage',
			component: (resolve) => require(['../pagesTransfer/sendAMessage'], resolve),
			meta: {
				title: '查看消息'
			}
		},
		{
			path: '/contractManagement',
			name: 'contractManagement',
			component: (resolve) => require(['../pagesTransfer/signUps/contractManagement'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/application',
			name: 'application',
			component: (resolve) => require(['../pagesTransfer/signUps/application'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/mySigning',
			name: 'mySigning',
			component: (resolve) => require(['../pagesTransfer/signUps/mySigning'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/servicePackDetails',
			name: 'servicePackDetails',
			component: (resolve) => require(['../pagesTransfer/signUps/servicePackDetails'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/chooseADoctor',
			name: 'chooseADoctor',
			component: (resolve) => require(['../pagesTransfer/signUps/chooseADoctor'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/pay',
			name: 'pay',
			component: (resolve) => require(['../pagesTransfer/signUps/pay'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/paymentResult',
			name: 'paymentResult',
			component: (resolve) => require(['../pagesTransfer/signUps/paymentResult'], resolve),
			meta: {
				title: '签约管理'
			}
		},
		{
			path: '/followUpTaskDetails',
			name: 'followUpTaskDetails',
			component: (resolve) => require(['../pagesTransfer/followUpTaskDetails'], resolve),
			meta: {
				title: '随访任务'
			}
		},
		{
			path: '/cftx',
			name: 'cftx',
			component: (resolve) => require(['../pagesTransfer/prescription_content'], resolve),
			meta: {
				title: '处方提醒'
			}
		},
		{
			path: '/SubscriptionManagement',
			name: 'SubscriptionManagement',
			component: (resolve) => require(['../pagesTransfer/signUps/SubscriptionManagement'], resolve),
			meta: {
				title: '订阅管理'
			}
		},
		//医护端界面------------------------------------------------------------------
		{
			path: '/Doctor-binding',
			name: 'bindingDoctor',
			component: (resolve) => require(['../medicalCareEdition/bindingDoctor'], resolve),
			meta: {
				title: '绑定医生个人信息'
			}
		},
		{
			path: '/Doctor-homepage',
			name: 'homepage',
			component: (resolve) => require(['../medicalCareEdition/homepage'], resolve),
			meta: {
				title: '医生主页'
			}
		},
		{
			path: '/Doctor-myMessage',
			name: 'myMessage',
			component: (resolve) => require(['../medicalCareEdition/myMessage'], resolve),
			meta: {
				title: '我的消息'
			}
		},
		{
			path: '/Doctor-sendAMessage',
			name: 'sendAMessage',
			component: (resolve) => require(['../medicalCareEdition/sendAMessage'], resolve),
			meta: {
				title: '发送消息'
			}
		},
		{
			path: '/Doctor-myAttention',
			name: 'myAttention',
			component: (resolve) => require(['../medicalCareEdition/myAttention'], resolve),
			meta: {
				title: '我关注的患者'
			}
		},
		{
			path: '/Doctor-FollowUpPlan',
			name: 'FollowUpPlan',
			component: (resolve) => require(['../medicalCareEdition/FollowUpPlan'], resolve),
			meta: {
				title: '我的随访计划'
			}
		},
		{
			path: '/Doctor-patientList',
			name: 'patientList',
			component: (resolve) => require(['../medicalCareEdition/patientList'], resolve)
			// meta: {
			//   title: "随访患者列表"
			// }
		},
		{
			path: '/Doctor-patientPlan',
			name: 'patientPlan',
			component: (resolve) => require(['../medicalCareEdition/patientPlan'], resolve),
			meta: {
				title: '患者随访计划'
			}
		},
		{
			path: '/Doctor-patientTelemonitor',
			name: 'patientTelemonitor',
			component: (resolve) => require(['../medicalCareEdition/patientHealthTelemonitor'], resolve),
			meta: {
				title: '个人档案'
			}
		},
		{
			path: '/Doctor-patientDischargeDetail',
			name: 'patientDischargeDetail',
			component: (resolve) => require(['../medicalCareEdition/patientDischargeDetail.vue'], resolve),
			meta: {
				title: '出院详情'
			}
		},
		{
			path: '/Doctor-chronicCareManagement',
			name: 'chronicCareManagement',
			component: (resolve) => require(['../medicalCareEdition/chronicCareManagement'], resolve),
			meta: {
				title: '我的慢病管理'
			}
		},
		{
			path: '/Doctor-chronicDiseasePatient',
			name: 'chronicDiseasePatient',
			component: (resolve) => require(['../medicalCareEdition/chronicDiseasePatient'], resolve),
			meta: {
				title: '慢病患者列表'
			}
		},
		{
			path: '/Doctor-healthMonitoring',
			name: 'healthMonitoring',
			component: (resolve) => require(['../medicalCareEdition/healthMonitoring'], resolve),
			meta: {
				title: '健康监测'
			}
		},
		{
			path: '/Doctor-myToAudit',
			name: 'myToAudit',
			component: (resolve) => require(['../medicalCareEdition/myToAudit'], resolve),
			meta: {
				title: '我的待审核'
			}
		},
		{
			path: '/Doctor-auditList',
			name: 'auditList',
			component: (resolve) => require(['../medicalCareEdition/auditList'], resolve),
			meta: {
				title: '审核列表'
			}
		},
		{
			path: '/Doctor-ReviewTheDetails',
			name: 'ReviewTheDetails',
			component: (resolve) => require(['../medicalCareEdition/ReviewTheDetails'], resolve),
			meta: {
				title: '审核详情'
			}
		},
		{
			path: '/Doctor-chronicDiseaseAudit',
			name: 'chronicDiseaseAudit',
			component: (resolve) => require(['../medicalCareEdition/chronicDiseaseAudit'], resolve),
			meta: {
				title: '慢病审核'
			}
		},
		{
			path: '/Doctor-questionnaire',
			name: 'questionnaire',
			component: (resolve) => require(['../medicalCareEdition/questionnaire'], resolve),
			meta: {
				title: '问卷宣教'
			}
		},
		{
			path: '/Doctor-CheckTheInspection',
			name: 'CheckTheInspection',
			component: (resolve) => require(['../medicalCareEdition/CheckTheInspection'], resolve),
			meta: {
				title: '随访任务查看'
			}
		},
		{
			path: '/bindAndRegistration',
			name: 'bindAndRegistration',
			component: (resolve) => require(['../pagesTransfer/bind/bindAndRegistration'], resolve),
			meta: {
				title: '统一就诊人页面'
			}
		},
		{
			path: '/Doctor-emrExamDetail',
			name: 'emrExamDetail',
			component: (resolve) => require(['../medicalCareEdition/emrExamDetail.vue'], resolve),
			meta: {
				title: '检查详情'
			}
		},
		{
			path: '/Doctor-emrLabDetail',
			name: 'emrLabDetail',
			component: (resolve) => require(['../medicalCareEdition/emrLabDetail.vue'], resolve),
			meta: {
				title: '检验详情'
			}
		},
		{
			path: "/evaluationResults",
			name: "evaluationResults",
			component: resolve => require(["../components/evaluationResults"], resolve),
			meta: {
				title: "测评结果"
			}
		},
		//中转页面
		{
			path: '/transport',
			name: 'transport',
			component: (resolve) => require(['../pagesTransfer/transport'], resolve),
			meta: {
				title: '',
				auth: true,
			}
		},
		{
			path: '/transportV2',
			name: 'transportV2',
			component: (resolve) => require(['../pagesTransfer/transportV2'], resolve),
			meta: {
				title: '跳转中...',
			}
		},
		{
			path: "/diagnoseDetail",
			name: "diagnoseDetail",
			component: resolve => require(["../pagesTransfer/chat/diagnoseDetail"], resolve),
			meta: {
				title: "开单详情"
			}
		},
	]
})

router.beforeEach((to, from, next) => {
	if (
		to.matched.some((record) => {
			return record.meta.auth
		})
	) {
		if (sessionStorage.user) {
			next()
		} else {
			if (to.name == 'transfer') {
				next()
			} else {
				let openId = localStorage.getItem('openId') || (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).openId || to.query.openId : '')
				Vue.prototype.$apis.getPatientInfo({ openId }).then(async (res) => {
					if (res) {
						let userInfo = Object.assign({}, JSON.parse(localStorage.getItem('userInfo')), res.retData)
						localStorage.setItem('userInfo', JSON.stringify(userInfo))
						if (to.path == '/chat' && !to.query.roomId) {
							let { retData } = await Vue.prototype.$apis.preSalesConsultation({});
							// let imUrl = JSON.parse(retData.imUrl);
							let imData = await Vue.prototype.$apis.getIMData(retData.userId)
							let imUrl = JSON.parse(imData.retData)
							let userSig = imUrl.userSig;
							let roomId = retData.roomId;
							let patientId = JSON.parse(localStorage.getItem('userInfo')).userId;
							localStorage.setItem('userId', patientId);
							localStorage.setItem('userSig', userSig);
							let consultId = retData.id;
							let newQuery = {
								consultId,
								serviceStatus: 0,
								patientId,
								patientName: JSON.parse(localStorage.getItem('userInfo')).patientName,
								roomId,
								preSales: 1,//1售前
							}
							next({ ...to, query: { ...newQuery, ...to.query } })
						} else {
							next()
						}
					} else {
						next({
							path: '/info-bind',
							query: { redirect: to.fullPath, ...to.query }
						})
					}
				}).catch((err) => {
					let name = window.location.href.split('/#/')[0] + '/#/transportV2';
					let redirect_uri = encodeURIComponent(name);
					sessionStorage.setItem('path', JSON.stringify(to));
					window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.globalURL.APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${window.globalURL.hospitalId}&connect_redirect=1#wechat_redirect`;
				})
			}
		}
	} else {
		if (to.name == 'consult' && (from.name == 'chat' || from.name == 'login')) {
			next({
				path: '/home',
				replace: true
			})
		}
		else if (to.name == 'healthControl' && from.name == 'imageTextForm') {
			next({
				path: '/home',
				replace: true
			})
		}
		else {
			next()
		}
	}
})

export default router
