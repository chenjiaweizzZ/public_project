var _ = require('lodash');
import router from '../router'
import { MessageBox } from 'element-ui';
export default {
	initLogin(state, login) {
		state.login = login;
	},
	checkToken(state, type) {
		if (!type) {
			MessageBox.confirm('登录信息失效，请重新登录！', '提示', {
				confirmButtonText: '确定',
				showCancelButton: false,
				type: 'warning'
			}).then(() => {
				let url = window.location.origin + "/mpg/index.html#/"
				window.location.href = url
			})
		}
	},
	initSysType(state, sysType) {
		state.sysType = sysType
		// 系统模块 escort 4-护培 5-药培 yaopei  6-专培 zhuanpei  7-技师 jishi 8-全科 quanke
		// state.sysTypeNum = sysType == 'escort' ? 4 : ''
		switch (sysType) {
			case 'escort':
				state.sysTypeNum = 4
				break;
			case 'yaopei':
				state.sysTypeNum = 5
				break;
			case 'zhuanpei':
				state.sysTypeNum = 6
				break;
			case 'jishi':
				state.sysTypeNum = 7
				break;

			case 'quanke':
				state.sysTypeNum = 8
				break;

			default:
				break;
		}
	},
	initUserRole(state, role) {
		state.userRole = role;
	},
	initDeptIdList(state, list) {
		state.deptIdList = list;
	},
	initDeptBase(state, list) {
		_.union(state.deptBase, list);
	},
	initDeptRoom(state, list) {
		_.union(state.deptRoom, list);
	},
	initMenuList(state, list) {
		state.menuList = list;
		/*if(state.menuList.length>0){
			router.push({path:state.menuList[0].url});
		}*/

	},
	initDeptBase(state, list) {
		state.deptBase = list;
	},
	initDeptRoom(state, list) {
		state.deptRoom = list;
	},
	initDeptList(state, list) {
		state.deptList = list;
	},
	initDeptBaseList(state, list) {
		state.deptBaseList = list;
	},
	initMainlistList(state, list) {
		state.mainList = list;
	},
	initGradeList(state, list) {
		state.gradeList = list;
	},
	initDegreeList(state, list) {
		state.degreeList = list;
	},
	initStudentDegreeList(state, list) {
		state.studentDegreeList = list;
	},
	initProfessionList(state, list) {
		state.professionList = list;
	},
	initStuTypeList(state, list) {
		state.stuTypeList = list;
	},
	initNationList(state, list) {
		state.nationList = list;
	},
	initTitleList(state, list) {
		state.titleList = list;
	},
	initEducationList(state, list) {
		state.educationList = list;
	},
	initTechniqueList(state, list) {
		state.techniqueList = list;
	},
	initTechingList(state, list) {
		state.techingList = list;
	},
	initCardList(state, list) {
		state.cardList = list;
	},
	initTurnYearsList(state, list) {
		state.turnYearsList = list;
	},
	initMedicalList(state, list) {
		state.medicalList = list;
	},
	initHospitalAttributesList(state, list) {
		state.hospitalAttributesList = list;
	},
	initHospitalCategoryList(state, list) {
		state.hospitalCategoryList = list;
	},
	initPrimaryMedicalList(state, list) {
		state.primaryMedicalList = list;
	},
	initHospitalList(state, list) {
		state.hospitalList = list;
	},
	initSystemType(state, list) {
		state.systemType = list.num;
		state.loginType = list.num ? 'LoginUG' : 'Login';
	},
	//新增下拉列表
	initAllOption(state, { key, value }) {
		state.allOption[key] = value;
	},
	initGradListUG(state, list) {
		state.gradlistUG = list;
	},
	initHospitalInfour(state, list) {
		state.hospital = list;
	},
	//导入信息错误
	setErrorImport(state, info) {
		state.errorImportData.show = true;
		state.errorImportData.data = info;
	},
	//导入信息错误
	setRuleSetting(state, info) {
		state.rulesVisible = info;
	},
	//设置实习轮转小组轮次数据
	setinternshipRotation(state, { key, value }) {
		state.internshipData[key] = value;
	},
	setStagecount(state, { key, value }) {
		state.stagecount = value;
	},
	setRoleAuthority(state, oprateMenu) {
		state.roleAuthority = oprateMenu;
	},
	setStuTypeList(state, data) {
		state.selectOptions = data;
	},
}
