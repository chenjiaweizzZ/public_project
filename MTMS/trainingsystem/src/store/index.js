import Vue from 'vue'
import 'babel-polyfill'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex);

const state = {
	sysType: "", // escort:护陪
	sysTypeNum: "",
	roleAuthority: {}, // 角色权限
	login: false,//是否登录
	userRole: [],//所属角色
	menuList: [],//pc菜单列表
	appMenuList: [],//app菜单列表
	deptBase: [],//所属基地
	deptRoom: [],//所属科室
	deptIdList: [],//所属部门

	deptList: [],//所有轮转科室
	selectOptions: {}, // 字典请求数据
	deptBaseList: [],//所有基地
	gradeList: [],//所有年级
	roleList: [],//所有角色
	mailList: [],//所有科室
	//下拉框数据
	degreeList: [],//职工学位下拉项
	studentDegreeList: [],//学生学位下拉
	professionList: [],//培训专业
	stuTypeList: [],//学员类型
	nationList: [],//民族
	titleList: [],//职位
	educationList: [],//学历
	cardList: [],//证件类型
	techniqueList: [],//技术职称
	techingList: [],//教学职称
	turnYearsList: [],//培训年限

	//页面级下拉框
	medicalList: [],//医疗卫生机构
	hospitalAttributesList: [],//医院属性
	hospitalCategoryList: [],//医院类别
	primaryMedicalList: [],//基层医疗卫生机构
	hospitalList: [],//单位性质

	//甄别系统 0:住陪 1:实习
	systemType: 0,
	loginType: 'Login',
	//新增实习生下拉选项列表
	allOption: {
		lengthschooling: [],//学制
		nationality: [],//国籍
		stdtype: [],//类型
		card: [],//证件类型
		hospitallevel: [], // 医院级别
		hospitalgrade: [], // 医院等次
		hospitalcategory: [], // 医疗卫生机构类别
		hospitalAttributes: [], // 医疗卫生机构隶属关系
		base: [], // 专业
	},
	gradlistUG: [],//年级
	hospital: {},//所有权限下的基地科室病区,
	//导入错误信息提醒
	errorImportData: { show: false, data: [] },
	//实习生智能排轮转
	rulesVisible: true,
	internshipData: { group: [], round: [] },
	stagecount: ''
}

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
